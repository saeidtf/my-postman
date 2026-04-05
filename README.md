# My Postman

یک پروژه Full-stack با Node.js، TypeScript، SQLite و React برای تست API شبیه Postman.

## امکانات

- ساخت، ویرایش و حذف درخواست‌ها
- اجرای درخواست‌های ذخیره‌شده یا موقت
- پشتیبانی از `query params`, `headers`, `JSON`, `text`, `x-www-form-urlencoded`, `form-data`
- احراز هویت `Bearer`, `Basic`, `API Key`
- ذخیره درخواست‌ها و تاریخچه اجرا در SQLite
- مدیریت متغیرهای محیطی و جایگزینی `{{variable}}`
- UI مدرن با پنل درخواست، پاسخ و سایدبار

## ساختار

- `apps/server`: بک‌اند Fastify + SQLite
- `apps/client`: فرانت React + Vite

## اجرا

```bash
npm install
npm run dev
```

بک‌اند روی `http://localhost:3001` و فرانت روی `http://localhost:5173` اجرا می‌شود.
# my-postman
