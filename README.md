# ProjectEasyCook

แอปเว็บสูตรอาหาร — Frontend (Nuxt 4) + Backend (Hono บน Cloudflare Worker)

## โครงสร้าง

- `frontend-easycook/` — Nuxt 4, deploy ที่ Vercel
- `backend_easycook/` — Hono บน Cloudflare Workers (D1 database + R2 image storage), deploy ผ่าน `wrangler`

## รันด้วย Docker (Dev)

สร้างไฟล์ `.env` ที่ root (ตัวเลือก) เพื่อตั้งค่า secret:

```env
JWT_SECRET=your-secret-here
```

แล้วรัน:

```sh
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8787
- `NUXT_PUBLIC_API_BASE` ชี้ไป `http://backend:8787` อัตโนมัติ (ภายใน network ของ compose)

### หมายเหตุ

- Backend ใช้ Cloudflare Worker (workerd) — container รัน `wrangler dev` พร้อม schema `src/schema.sql` (idempotent) ลง D1 local
- D1 state เก็บใน named volume `wrangler_state` — ข้อมูลอยู่ข้ามการ restart
- `JWT_SECRET` ส่งผ่าน `--var` ของ wrangler เอง (ไป bind ที่ `c.env.JWT_SECRET`)
- R2 local ใช้ emulation ของ wrangler; `cover_image` URL ที่อัปโหลดแล้วยังชี้ไป public bucket จริง (`pub-...r2.dev`) ตาม code เดิม
- เปลี่ยนไฟล์ code แล้ว recompile อัตโนมัติ (bind mount + node_modules volume แยก)

## รันแบบเดิม (ไม่ใช้ Docker)

```sh
# backend
cd backend_easycook
npm install
npm run dev

# frontend
cd frontend-easycook
npm install
npm run dev
```