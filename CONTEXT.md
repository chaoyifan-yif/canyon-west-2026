# Southwest guide v2 — editorial record

Updated 2026-09-27. Rebuilt from the planning conversation, selected bookings, original static source and official sources linked in the site. The route atlas now uses self-hosted OSRM road geometry captured at build time; it is not live navigation.

## Latest decisions prevail

- Oct 2–4 SpringHill Suites Las Vegas Convention Center, 2989 Paradise Road.
- Oct 4–5 selected Airbnb room 1689900141044616225, Canyon Glow Retreat in Hatch. No private street address or door code is published. The user can enter the verified booking address locally.
- Oct 5–6 Home2 Suites by Hilton Page Lake Powell, 681 Scenic View Rd.
- Oct 6–7 Fairfield Inn & Suites Flagstaff East, 1000 North Country Club Drive. Not the other Fairfield in Flagstaff.
- Oct 7 flight departs LAS at 19:50, superseding original 19:55. Return target 17:45 at Hertz is a planning buffer, not a hard airline rule. Terminal and inbound flight details need the actual ticket.
- No Vegas rental car on Oct 2–3; Hertz LAS 09:30 Oct 4 per screenshot. Business discount eligibility must not be assumed for personal travel.
- Friday monorail 24-hour ticket starts at first scan; Saturday late return may require a single ride. Sunday Uber goes directly to the Rent-A-Car Center.

## Retained routes / explicit changes

- Zion Canyon Overlook only; no main canyon shuttle/Narrows/Angels Landing.
- Bryce sunset Oct 4 and Queen's Garden/Navajo Two Bridges loop Oct 5. Hatch implies a return drive next morning; this is included.
- Oct 3 Bellagio O show at 21:00 is user-confirmed as booked. Ken's Lower Antelope is planned for 16:00 Oct 5; verify against its electronic ticket.
- Oct 6 Horseshoe Bend, east entrance/Desert View, east-to-west South Rim viewpoints, Flagstaff. A route watches sunset at Yavapai and drives south to Flagstaff. B route leaves Yavapai by 16:15, backtracks approximately 38 km to Desert View, watches sunset there and attempts low Galactic Core after astronomical twilight, then drives to Flagstaff. Both branches appear in the map and day timeline. Ooh Aah hike is not in either branch.
- Lipan Point removed based on NPS June22–Dec23 2026 closure notice.
- Oct 7 Aspen Corner if autumn colour and weather cooperate, then Seligman and optional Kingman short stop before LAS. Williams is a drive-through rather than a scheduled stop. No added Monument Valley, Hoover Dam, Valley of Fire or Oatman. Cut optional stops if delayed.
- Old meal choices preserved where feasible: Grand Lux Venetian, Eataly, Bellagio Noodles, Ruby's, Big John's, Westside Lilo's. Added conditional late Flagstaff dinner at Lumberyard; published closing hour is NOT a verified kitchen-last-order time.

## Evidence boundaries

All start/end times except stated appointments/flights are proposed execution times. Driving estimates are not live traffic measurements. Hotel selection is user-confirmed but payments/confirmation numbers are not accessed. Historic screenshot rates are not current quotes. Year-card costs must use 2026 rules and actual residency eligibility, not assume $80 for every traveler. Restaurant windows and travel conditions must be rechecked before departure.

## Privacy and deployment

The site is served from the Aliyun Nginx path `/travel/us-west-lasvegas/`. LocalStorage stores private address, notes, confirmations and checks; the optional password-protected cloud API syncs selected personal fields to the user's MySQL only after login. No passwords, confirmation numbers or private lodging addresses belong in the public Git repository. Exported personal backup contains private inputs and is explicitly labelled. Static offline HTML includes public itinerary and road atlas, not private inputs.
