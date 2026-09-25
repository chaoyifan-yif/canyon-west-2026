"""Safe HTTPS/API smoke test on the server loopback; does not add test trip data."""
import http.client
import json
from pathlib import Path
import ssl

PREFIX = '/travel/us-west-lasvegas/api/'
ORIGIN = 'https://www.chaoyifan666.fun'
PASSWORD = Path('/root/canyon-guide-access.txt').read_text(encoding='utf-8').strip()
COOKIE = ''


def request(method, endpoint, body=None, origin=True):
    connection = http.client.HTTPSConnection('127.0.0.1', 443,
                                            context=ssl._create_unverified_context())
    headers = {'Host': 'www.chaoyifan666.fun', 'X-Guide-Request': '1'}
    if origin:
        headers['Origin'] = ORIGIN
    if COOKIE:
        headers['Cookie'] = COOKIE
    raw = json.dumps(body).encode() if body is not None else None
    if raw:
        headers['Content-Type'] = 'application/json'
    connection.request(method, PREFIX + endpoint, body=raw, headers=headers)
    response = connection.getresponse()
    payload = json.loads(response.read())
    cookie = response.getheader('Set-Cookie')
    status = response.status
    connection.close()
    return status, payload, cookie


assert request('GET', 'health')[0] == 200
assert request('GET', 'state')[0] == 401
assert request('POST', 'login', {'password': PASSWORD}, origin=False)[0] == 403
status, _, cookie = request('POST', 'login', {'password': PASSWORD})
assert status == 200 and cookie and 'HttpOnly' in cookie and 'Secure' in cookie
COOKIE = cookie.split(';', 1)[0]
status, state, _ = request('GET', 'state')
assert status == 200 and isinstance(state['state'], dict)
status, update, _ = request('PUT', 'state', {'revision': state['revision'], 'state': state['state']})
assert status == 200 and update['revision'] == state['revision'] + 1
assert request('PUT', 'state', {'revision': state['revision'], 'state': state['state']})[0] == 409
assert request('GET', 'state')[1]['revision'] == update['revision']
assert request('POST', 'logout', {})[0] == 200
assert request('GET', 'state')[0] == 401
print('HTTPS private API smoke test passed: health, auth, Origin protection, MySQL revision, conflict, logout')
