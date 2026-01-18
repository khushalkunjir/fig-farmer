# Fig Farmer (Next.js + MongoDB)

Family-friendly web app to manage a fig farm's daily harvest, packing, vendor sales, pending confirmations, and reports. Supports English + Marathi and runs locally on a home laptop.

## Tech Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- MongoDB + Mongoose
- JWT auth with HTTP-only cookies
- next-intl i18n (English/Marathi)

## Requirements
- Node.js 18+
- MongoDB (local or MongoDB Atlas)

## Setup

1) Install dependencies
```bash
npm install
```

2) Configure environment
```bash
copy .env.example .env
```
Update `MONGODB_URI` and `AUTH_SECRET`.

3) (Optional) Seed demo data
```bash
npm run seed
```
This creates sample vendors, box types, harvest, and sales. It also creates an admin user with:
- Username: `admin`
- Password: `admin123`

4) Run the app
```bash
npm run dev
```
Open `http://localhost:3000`.

## Admin Login
- If no admin exists, the `/login` page shows a first-time setup screen.
- You can create the first admin with a username or email and password.
- Passwords are hashed with bcrypt and stored securely.

## Language Switching
Use the language dropdown in the header or login screen to switch between English and Marathi.

## Reports & Export
- Visit `/reports` to see daily, monthly, and vendor-wise summaries.
- Use **Export CSV** or **Export PDF** to download localized reports.

## Offline-friendly
The app runs entirely on a local MongoDB instance with no external dependencies required at runtime. Ideal for a home laptop.

## Scripts
- `npm run dev` - start development server
- `npm run build` - build production app
- `npm run start` - run production server
- `npm run seed` - seed demo data

## Notes
- Ensure `AUTH_SECRET` is a long random string.
- MongoDB Atlas users should whitelist their IP or use `0.0.0.0/0` during setup.
