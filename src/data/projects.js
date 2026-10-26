import { unsplash } from './images.js';

/**
 * Portfolio projects, shown newest first.
 *
 * ⚠️ SAMPLES: these use stock photos. Replace them with your own jobs — put
 * photos in frontend/public/images/projects/ and use photo('/images/projects/…', 'description')
 * from ./images.js. Delete any project you don't want to show.
 *
 * Fields: slug (unique, used in the URL), title, category (Interior | Exterior |
 * Commercial | Decorative), summary, description (blank line = new paragraph),
 * location, completedAt ('YYYY-MM-DD'), coverImage, optional beforeImage +
 * afterImage (shows a comparison slider), gallery, featured (shown on home page).
 */
const img = {
  tealLiving: unsplash('1615873968403-89e068629265', 'Living room with a deep teal accent wall and warm wood furniture'),
  greenDining: unsplash('1617806118233-18e1de247200', 'Bright dining room with fresh white walls and green chairs'),
  plainRoom: unsplash('1513694203232-719a280e022f', 'Plain room with dated off-white walls before repainting'),
  farmhouse: unsplash('1570129477492-45c003edd2be', 'White two-storey farmhouse with a freshly painted exterior and porch'),
  villa: unsplash('1512917774080-9991f1c4c750', 'Modern white villa exterior with smooth weatherproof finish'),
  modernHouse: unsplash('1580587771525-78b9dba3b914', 'Contemporary house exterior with crisp white render'),
  officeOpen: unsplash('1497366811353-6870744d04b2', 'Open-plan office with freshly painted walls and ceilings'),
  officeCorridor: unsplash('1497366216548-37526070297c', 'Office corridor painted in a neutral grey palette'),
  loftCafe: unsplash('1538688525198-9b88f6f53126', 'Loft-style café interior with exposed brick and painted feature areas'),
  textureWall: unsplash('1541123603104-512919d6a96c', 'Living room with a concrete-effect decorative texture wall'),
  kitchenDark: unsplash('1588854337236-6889d631faa8', 'Kitchen with refinished deep charcoal cabinets'),
  kitchenWhite: unsplash('1484154218962-a197022b5858', 'White kitchen before cabinet refinishing'),
  bedroom: unsplash('1595526114035-0d45ed16cfbf', 'Calm master bedroom with soft grey and white walls'),
  hallway: unsplash('1581858726788-75bc0f6a952d', 'Bare hallway with scuffed white walls before painting'),
  woodShelves: unsplash('1594026112284-02bb6f3352fe', 'Polished floating wooden shelves on a warm painted wall'),
  woodWall: unsplash('1604014237800-1c9102c219da', 'Living room with polished walnut wall panelling'),
};

