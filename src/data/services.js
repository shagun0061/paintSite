import { unsplash } from './images.js';

/**
 * Services shown on the Services page, the home page and in the enquiry form.
 * `slug` is used in links (/services#slug). `icon` is one of:
 * PaintRoller, Home, Building2, Palette, ShieldCheck, Hammer, Brush, PaintBucket.
 */
export const SERVICES = [
  {
    slug: 'interior-painting',
    title: 'Interior House Painting',
    icon: 'PaintRoller',
    summary: 'Walls, ceilings, trims and doors finished with clean lines and durable, low-odour paints.',
    description:
      'We protect your furniture and floors, repair cracks and holes, prime where needed and apply two even coats for a smooth, long-lasting finish. Colour consultation is included so you can choose with confidence.',
    features: ['Free colour consultation', 'Furniture & floor protection', 'Crack and hole repair', 'Low-VOC paint options'],
    image: unsplash('1615873968403-89e068629265', 'Living room with a deep teal accent wall and warm wood furniture'),
  },
  {
    slug: 'exterior-painting',
    title: 'Exterior House Painting',
    icon: 'Home',
    summary: 'Weather-resistant coatings that protect your home and boost kerb appeal for years.',
    description:
      'Proper surface preparation is what makes exterior paint last. We pressure-wash, scrape, fill and prime before applying premium exterior-grade coatings suited to your climate.',
    features: ['Pressure washing & scraping', 'Weather-resistant coatings', 'Trim, gutters & fascia', 'Safe access equipment'],
    image: unsplash('1570129477492-45c003edd2be', 'White two-storey farmhouse with a freshly painted exterior and porch'),
  },
  {
    slug: 'commercial-painting',
    title: 'Commercial Painting',
    icon: 'Building2',
    summary: 'Offices, shops and restaurants painted on a schedule that keeps your business running.',
    description:
      'We plan around your opening hours with evening and weekend work, phased areas and fast-drying products, so your team and customers are disrupted as little as possible.',
    features: ['After-hours scheduling', 'Phased project planning', 'Brand colour matching', 'Fast-drying products'],
    image: unsplash('1497366811353-6870744d04b2', 'Open-plan office with freshly painted walls and ceilings'),
  },
  {
    slug: 'texture-decorative-painting',
    title: 'Wall Texture & Decorative Painting',
    icon: 'Palette',
    summary: 'Feature walls, textures and specialist finishes that give a room real character.',
    description:
      'From subtle limewash and concrete effects to stencils and bold colour blocking, we help you choose a decorative finish and apply it with care and consistency.',
    features: ['Texture & stucco finishes', 'Concrete & limewash effects', 'Accent and feature walls', 'Samples before we start'],
    image: unsplash('1541123603104-512919d6a96c', 'Living room with a concrete-effect decorative texture wall'),
  },
  {
    slug: 'waterproofing-wall-repairs',
    title: 'Waterproofing & Wall Repairs',
    icon: 'ShieldCheck',
    summary: 'Fix damp, cracks and peeling paint at the source before they spread.',
    description:
      'We identify the cause of damp patches and peeling, repair plaster and cracks, and apply waterproof coatings to roofs, terraces and exterior walls so your new paint stays put.',
    features: ['Damp & leak diagnosis', 'Crack and plaster repair', 'Terrace & roof coatings', 'Anti-fungal treatments'],
    image: unsplash('1562259949-e8e7689d7828', 'Paint roller applying a fresh coat of blue paint'),
  },
  {
    slug: 'wood-polishing-finishing',
    title: 'Wood Polishing & Finishing',
    icon: 'Hammer',
    summary: 'Restore doors, furniture, panelling and cabinets with a rich, protective finish.',
    description:
      'We sand, stain and seal wood surfaces using PU, melamine or lacquer finishes, bringing out the grain and protecting against everyday wear.',
    features: ['Sanding & surface prep', 'Stain and colour matching', 'PU, melamine & lacquer', 'Doors, cabinets & furniture'],
    image: unsplash('1594026112284-02bb6f3352fe', 'Polished floating wooden shelves on a warm painted wall'),
  },
];
