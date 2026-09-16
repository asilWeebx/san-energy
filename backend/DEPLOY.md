# SAN HYDRO backend — Hetzner deploy qo'llanmasi

Bu backend faqat **landing rasmlarini** boshqaradi (galereya/hero/about + admin panel).
DukOnline online-do'koniga aloqasi yo'q. Kichik → arzon serverда bemalol ishlaydi.

---

## 0. IP qayerdan keladi
IP ni hech kim "berib" qo'ymaydi — **Hetznerда server yaratganда** o'zi beriladi.
Tartib: **server yarat → IP ol → domenni yo'naltir → deploy**.

## 1. Hetzner'да server yaratish
1. https://console.hetzner.cloud → **Add Server**.
2. Location: Nuremberg/Helsinki (Yevropa). Image: **Ubuntu 24.04**.
3. Type: eng arzoni yetadi — **CX22** (2 vCPU / 4GB) yoki **CPX11**.
4. SSH key: o'zingiznikini qo'shing (yoki parol). **Create**.
5. Server IP paydo bo'ladi — masalan `95.216.xx.xx`. Shu **IP**.

## 2. Domenni yo'naltirish (siz qilasiz)
Domen DNS'ida **A yozuvi**:
```
api.san-hydro.uz   A   <SERVER_IP>
```
(subdomen `api` — backend uchun. Landing alohida `san-hydro.uz` da qoladi.)

## 3. Serverни birinchi marta sozlash (bootstrap — bir marta)
IP tayyor bo'lgach, serverга kiring va quyidagini bajaring:
```bash
ssh root@<SERVER_IP>

apt update && apt install -y python3-venv python3-pip nginx rsync
mkdir -p /opt/sanhydro/backend
```

## 4. Kodni yuklash (lokal mashinadan)
Lokal `backend/` papkadan:
```bash
cd ~/san-hydro-energy/backend
./deploy/deploy.sh root@<SERVER_IP>
```
Bu: kodni yuboradi, venv+paketlar, migratsiya, collectstatic, gunicorn restart qiladi.
(Birinchi marta systemd/nginx hali yo'q — 5-qadamни bajaring, keyin `deploy.sh` qайta ishlaydi.)

## 5. `.env`, systemd, nginx (bir marta, serverда)
```bash
# .env
cd /opt/sanhydro/backend
cp .env.production.example .env
nano .env         # DEBUG=0, SECRET_KEY, ADMIN_KEY, ALLOWED_HOSTS=api.san-hydro.uz,
                  # CORS_ORIGINS=https://san-hydro.uz, CSRF_TRUSTED_ORIGINS=https://api.san-hydro.uz

# systemd (gunicorn)
cp deploy/gunicorn.service /etc/systemd/system/sanhydro-backend.service
systemctl daemon-reload
systemctl enable --now sanhydro-backend

# nginx (domenni faylда to'g'rilang: api.san-hydro.uz)
cp deploy/nginx.conf /etc/nginx/sites-available/sanhydro-backend
ln -sf /etc/nginx/sites-available/sanhydro-backend /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# huquqlar
chown -R www-data:www-data /opt/sanhydro/backend
```

## 6. HTTPS (SSL — bepul, tavsiya etiladi)
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d api.san-hydro.uz
```

## 7. Tekshirish
```bash
curl -s https://api.san-hydro.uz/api/images/     # → [] (bo'sh ro'yxat)
```
Admin: `https://api.san-hydro.uz/admin/` yoki landing admin sahifasi.

## 8. Landing (frontend) ni ulash
Frontend `.env.local` / Vercel env:
```
NEXT_PUBLIC_IMAGES_API=https://api.san-hydro.uz
```
va `next.config.ts` `remotePatterns` ga `api.san-hydro.uz` (https) qo'shing.

## Keyingi deploylar
Faqat: `./deploy/deploy.sh root@<SERVER_IP>` — qolgan hammasi avtomatik.

---
**Eslatma:** DB — SQLite (`db.sqlite3`, serverда, deploy'да tegilmaydi). Rasmlar — `media/`.
Ikkalasи ham `deploy.sh` da `--exclude` qilingan, ustiga yozilmaydi. Zaxira uchun bu ikki narsani vaqti-vaqti bilan nusxalang.
