"""Add only the private API reverse proxy to the existing travel HTTPS site."""
from pathlib import Path
import shutil

path = Path('/etc/nginx/sites-available/canyon-west-2026')
current = path.read_text(encoding='utf-8')
snippet = '''    location ^~ /travel/us-west-lasvegas/api/ {
        proxy_pass http://127.0.0.1:8765;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 5s;
        proxy_read_timeout 20s;
        add_header Cache-Control "no-store" always;
    }

'''
if snippet in current:
    print('Nginx API proxy already present.')
    raise SystemExit(0)
marker = '    location ^~ /travel/us-west-lasvegas/ {\n        try_files $uri $uri/ =404;\n    }'
if current.count(marker) != 1:
    raise RuntimeError('Unexpected Nginx layout; left untouched')
backup = path.with_suffix('.before-guide-api')
shutil.copy2(path, backup)
path.write_text(current.replace(marker, snippet + marker), encoding='utf-8')
print(f'Nginx API proxy added; backup: {backup}')
