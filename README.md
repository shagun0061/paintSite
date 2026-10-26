# Painting Business Website

A fast, static website for a painting company. It includes:
- services
- a portfolio with before/after photos
- customer testimonials
- a quote and contact form that sends through WhatsApp or email
- links to your Google Business Profile reviews

Built with React 19, Vite, Tailwind CSS 4 and Lucide icons. There is no server or database: all content lives in a few files you edit, and the site deploys to Vercel for free.

> **Placeholder content:** the business name, phone, WhatsApp number, address, About-page figures and the 9 sample projects are placeholders. Replace them (see below) before sharing the site.

---

## Run it locally

Requires Node.js 20 or newer.

```bash
npm install       # install dependencies
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
```

---

## Editing the content

Everything is in `src/data/`. Save a file and the dev server updates instantly. To update the live site, push to GitHub and Vercel redeploys.

| File | What it controls |
| --- | --- |
| `business.js` | Name, phone, email, **WhatsApp number**, address, service areas, working hours, Google links, social links, About-page figures |
| `services.js` | The services list, used on the Services page, the home page and the enquiry form |
| `projects.js` | Portfolio projects: photos, before/after, category, location, date, and whether each is featured on the home page |
| `testimonials.js` | Customer testimonials. Only add real feedback, with the customer's permission |

Wording for the benefits, process steps and commitments is in `src/config/content.js`. The hero, About and contact page photos are set in `src/config/site.js` under `SITE_IMAGES`.

### WhatsApp number

Use international format with digits only: country code + number, no `+`, spaces or dashes. For example, a UK number `07700 900123` becomes `447700900123`.

### Google links

In your Google Business Profile:
- **Ask for reviews** gives the link for `googleReviewUrl`. This powers the "Review Us on Google" button.
- **Share** gives the link for `googleMapsUrl`. This powers the "Read Google Reviews" button.

If `googleMapsUrl` is empty, the "Read Google Reviews" button falls back to a Google Maps search for your business name.

### Adding your own photos

1. Put photos in `public/images/` (for example `public/images/projects/kitchen-after.jpg`). Resize them to about 1600 px wide and compress them first. Tools like squoosh.app work well.
2. Use them in `projects.js` with the `photo` helper:

```js
import { photo, unsplash } from './images.js';

{
  slug: 'smith-kitchen',                 // unique, used in the URL
  title: 'Smith Family Kitchen',
  category: 'Interior',                  // Interior | Exterior | Commercial | Decorative
  summary: 'Cabinets refinished in deep green.',
  description: 'First paragraph…\n\nSecond paragraph…',
  location: 'North Suburbs',
  completedAt: '2026-10-01',
  coverImage: photo('/images/projects/smith-after.jpg', 'Kitchen with green cabinets'),
  beforeImage: photo('/images/projects/smith-before.jpg', 'Kitchen before painting'), // optional
  afterImage: photo('/images/projects/smith-after.jpg', 'Kitchen after painting'),    // optional
  gallery: [photo('/images/projects/smith-1.jpg', 'Detail of cabinet finish')],
  featured: true,                         // show on the home page
},
```

### How the enquiry form works

There's no server, so nothing is stored. When a visitor submits the form, it opens **WhatsApp** with their details already typed in, and they press Send. If they don't use WhatsApp, they can send the same details by **email**. If neither a WhatsApp number nor an email is set, the form asks them to call.

---

## Deploying to Vercel

1. Push the repo to GitHub.
2. In Vercel, choose **Add New → Project** and import the repo.
3. Leave **Root Directory** as `./`. Vercel detects **Vite**; leave the build settings as they are.
4. Click **Deploy**.

`vercel.json` makes page refreshes work on every route (for example `/portfolio`) and adds caching and security headers.

Canonical URLs and `sitemap.xml` use the project's production domain automatically. When you add your own domain under **Settings → Domains**, set the environment variable `VITE_SITE_URL` to `https://yourdomain.com` and redeploy.

---

## Project structure

```
public/          favicon; put your photos in public/images/
src/
  data/          ← your content: business details, services, projects, testimonials
  config/        site config (nav, page images) and marketing copy
  components/    UI pieces, layout (navbar, footer, WhatsApp button), cards, form
  pages/         Home, About, Services, Portfolio, Project, Reviews, Contact, 404
  hooks/         WhatsApp links, scroll animations
  utils/         WhatsApp URLs, formatting, form validation, structured data
vercel.json      page-refresh routing and headers for Vercel
vite.config.js   build config; generates sitemap.xml and robots.txt
```
