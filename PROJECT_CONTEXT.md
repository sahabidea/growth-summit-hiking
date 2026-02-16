# 🏔️ Growth Summit Project Memory

> آخرین بروزرسانی: ۲۵ بهمن ۱۴۰۴ (14 Feb 2026)

## 🎯 Core Philosophy
- **Name:** اوجِ رشد (Growth Summit)
- **Primary Focus:** Personal Growth, Mindfulness, Professional Synergy.
- **Protocol:** "Quiet Mind, Active Body". Explicitly avoids political or divisive discussions to maintain positive energy.

## 👥 Core Project Team (Development & Strategy)
| Agent | Role | Specialty |
| :--- | :--- | :--- |
| **Antigravity** | Lead Architect & DevOps | System Architecture, CI/CD, Infrastructure. |
| **Verdant** | Business Strategist & PM | Harvard/McKinsey Strategy, User Story Analysis. |
| **Canopy** | Design Lead (UI/UX) | Wireframing, Design Systems, Aesthetics. |
| **Root** | Full-Stack Lead | React Components, API Design, Database Logic. |
| **Bloom** | Growth & Digital Marketing | Ad Campaigns, Market Analysis, Growth Hacking. |
| **Grove** | Content & SEO | Content Creation, Environmental Impact Reporting. |
| **Sentinel** | QA & Security Lead | Test Cases, Penetration Testing, Stability. |

## 🤖 Functional Site Agents (The Council)
| Agent | Role | Status | Logic Path |
| :--- | :--- | :--- | :--- |
| **The Gatekeeper** | Vetting applicants for growth mindset. | Live (Mock) | `src/lib/ai/gatekeeper.ts` |
| **The Pathfinder** | Route selection based on weather/size. | Live (Mock) | `src/lib/ai/pathfinder.ts` |
| **The Sage** | Generating mindfulness/growth topics. | Live (Mock) | `src/lib/ai/sage.ts` |
| **The Sherpa** | FAQ and User Support Chatbot. | Planned | TBD |

## 🛠️ Technical Stack
- **Frontend:** Next.js 16 (App Router), Tailwind CSS v4, Framer Motion.
- **Backend:** Supabase (Auth & Database).
- **Hosting:** Netlify (CI/CD via GitHub).
- **Language:** Persian (fa), Direction: RTL.
- **Typography:** Vazirmatn (body), Lalezar (display/titles).

## 📂 Project Structure (Updated)
```
src/
├── app/
│   ├── layout.tsx          ← Root layout + Full SEO (OG, Twitter, JSON-LD)
│   ├── page.tsx            ← Landing page (uses shared Navbar/Footer)
│   ├── sitemap.ts          ← Dynamic sitemap.xml ✅ NEW
│   ├── robots.ts           ← Dynamic robots.txt ✅ NEW
│   ├── apply/
│   │   ├── layout.tsx      ← Per-route SEO metadata ✅ NEW
│   │   └── page.tsx        ← Application form (Server Actions + Validation)
│   ├── hikes/
│   │   ├── layout.tsx      ← Per-route SEO metadata ✅ NEW
│   │   └── page.tsx        ← AI route suggestions
│   ├── admin/
│   │   ├── layout.tsx      ← noindex robots ✅ NEW
│   │   ├── login/
│   │   │   └── page.tsx    ← Admin login page ✅ NEW
│   │   └── page.tsx        ← Admin dashboard (Server Actions)
│   └── actions/
│       ├── applications.ts ← Server Actions: submit, fetch, update ✅ NEW
│       └── auth.ts         ← Server Actions: admin login/logout ✅ NEW
├── components/
│   └── ui/
│       ├── Navbar.tsx      ← Shared navbar + mobile drawer ✅ NEW
│       └── Footer.tsx      ← Shared footer ✅ NEW
├── lib/
│   ├── supabase.ts         ← Client-side Supabase (read-only usage)
│   ├── supabase-server.ts  ← Server-side Supabase (service role) ✅ NEW
│   ├── utils.ts            ← cn() class merge utility
│   └── ai/
│       ├── gatekeeper.ts   ← Application vetting logic
│       ├── pathfinder.ts   ← Route suggestion logic
│       └── sage.ts         ← Topic suggestion logic
├── middleware.ts            ← /admin route protection ✅ NEW
public/
└── manifest.json            ← PWA manifest ✅ NEW
```

## 📊 Database Schema (Supabase)
- **Table:** `applications`
  - `name`, `email`, `goal` (Text)
  - `score` (Integer - AI Vetting Score)
  - `approved` (Boolean)
  - `status` (pending/approved/rejected)

