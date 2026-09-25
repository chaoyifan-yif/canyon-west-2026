"""Small private state API for the public travel guide. Bind only to 127.0.0.1.

Requires PyMySQL; Nginx provides HTTPS and the /travel/us-west-lasvegas/api/ path.
No payment card, booking confirmation, or door code belongs in this state.
"""
import hashlib
import hmac
import json
import os
import secrets
import time
from http import HTTPStatus
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import pymysql


PREFIX = '/travel/us-west-lasvegas/api/'
COOKIE = 'canyon_guide_session'
ALLOWED_ORIGIN = os.environ.get('GUIDE_ORIGIN', 'https://www.chaoyifan666.fun')
MAX_BYTES = 300_000
SALT = bytes.fromhex(os.environ['GUIDE_ACCESS_SALT'])
ACCESS_HASH = bytes.fromhex(os.environ['GUIDE_ACCESS_HASH'])
DB_CONFIG = dict(host='127.0.0.1', port=3306, user=os.environ['GUIDE_DB_USER'],
                 password=os.environ['GUIDE_DB_PASSWORD'], database=os.environ['GUIDE_DB_NAME'],
                 charset='utf8mb4', autocommit=False, cursorclass=pymysql.cursors.DictCursor)
ATTEMPTS = {}


def db():
    return pymysql.connect(**DB_CONFIG)


class Handler(BaseHTTPRequestHandler):
    server_version = 'CanyonGuideAPI/1.0'

    def log_message(self, fmt, *args):
        # Never log password, cookie, or state payload.
        print('%s %s' % (self.address_string(), fmt % args), flush=True)

    def send_json(self, status, body, cookie=None):
        raw = json.dumps(body, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(raw)))
        self.send_header('Cache-Control', 'no-store, private')
        self.send_header('X-Content-Type-Options', 'nosniff')
        if cookie:
            self.send_header('Set-Cookie', cookie)
        self.end_headers()
        self.wfile.write(raw)

    def body(self):
        try:
            length = int(self.headers.get('Content-Length', '0'))
        except ValueError:
            length = 0
        if length <= 0 or length > MAX_BYTES or self.headers.get('Content-Type', '').split(';')[0].strip() != 'application/json':
            raise ValueError('invalid body')
        return json.loads(self.rfile.read(length))

    def same_origin(self):
        return (self.headers.get('Origin') == ALLOWED_ORIGIN and
                self.headers.get('X-Guide-Request') == '1')

    def session_token(self):
        jar = SimpleCookie()
        try:
            jar.load(self.headers.get('Cookie', ''))
        except Exception:
            return None
        item = jar.get(COOKIE)
        return item.value if item and len(item.value) == 64 else None

    def authenticated(self):
        token = self.session_token()
        if not token:
            return False
        with db() as conn:
            with conn.cursor() as cur:
                cur.execute('SELECT 1 FROM guide_sessions WHERE token_hash=%s AND expires_at>NOW() LIMIT 1',
                            (hashlib.sha256(token.encode()).hexdigest(),))
                return cur.fetchone() is not None

    def do_GET(self):
        if self.path == PREFIX + 'health':
            return self.send_json(200, {'ok': True})
        if self.path != PREFIX + 'state':
            return self.send_json(404, {'error': 'not found'})
        if not self.authenticated():
            return self.send_json(401, {'error': 'login required'})
        with db() as conn:
            with conn.cursor() as cur:
                cur.execute('SELECT revision, state_json FROM guide_state WHERE id=1')
                row = cur.fetchone()
        return self.send_json(200, {'revision': row['revision'], 'state': json.loads(row['state_json'])})

    def do_POST(self):
        if not self.same_origin():
            return self.send_json(403, {'error': 'origin rejected'})
        if self.path == PREFIX + 'login':
            try:
                body = self.body()
                password = body.get('password', '')
                if not isinstance(password, str) or len(password) > 256:
                    raise ValueError()
            except (ValueError, json.JSONDecodeError):
                return self.send_json(400, {'error': 'invalid request'})
            ip = self.headers.get('X-Real-IP', self.client_address[0])
            now = time.time()
            recent = [t for t in ATTEMPTS.get(ip, []) if now - t < 900]
            if len(recent) >= 8:
                return self.send_json(429, {'error': 'too many attempts; wait 15 minutes'})
            candidate = hashlib.scrypt(password.encode(), salt=SALT, n=2**15, r=8, p=1,
                                       maxmem=64 * 1024 * 1024)
            if not hmac.compare_digest(candidate, ACCESS_HASH):
                ATTEMPTS[ip] = (recent + [now])[-8:]
                return self.send_json(401, {'error': 'wrong password'})
            ATTEMPTS.pop(ip, None)
            token = secrets.token_hex(32)
            digest = hashlib.sha256(token.encode()).hexdigest()
            with db() as conn:
                with conn.cursor() as cur:
                    cur.execute('DELETE FROM guide_sessions WHERE expires_at < NOW()')
                    cur.execute('INSERT INTO guide_sessions(token_hash,expires_at) VALUES(%s,DATE_ADD(NOW(), INTERVAL 30 DAY))', (digest,))
                conn.commit()
            cookie = f'{COOKIE}={token}; Path=/travel/us-west-lasvegas/; Max-Age=2592000; HttpOnly; Secure; SameSite=Strict'
            return self.send_json(200, {'ok': True}, cookie)
        if self.path == PREFIX + 'logout':
            token = self.session_token()
            if token:
                with db() as conn:
                    with conn.cursor() as cur:
                        cur.execute('DELETE FROM guide_sessions WHERE token_hash=%s', (hashlib.sha256(token.encode()).hexdigest(),))
                    conn.commit()
            return self.send_json(200, {'ok': True}, f'{COOKIE}=; Path=/travel/us-west-lasvegas/; Max-Age=0; HttpOnly; Secure; SameSite=Strict')
        return self.send_json(404, {'error': 'not found'})

    def do_PUT(self):
        if self.path != PREFIX + 'state':
            return self.send_json(404, {'error': 'not found'})
        if not self.same_origin() or not self.authenticated():
            return self.send_json(403, {'error': 'not authorized'})
        try:
            body = self.body()
            revision = body['revision']
            state = body['state']
            if not isinstance(revision, int) or revision < 0 or not isinstance(state, dict):
                raise ValueError()
            allowed = {'done', 'packed', 'confirmed', 'airbnb', 'note', 'railStart', 'view', 'day', 'meals', 'expenses', 'starPlans'}
            if set(state) - allowed:
                raise ValueError()
            raw = json.dumps(state, ensure_ascii=False, separators=(',', ':'))
            if len(raw.encode()) > MAX_BYTES:
                raise ValueError()
        except (KeyError, ValueError, TypeError, json.JSONDecodeError):
            return self.send_json(400, {'error': 'invalid state'})
        with db() as conn:
            with conn.cursor() as cur:
                cur.execute('UPDATE guide_state SET state_json=%s, revision=revision+1 WHERE id=1 AND revision=%s',
                            (raw, revision))
                if cur.rowcount != 1:
                    conn.rollback()
                    return self.send_json(409, {'error': 'another device saved newer data; reload cloud state'})
                cur.execute('SELECT revision FROM guide_state WHERE id=1')
                new_revision = cur.fetchone()['revision']
            conn.commit()
        return self.send_json(200, {'ok': True, 'revision': new_revision})


if __name__ == '__main__':
    port = int(os.environ.get('GUIDE_PORT', '8765'))
    ThreadingHTTPServer(('127.0.0.1', port), Handler).serve_forever()
