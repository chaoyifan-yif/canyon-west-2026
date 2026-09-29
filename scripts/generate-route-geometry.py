"""Refresh the self-hosted road shapes from OSRM's public routing API.

This is build-time planning data, not live navigation. The website never sends
the traveler's saved notes or private lodging address to a routing service.
"""
import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STOPS = {
    "rental": (-115.1645060, 36.0600487),
    "walmart": (-115.11568, 36.267711),
    "zionvc": (-112.987139, 37.200190),
    "zion": (-112.940495, 37.213178),
    "brycepoint": (-112.15666, 37.603990),
    "sunset": (-112.1671190, 37.6234283),
    "hatch": (-112.4343730, 37.6497019),  # town centre, never the private Airbnb door
    "sunrise": (-112.1645174, 37.6312455),
    "ken": (-111.4112, 36.9026),
    "home2": (-111.4744704, 36.9209256),
    "horse": (-111.5023125, 36.8766318),
    "desert": (-111.8262067, 36.0440087),
    "navajo": (-111.83749, 36.03862),
    "moran": (-111.9242724, 36.0052133),
    "grandview": (-111.9859972, 35.9960950),
    "mather": (-112.1090343, 36.0617222),
    "yavapai": (-112.1176287, 36.0660626),
    "fairfield": (-111.5781701, 35.2153510),
    "aspen": (-111.720472, 35.319444),
    "seligman": (-112.876122, 35.326686),
    "kingman": (-114.0589690, 35.1891481),
}
PLANS = {
    "oct04_overlook": ["rental", "walmart", "zionvc", "zion", "sunset", "sunrise", "hatch"],
    "oct04_canyon": ["rental", "walmart", "zionvc", "sunrise", "hatch"],
    "oct05": ["hatch", "sunrise", "ken", "home2"],
    "oct06_direct": ["home2", "horse", "desert", "navajo", "moran", "grandview", "mather", "yavapai", "fairfield"],
    "oct06_core": ["home2", "horse", "desert", "navajo", "moran", "grandview", "mather", "yavapai", "desert", "fairfield"],
    "oct07": ["fairfield", "aspen", "seligman", "kingman", "rental"],
}


def perpendicular_distance(p, a, b):
    dx, dy = b[0] - a[0], b[1] - a[1]
    if not (dx or dy):
        return ((p[0] - a[0]) ** 2 + (p[1] - a[1]) ** 2) ** .5
    t = max(0, min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)))
    return ((p[0] - a[0] - t * dx) ** 2 + (p[1] - a[1] - t * dy) ** 2) ** .5


def simplify(points, tolerance=.00045):
    if len(points) < 3:
        return points
    index, longest = 0, 0
    for i in range(1, len(points) - 1):
        distance = perpendicular_distance(points[i], points[0], points[-1])
        if distance > longest:
            index, longest = i, distance
    if longest <= tolerance:
        return [points[0], points[-1]]
    return simplify(points[:index + 1], tolerance)[:-1] + simplify(points[index:], tolerance)


def fetch_plan(stops):
    coords = ";".join(f"{STOPS[s][0]},{STOPS[s][1]}" for s in stops)
    url = f"https://router.project-osrm.org/route/v1/driving/{coords}?overview=false&steps=true&geometries=geojson"
    for attempt in range(4):
        try:
            request = urllib.request.Request(url, headers={"User-Agent": "CanyonWest2026/1.0 (personal itinerary)"})
            with urllib.request.urlopen(request, timeout=45) as response:
                data = json.load(response)
            if data.get("code") != "Ok":
                raise RuntimeError(data.get("message", data.get("code")))
            route = data["routes"][0]
            result = []
            for a, b, leg in zip(stops, stops[1:], route["legs"]):
                points = []
                for step in leg["steps"]:
                    part = step["geometry"]["coordinates"]
                    points.extend(part[1:] if points and points[-1] == part[0] else part)
                reduced = simplify(points)
                result.append({"from": a, "to": b, "km": round(leg["distance"] / 1000, 1), "minutes": round(leg["duration"] / 60), "line": [[round(x, 5), round(y, 5)] for x, y in reduced]})
            return result
        except Exception:
            if attempt == 3:
                raise
            time.sleep(2 + attempt * 2)


if __name__ == "__main__":
    routes = {}
    for name, stops in PLANS.items():
        print("Fetching", name, flush=True)
        routes[name] = fetch_plan(stops)
    output = ROOT / "dist" / "route-geometry.js"
    output.write_text("/* OSRM road geometry snapshot; planning only, not live traffic or turn-by-turn navigation. */\nconst ROUTE_GEOMETRY=" + json.dumps(routes, separators=(",", ":")) + ";\n", encoding="utf-8")
    print("Wrote", output, "with", sum(len(x["line"]) for legs in routes.values() for x in legs), "road points")
