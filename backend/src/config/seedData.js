/**
 * SAMPLE content for a fresh install. Images are free-to-use Unsplash
 * photos (https://unsplash.com/license); projects are illustrative
 * placeholders — replace them with real jobs from Admin → Projects.
 * No reviews are seeded: testimonials must come from real customers.
 */

const unsplash = (id, alt) => {
  const src = (w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;
  return { url: src(1600), alt, width: 1600, variants: [480, 960, 1600].map((width) => ({ width, url: src(width) })) };
};

export const IMAGES = {
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
  roller: unsplash('1562259949-e8e7689d7828', 'Paint roller applying a fresh coat of blue paint'),
};

export const sampleServices = [
  {
    title: 'Interior House Painting',
    slug: 'interior-painting',
    icon: 'PaintRoller',
    order: 1,
    summary: 'Walls, ceilings, trims and doors finished with clean lines and durable, low-odour paints.',
    description:
      'We protect your furniture and floors, repair cracks and holes, prime where needed and apply two even coats for a smooth, long-lasting finish. Colour consultation is included so you can choose with confidence.',
    features: ['Free colour consultation', 'Furniture & floor protection', 'Crack and hole repair', 'Low-VOC paint options'],
    image: IMAGES.tealLiving,
  },
  {
    title: 'Exterior House Painting',
    slug: 'exterior-painting',
    icon: 'Home',
    order: 2,
    summary: 'Weather-resistant coatings that protect your home and boost kerb appeal for years.',
    description:
      'Proper surface preparation is what makes exterior paint last. We pressure-wash, scrape, fill and prime before applying premium exterior-grade coatings suited to your climate.',
    features: ['Pressure washing & scraping', 'Weather-resistant coatings', 'Trim, gutters & fascia', 'Safe access equipment'],
    image: IMAGES.farmhouse,
  },
  {
    title: 'Commercial Painting',
    slug: 'commercial-painting',
    icon: 'Building2',
    order: 3,
    summary: 'Offices, shops and restaurants painted on a schedule that keeps your business running.',
    description:
      'We plan around your opening hours with evening and weekend work, phased areas and fast-drying products, so your team and customers are disrupted as little as possible.',
    features: ['After-hours scheduling', 'Phased project planning', 'Brand colour matching', 'Fast-drying products'],
    image: IMAGES.officeOpen,
  },
  {
    title: 'Wall Texture & Decorative Painting',
    slug: 'texture-decorative-painting',
    icon: 'Palette',
    order: 4,
    summary: 'Feature walls, textures and specialist finishes that give a room real character.',
    description:
      'From subtle limewash and concrete effects to stencils and bold colour blocking, we help you choose a decorative finish and apply it with care and consistency.',
    features: ['Texture & stucco finishes', 'Concrete & limewash effects', 'Accent and feature walls', 'Samples before we start'],
    image: IMAGES.textureWall,
  },
  {
    title: 'Waterproofing & Wall Repairs',
    slug: 'waterproofing-wall-repairs',
    icon: 'ShieldCheck',
    order: 5,
    summary: 'Fix damp, cracks and peeling paint at the source before they spread.',
    description:
      'We identify the cause of damp patches and peeling, repair plaster and cracks, and apply waterproof coatings to roofs, terraces and exterior walls so your new paint stays put.',
    features: ['Damp & leak diagnosis', 'Crack and plaster repair', 'Terrace & roof coatings', 'Anti-fungal treatments'],
    image: IMAGES.roller,
  },
  {
    title: 'Wood Polishing & Finishing',
    slug: 'wood-polishing-finishing',
    icon: 'Hammer',
    order: 6,
    summary: 'Restore doors, furniture, panelling and cabinets with a rich, protective finish.',
    description:
      'We sand, stain and seal wood surfaces using PU, melamine or lacquer finishes, bringing out the grain and protecting against everyday wear.',
    features: ['Sanding & surface prep', 'Stain and colour matching', 'PU, melamine & lacquer', 'Doors, cabinets & furniture'],
    image: IMAGES.woodShelves,
  },
];

const monthsAgo = (n) => {
  const d = new Date();
  d.setMonth(d.getMonth() - n, 15);
  return d;
};

export const sampleProjects = [
  {
    title: 'Teal Accent Living Room',
    slug: 'teal-accent-living-room',
    category: 'Interior',
    summary: 'A tired, plain living room transformed with a deep teal feature wall and crisp white trims.',
    description:
      'The owners wanted a cosy but bold living space. We repaired hairline cracks, primed the walls and applied two coats of a deep teal on the feature wall, with a warm white on the remaining walls and ceiling for balance.\n\nSample project — replace with your own work from the admin dashboard.',
    location: 'Your City',
    completedAt: monthsAgo(1),
    coverImage: IMAGES.tealLiving,
    beforeImage: IMAGES.plainRoom,
    afterImage: IMAGES.tealLiving,
    gallery: [IMAGES.tealLiving, IMAGES.greenDining],
    featured: true,
    published: true,
  },
  {
    title: 'Farmhouse Exterior Repaint',
    slug: 'farmhouse-exterior-repaint',
    category: 'Exterior',
    summary: 'Full exterior repaint including porch, railings and trims with weather-resistant coatings.',
    description:
      'Peeling paint and weathered trims were scraped back, filled and primed before two coats of premium exterior paint. The porch railings were finished in a durable gloss.\n\nSample project — replace with your own work from the admin dashboard.',
    location: 'North Suburbs',
    completedAt: monthsAgo(2),
    coverImage: IMAGES.farmhouse,
    gallery: [IMAGES.farmhouse],
    featured: true,
    published: true,
  },
  {
    title: 'Open-Plan Office Refresh',
    slug: 'open-plan-office-refresh',
    category: 'Commercial',
    summary: 'A 4,000 sq ft office painted over two weekends with zero downtime for the team.',
    description:
      'We phased the work across two weekends, protecting desks and equipment, and used fast-drying low-odour paint so the office was ready for work each Monday.\n\nSample project — replace with your own work from the admin dashboard.',
    location: 'Downtown',
    completedAt: monthsAgo(3),
    coverImage: IMAGES.officeOpen,
    beforeImage: IMAGES.officeCorridor,
    afterImage: IMAGES.officeOpen,
    gallery: [IMAGES.officeOpen, IMAGES.officeCorridor],
    featured: true,
    published: true,
  },
  {
    title: 'Concrete-Effect Feature Wall',
    slug: 'concrete-effect-feature-wall',
    category: 'Decorative',
    summary: 'A hand-applied concrete-effect texture that gives a modern living room an industrial edge.',
    description:
      'Sample boards were prepared so the client could choose the exact tone and texture. The finish was built up in layers and sealed for easy cleaning.\n\nSample project — replace with your own work from the admin dashboard.',
    location: 'East Side',
    completedAt: monthsAgo(4),
    coverImage: IMAGES.textureWall,
    gallery: [IMAGES.textureWall],
    featured: true,
    published: true,
  },
  {
    title: 'Kitchen Cabinet Refinish',
    slug: 'kitchen-cabinet-refinish',
    category: 'Interior',
    summary: 'Dated white cabinets refinished in a hard-wearing deep charcoal.',
    description:
      'Doors were removed, degreased, sanded and sprayed with a hard-wearing cabinet enamel for a factory-smooth finish.\n\nSample project — replace with your own work from the admin dashboard.',
    location: 'Your City',
    completedAt: monthsAgo(5),
    coverImage: IMAGES.kitchenDark,
    beforeImage: IMAGES.kitchenWhite,
    afterImage: IMAGES.kitchenDark,
    gallery: [IMAGES.kitchenDark],
    featured: true,
    published: true,
  },
  {
    title: 'Contemporary Villa Weatherproofing',
    slug: 'contemporary-villa-weatherproofing',
    category: 'Exterior',
    summary: 'Crack repair and elastomeric waterproof coating on a modern villa exterior.',
    description:
      'Hairline cracks were sealed and the exterior walls coated with an elastomeric waterproof system to stop moisture ingress, finished in a bright, UV-stable white.\n\nSample project — replace with your own work from the admin dashboard.',
    location: 'North Suburbs',
    completedAt: monthsAgo(6),
    coverImage: IMAGES.villa,
    gallery: [IMAGES.villa, IMAGES.modernHouse],
    featured: true,
    published: true,
  },
  {
    title: 'Loft Café Interior',
    slug: 'loft-cafe-interior',
    category: 'Commercial',
    summary: 'Overnight painting of a busy café, keeping exposed brick and adding warm accent areas.',
    description:
      'Work was completed over three nights so the café never closed. Brick was cleaned and sealed and accent walls painted in a warm palette.\n\nSample project — replace with your own work from the admin dashboard.',
    location: 'Downtown',
    completedAt: monthsAgo(8),
    coverImage: IMAGES.loftCafe,
    gallery: [IMAGES.loftCafe],
    published: true,
  },
  {
    title: 'Serene Master Bedroom',
    slug: 'serene-master-bedroom',
    category: 'Interior',
    summary: 'Soft greys and whites for a calm, restful bedroom.',
    description:
      'Scuffed walls were repaired and sanded, then finished in a washable matt paint. Ceilings were refreshed in a flat white.\n\nSample project — replace with your own work from the admin dashboard.',
    location: 'East Side',
    completedAt: monthsAgo(9),
    coverImage: IMAGES.bedroom,
    beforeImage: IMAGES.hallway,
    afterImage: IMAGES.bedroom,
    gallery: [IMAGES.bedroom],
    published: true,
  },
  {
    title: 'Walnut Panelling Polish',
    slug: 'walnut-panelling-polish',
    category: 'Decorative',
    summary: 'Walnut wall panelling sanded and finished in a satin PU polish.',
    description:
      'The panelling was sanded back to bare wood, colour-matched and sealed with a satin PU finish for depth and protection.\n\nSample project — replace with your own work from the admin dashboard.',
    location: 'Your City',
    completedAt: monthsAgo(11),
    coverImage: IMAGES.woodWall,
    gallery: [IMAGES.woodWall, IMAGES.woodShelves],
    published: true,
  },
];
