"""One-time, idempotent private guide database and password setup on Aliyun."""
import hashlib
import os
from pathlib import Path
import secrets
import subprocess

ENV = Path('/etc/canyon-guide.env')
ACCESS = Path('/root/canyon-guide-access.txt')

if ENV.exists():
    print('Existing private guide configuration kept; no password rotation.')
    raise SystemExit(0)

sql = Path('/opt/canyon-guide/schema.sql').read_text(encoding='utf-8')
subprocess.run(['mysql'], input=sql, text=True, check=True)
db_password = secrets.token_hex(32)
access_password = secrets.token_urlsafe(24)
salt = secrets.token_bytes(16)
password_hash = hashlib.scrypt(access_password.encode(), salt=salt, n=2**15, r=8, p=1,
                              maxmem=64 * 1024 * 1024)
user_sql = (
    "CREATE USER IF NOT EXISTS 'canyon_guide'@'127.0.0.1' "
    f"IDENTIFIED BY '{db_password}';\n"
    "GRANT SELECT, INSERT, UPDATE, DELETE ON canyon_guide.* "
    "TO 'canyon_guide'@'127.0.0.1';\n"
)
subprocess.run(['mysql'], input=user_sql, text=True, check=True)
env_text = '\n'.join([
    'GUIDE_ORIGIN=https://www.chaoyifan666.fun',
    'GUIDE_DB_USER=canyon_guide',
    'GUIDE_DB_NAME=canyon_guide',
    f'GUIDE_DB_PASSWORD={db_password}',
    f'GUIDE_ACCESS_SALT={salt.hex()}',
    f'GUIDE_ACCESS_HASH={password_hash.hex()}',
    '',
])
fd = os.open(ENV, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
with os.fdopen(fd, 'w', encoding='utf-8') as stream:
    stream.write(env_text)
fd = os.open(ACCESS, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
with os.fdopen(fd, 'w', encoding='utf-8') as stream:
    stream.write(access_password + '\n')
print('Database and private guide credentials created. Access password remains in /root/canyon-guide-access.txt')
