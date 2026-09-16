#!/usr/bin/env bash
# SAN HYDRO backend — LOKAL mashinadan serverга deploy (rsync + remote setup).
# Ishlatish:  ./deploy/deploy.sh root@<SERVER_IP>
# Birinchi marta serverда bootstrap qilingan bo'lishi kerak (DEPLOY.md ga qarang).
set -euo pipefail

SERVER="${1:?Foydalanish: ./deploy/deploy.sh root@<SERVER_IP>}"
REMOTE_DIR="/opt/sanhydro/backend"
LOCAL_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "→ Kod yuborilmoqda: $SERVER:$REMOTE_DIR"
rsync -az --delete \
  --exclude 'venv/' --exclude '__pycache__/' --exclude '*.pyc' \
  --exclude 'db.sqlite3' --exclude 'media/' --exclude 'staticfiles/' \
  --exclude '.env' --exclude '.git/' \
  "$LOCAL_DIR/" "$SERVER:$REMOTE_DIR/"

echo "→ Serverда: venv, migratsiya, static, restart"
ssh "$SERVER" bash -s <<'REMOTE'
set -euo pipefail
cd /opt/sanhydro/backend
[ -d venv ] || python3 -m venv venv
./venv/bin/pip install -q --upgrade pip
./venv/bin/pip install -q -r requirements.txt
./venv/bin/python manage.py migrate --noinput
./venv/bin/python manage.py collectstatic --noinput
mkdir -p media staticfiles
chown -R www-data:www-data /opt/sanhydro/backend
systemctl restart sanhydro-backend
systemctl reload nginx || true
echo "✓ Deploy tugadi."
systemctl --no-pager --lines=3 status sanhydro-backend | tail -4
REMOTE

echo "✓ Tayyor. Tekshiring:  curl -s http://<DOMEN>/api/images/"