const PROJECTS_UNSORTED = [
  {
    slug: 'teal-accent-living-room',
    title: 'Teal Accent Living Room',
    category: 'Interior',
    summary: 'A tired, plain living room transformed with a deep teal feature wall and crisp white trims.',
    description:
      'The owners wanted a cosy but bold living space. We repaired hairline cracks, primed the walls and applied two coats of a deep teal on the feature wall, with a warm white on the remaining walls and ceiling for balance.',
    location: 'Your City',
    completedAt: '2026-09-15',
    coverImage: img.tealLiving,
    beforeImage: img.plainRoom,
    afterImage: img.tealLiving,
    gallery: [img.tealLiving, img.greenDining],
    featured: true,
  },
  {
    slug: 'farmhouse-exterior-repaint',
    title: 'Farmhouse Exterior Repaint',
    category: 'Exterior',
    summary: 'Full exterior repaint including porch, railings and trims with weather-resistant coatings.',
    description:
      'Peeling paint and weathered trims were scraped back, filled and primed before two coats of premium exterior paint. The porch railings were finished in a durable gloss.',
    location: 'North Suburbs',
    completedAt: '2026-08-15',
    coverImage: img.farmhouse,
    gallery: [img.farmhouse],
    featured: true,
  },
  {
    slug: 'open-plan-office-refresh',
    title: 'Open-Plan Office Refresh',
    category: 'Commercial',
    summary: 'A 4,000 sq ft office painted over two weekends with zero downtime for the team.',
    description:
      'We phased the work across two weekends, protecting desks and equipment, and used fast-drying low-odour paint so the office was ready for work each Monday.',
    location: 'Downtown',
    completedAt: '2026-07-15',
    coverImage: img.officeOpen,
    beforeImage: img.officeCorridor,
    afterImage: img.officeOpen,
    gallery: [img.officeOpen, img.officeCorridor],
    featured: true,
  },
  {
    slug: 'concrete-effect-feature-wall',
    title: 'Concrete-Effect Feature Wall',
    category: 'Decorative',
    summary: 'A hand-applied concrete-effect texture that gives a modern living room an industrial edge.',
    description:
      'Sample boards were prepared so the client could choose the exact tone and texture. The finish was built up in layers and sealed for easy cleaning.',
    location: 'East Side',
    completedAt: '2026-06-15',
    coverImage: img.textureWall,
    gallery: [img.textureWall],
    featured: true,
  },
  {
    slug: 'kitchen-cabinet-refinish',
    title: 'Kitchen Cabinet Refinish',
    category: 'Interior',
    summary: 'Dated white cabinets refinished in a hard-wearing deep charcoal.',
    description:
      'Doors were removed, degreased, sanded and sprayed with a hard-wearing cabinet enamel for a factory-smooth finish.',
    location: 'Your City',
    completedAt: '2026-05-15',
    coverImage: img.kitchenDark,
    beforeImage: img.kitchenWhite,
    afterImage: img.kitchenDark,
    gallery: [img.kitchenDark],
    featured: true,
  },
  {
    slug: 'contemporary-villa-weatherproofing',
    title: 'Contemporary Villa Weatherproofing',
    category: 'Exterior',
    summary: 'Crack repair and elastomeric waterproof coating on a modern villa exterior.',
    description:
      'Hairline cracks were sealed and the exterior walls coated with an elastomeric waterproof system to stop moisture ingress, finished in a bright, UV-stable white.',
    location: 'North Suburbs',
    completedAt: '2026-04-15',
    coverImage: img.villa,
    gallery: [img.villa, img.modernHouse],
    featured: true,
  },
  {
    slug: 'loft-cafe-interior',
    title: 'Loft Café Interior',
    category: 'Commercial',
    summary: 'Overnight painting of a busy café, keeping exposed brick and adding warm accent areas.',
    description:
      'Work was completed over three nights so the café never closed. Brick was cleaned and sealed and accent walls painted in a warm palette.',
    location: 'Downtown',
    completedAt: '2026-02-15',
    coverImage: img.loftCafe,
    gallery: [img.loftCafe],
  },
  {
    slug: 'serene-master-bedroom',
    title: 'Serene Master Bedroom',
    category: 'Interior',
    summary: 'Soft greys and whites for a calm, restful bedroom.',
    description:
      'Scuffed walls were repaired and sanded, then finished in a washable matt paint. Ceilings were refreshed in a flat white.',
    location: 'East Side',
    completedAt: '2026-01-15',
    coverImage: img.bedroom,
    beforeImage: img.hallway,
    afterImage: img.bedroom,
    gallery: [img.bedroom],
  },
  {
    slug: 'walnut-panelling-polish',
    title: 'Walnut Panelling Polish',
    category: 'Decorative',
    summary: 'Walnut wall panelling sanded and finished in a satin PU polish.',
    description:
      'The panelling was sanded back to bare wood, colour-matched and sealed with a satin PU finish for depth and protection.',
    location: 'Your City',
    completedAt: '2025-11-15',
    coverImage: img.woodWall,
    gallery: [img.woodWall, img.woodShelves],
  },
];

export const PROJECTS = [...PROJECTS_UNSORTED].sort((a, b) => (b.completedAt || '').localeCompare(a.completedAt || ''));

export const getProject = (slug) => PROJECTS.find((p) => p.slug === slug);

export const relatedProjects = (project, count = 3) =>
  PROJECTS.filter((p) => p.category === project.category && p.slug !== project.slug).slice(0, count);
