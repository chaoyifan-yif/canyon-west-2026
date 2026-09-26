"""Rotate the private guide password on the server without touching trip data.

Run as root with the new password on stdin. Never pass it as a command-line
argument, which would expose it in process listings. Existing sessions are
revoked after the API environment is atomically replaced.
"""
import hashlib
import os
from pathlib import Path
import secrets
import shutil
import subprocess
import sys
from datetime import datetime, timezone


ENV = Path('/etc/canyon-guide.env')
ACCESS_FILE = Path('/root/canyon-guide-access.txt')
password = sys.stdin.readline().rstrip('\r\n')
if len(password) < 12 or len(password) > 256:
    raise SystemExit('Password length must be 12–256 characters')
if os.geteuid() != 0:
    raise SystemExit('Run as root')

raw = ENV.read_text(encoding='utf-8')
lines = raw.splitlines()
if sum(line.startswith('GUIDE_ACCESS_SALT=') for line in lines) != 1:
    raise SystemExit('Expected exactly one access salt')
if sum(line.startswith('GUIDE_ACCESS_HASH=') for line in lines) != 1:
    raise SystemExit('Expected exactly one access hash')

salt = secrets.token_bytes(16)
password_hash = hashlib.scrypt(password.encode('utf-8'), salt=salt, n=2**15,
                              r=8, p=1, maxmem=64 * 1024 * 1024)
new_lines = [
    f'GUIDE_ACCESS_SALT={salt.hex()}' if line.startswith('GUIDE_ACCESS_SALT=')
    else f'GUIDE_ACCESS_HASH={password_hash.hex()}' if line.startswith('GUIDE_ACCESS_HASH=')
    else line
    for line in lines
]

stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
backup = Path('/root') / f'canyon-guide-env-before-rotation-{stamp}.env'
shutil.copy2(ENV, backup)
backup.chmod(0o600)
temp_env = ENV.with_name(ENV.name + f'.tmp-{os.getpid()}')
temp_access = ACCESS_FILE.with_name(ACCESS_FILE.name + f'.tmp-{os.getpid()}')
try:
    for path, content in ((temp_env, '\n'.join(new_lines) + '\n'),
                          (temp_access, password + '\n')):
        fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        with os.fdopen(fd, 'w', encoding='utf-8') as stream:
            stream.write(content)
    os.replace(temp_env, ENV)
    os.replace(temp_access, ACCESS_FILE)
    # This administrative rotation intentionally logs out all devices.
    subprocess.run(['mysql', '-e', 'DELETE FROM canyon_guide.guide_sessions'], check=True)
except Exception:
    temp_env.unlink(missing_ok=True)
    temp_access.unlink(missing_ok=True)
    raise
print('Password hash rotated; existing sessions revoked; private backup retained.')