## 🔐 Security Implementation
- **Admin Auth:** Cookie-based password auth via Server Actions
- **Admin Password:** Set via `ADMIN_PASSWORD` env variable (default: `owj-admin-2026`)
- **Middleware:** `/admin/*` routes redirect to `/admin/login` without valid cookie
- **Server Actions:** All Supabase writes moved to server-side (no client DB writes)
- **Admin cookie:** httpOnly, secure, sameSite strict, 24h expiry

## 🔄 Workflow Protocol
1. **Local Dev:** Test all changes via `npm run dev`.
2. **AI Vetting:** Always use `GatekeeperAgent` before saving to DB.
3. **Safe Deploy:** Only `git push` to origin when local testing is 100% verified to save Netlify build minutes.

---

## 📋 5X Improvement Audit — Progress Tracker

### ✅ فاز ۱ — امنیت و زیرساخت (COMPLETED)
- [x] Supabase Auth + Admin Login Page (`/admin/login`)
- [x] Middleware حفاظت `/admin` (`middleware.ts`)
- [x] Server Actions — حذف Client-Side Supabase writes (`actions/applications.ts`, `actions/auth.ts`)
- [x] سیستم کامپوننت مشترک: `Navbar` (with mobile drawer), `Footer`
- [x] ذخیره همه درخواست‌ها (نه فقط approved)
- [x] Inline Validation فارسی در فرم Apply
- [x] Admin Dashboard ریسپانسیو (sidebar drawer for mobile)
- [x] Admin Logout امن

### ✅ فاز ۱.۵ — راه اندازی اولیه (Bootstrap Launch)
- [x] استراتژی کوه پنج‌شنبه (Thursday Summit MVP)
- [x] داشبورد کاربری (`/dashboard`) با وضعیت اشتراک
- [x] صفحه لاگین و ثبت‌نام (`/login`) با Supabase Auth
- [x] مدیریت رویدادها در پنل ادمین (`/admin`)
- [x] دیتابیس کامل (Profiles, Events, Bookings)

### ✅ SEO (COMPLETED)
- [x] Open Graph Tags (تصویر ۱۲۰۰×۶۳۰ + عنوان + توضیحات فارسی)
- [x] Twitter Cards (`summary_large_image`)
- [x] JSON-LD Schema (`Organization`)
- [x] `sitemap.xml` خودکار (۳ صفحه عمومی)
- [x] `robots.txt` خودکار (`/admin` و `/api` مسدود)
- [x] `manifest.json` (PWA support)
- [x] Meta Tags اختصاصی برای هر صفحه (via route layouts)
- [x] Admin pages blocked from indexing (`noindex`)

### ⬜ فاز ۲ — تجربه کاربری (NEXT)
- [x] Mobile Navigation Drawer (done in Navbar component)
- [ ] مهاجرت به `next/image` (replace raw `<img>` tags)
- [x] Admin Responsive (done)
- [x] Form Inline Validation فارسی (done)

### ⬜ فاز ۳ — محتوا و مارکتینگ
- [ ] صفحه `/about` (داستان پروژه + عکس‌های واقعی)
- [x] Open Graph + Twitter Cards (done)
- [x] Sitemap + robots.txt (done)
- [ ] صفحه `/blog` (حداقل ۳ مقاله اولیه)

### ⬜ فاز ۴ — هوشمندسازی
- [ ] API Route برای Gatekeeper (اتصال به LLM واقعی)
- [ ] Weather API واقعی برای Pathfinder (OpenWeatherMap)
- [ ] ایمیل خودکار تایید (Supabase Edge Functions + Resend)
- [ ] Analytics (Plausible — رایگان، بدون کوکی)
- [ ] جدول `routes` در Supabase به جای hardcode

### ⬜ Backlog (Future)
- [ ] Error Boundary + Toast سراسری
- [ ] بخش «همراهان جامعه» با شمارنده اعضا
- [ ] FAQ Section
- [ ] CTA قوی‌تر با شمارنده ظرفیت
- [ ] لینک‌های شبکه اجتماعی واقعی
- [ ] Blog CMS (Supabase-based)

---

## 📑 Milestone History
1. Connected Supabase successfully.
2. Implemented real-time AI vetting feedback on `/apply`.
3. Created `/hikes` with Pathfinder and Sage integration.
4. Switched to **Alpine Premium** design system (Dark Cinematic).
5. Established the expanded AI Core Project Team.
6. **[25 بهمن ۱۴۰۴]** Completed 7-agent audit → 16-item improvement plan.
7. **[25 بهمن ۱۴۰۴]** Phase 1 Security & Infrastructure: Admin auth, middleware, server actions, shared components.
8. **[25 بهمن ۱۴۰۴]** Full SEO: OG, Twitter Cards, JSON-LD, sitemap, robots, manifest, per-route metadata.
