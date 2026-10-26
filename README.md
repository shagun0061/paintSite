# Painting Business Website

A website for a painting company: services, a portfolio with before/after photos, customer reviews with moderation, quote and contact forms, WhatsApp click-to-chat, Google Business Profile links, and an admin dashboard.

- **Frontend:** React 19 + Vite, Tailwind CSS 4, Lucide icons (`frontend/`)
- **Backend:** Node.js + Express 5, MongoDB via Mongoose (`backend/`)

> **Placeholder content:** the business name, phone, WhatsApp number, address, About-page figures and the 9 sample projects are placeholders. Replace them in **Admin → Settings** and **Admin → Projects** before telling customers about the site. The admin dashboard lists what still needs replacing.

---

## Run it locally

Requires Node.js 20.12 or newer.

```bash
npm run install:all                      # installs root, backend and frontend
cp backend/.env.example backend/.env     # then set JWT_SECRET (see the comment in the file)
cp frontend/.env.example frontend/.env
npm run dev
```

- Website: http://localhost:5173
- Admin: http://localhost:5173/admin
- API: http://localhost:5000

With `MONGODB_URI=memory` (the default in `.env.example`) no MongoDB install is needed. A temporary database is started and filled with sample content, and the admin password is printed in the terminal. **Everything is lost when the server stops.**

To keep data, point `MONGODB_URI` at a real database (local MongoDB or Atlas), then seed it once:

```bash
npm run seed                        # services, sample projects, first admin (ADMIN_EMAIL / ADMIN_PASSWORD)
npm run seed -- --reset             # replace services & projects with the samples again
npm run create-admin --prefix backend -- --email you@example.com --name "Your Name"
```

### Tests

```bash
npm test     # backend API tests (in-memory MongoDB)
```

---

## Google reviews

By default the site links to Google with two buttons:
- **Read Google Reviews** opens your Maps profile.
- **Review Us on Google** opens Google's official review form.

Reviews collected on this website are shown separately and labelled as website reviews.

To show your **Google rating and reviews on the site**, use the official Places API (New):

1. In Google Cloud Console, enable **Places API (New)** and create an API key.
2. Restrict the key to that API and to your server's IP address.
3. Find your **Place ID** with Google's Place ID Finder.
4. Set `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` in `backend/.env`, then restart the backend.

Google returns at most 5 reviews, chosen by Google. The site shows them with Google's attribution. The key stays on the server. Nothing is ever written to Google, and Google Maps is never scraped.

---

## Project structure

```
backend/src
  config/        env validation, DB connection, constants, default settings, seed data
  models/        AdminUser, Service, Project, Review, Enquiry, Settings
  validators/    zod request schemas
  middleware/    auth + roles, CSRF header check, validation, rate limits, uploads, errors
  controllers/   route handlers
  routes/        public, auth and /admin routers
  services/      image processing (sharp → WebP), Google Places reviews, sitemap/robots
  scripts/       seed, create-admin
frontend/src
  components/    UI primitives, layout, cards, forms, admin widgets
  pages/         public pages and pages/admin
  layouts/       public and admin shells
  context/       business settings, auth
  hooks/         data loading, WhatsApp links, scroll reveal
  services/      API client and endpoints
  config/        site config and marketing copy (edit content.js to change wording)
  utils/         WhatsApp URLs, formatting, validation, structured data
```

## API overview

| Public | Admin (signed in) |
| --- | --- |
| `GET /api/settings` | `GET /api/admin/stats` |
| `GET /api/services`, `/api/services/:slug` | `GET/PATCH/DELETE /api/admin/enquiries[/:id]` |
| `GET /api/projects?category&featured&page&limit` | `GET/POST/PUT/PATCH/DELETE /api/admin/projects[/:id]` |
| `GET /api/projects/:slug` | `GET/PATCH/DELETE /api/admin/reviews[/:id]` |
| `GET /api/reviews?page`, `POST /api/reviews` | `GET/POST/PUT/DELETE /api/admin/services[/:id]` |
| `GET /api/reviews/google` | `PUT /api/admin/settings` *(admin role)* |
| `POST /api/enquiries` | `POST /api/admin/uploads` (multipart `images`) |
| `POST /api/auth/login`, `/logout`, `GET /me` | `GET/POST/DELETE /api/admin/users` *(admin role)* |

Every request that changes data must send the header `X-Requested-With: XMLHttpRequest`. This guards against cross-site request forgery.
