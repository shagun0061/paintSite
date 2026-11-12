import { photo } from './images.js';

/**
 * Portfolio projects, shown in the order listed here (newest first when
 * completedAt dates are added).
 *
 * Photos live in public/images/projects/. To add a job, drop the photo there
 * and use photo('/images/projects/…', 'description').
 *
 * Fields: slug (unique, used in the URL), title, category (Interior | Exterior |
 * Commercial | Decorative), summary, description (blank line = new paragraph),
 * optional location, optional completedAt ('YYYY-MM-DD'), coverImage, optional
 * beforeImage + afterImage (shows a comparison slider), gallery, featured
 * (shown on home page).
 */
const p = (file, alt) => photo(`/images/projects/${file}`, alt);

const img = {
  staircaseDark: p('staircase-dark-stain.jpg', 'Staircase with treads, stringers and handrail stained a rich dark brown'),
  staircaseSlats: p('staircase-slat-balustrade.jpg', 'Open staircase with dark-stained vertical timber slat balustrade'),
  staircaseDetail: p('staircase-stringer-detail.jpg', 'Close-up of a dark-stained timber stair stringer with a smooth clear finish'),
  starStencil: p('star-stencil-feature-wall.jpg', 'Bedroom feature wall with a hand-applied grey star stencil pattern'),
  metallicWall: p('metallic-feature-wall.jpg', 'Entry hallway feature wall finished in a metallic bronze paint'),
  roof1: p('roof-tiles-1.jpg', 'Concrete roof tiles freshly coated in a deep red roof paint'),
  roof2: p('roof-tiles-2.jpg', 'Restored red tiled roof with repointed ridge capping'),
  roof3: p('roof-tiles-3.jpg', 'Red roof coating across hips and ridges beside a brick chimney'),
  deck: p('merbau-deck-entry.jpg', 'Front entry deck and steps oiled to a glossy reddish-brown finish'),
  warehouse: p('warehouse-facade.jpg', 'Painter on a ladder finishing a blue and light-grey brick warehouse facade'),
  cladding: p('timber-cladding-new-build.jpg', 'New-build entry with vertical timber cladding and front door stained dark'),
  weatherboard: p('weatherboard-exterior.jpg', 'Weatherboard house repainted in off-white with black window frames and trims'),
  timberStairs: p('timber-staircase-stain.jpg', 'Winder timber staircase stained and clear-coated to a warm gloss'),
  frontStairs: p('front-stairs-merbau.jpg', 'Street-front timber stairs, letterbox and screening oiled in a rich red-brown'),
  frontStairsHouse: p('front-stairs-house.jpg', 'Three-storey rendered home with oiled timber entry stairs leading up from the driveway'),
  frontDoor: p('front-door-varnish.jpg', 'Timber front door with glass panels varnished to a high gloss'),
  fence: p('fence-charcoal.jpg', 'Garden fence painted charcoal with timber battens oiled in natural tones'),
  renderedHouse: p('rendered-house-repaint.jpg', 'Painter rolling the rendered walls of a two-storey home'),
};

const PROJECTS_UNSORTED = [
  {
    slug: 'rendered-home-repaint',
    title: 'Rendered Home Repaint',
    category: 'Exterior',
    summary: 'A two-storey rendered home repainted with a warm, weather-resistant exterior paint.',
    description: 'The render was cleaned and prepared, then repainted with exterior acrylic, with the trims and fascia finished in a dark contrast.',
    coverImage: img.renderedHouse,
    gallery: [img.renderedHouse],
    featured: true,
  },
  {
    slug: 'red-tiled-roof-restoration',
    title: 'Tiled Roof Restoration',
    category: 'Exterior',
    summary: 'A faded concrete tile roof cleaned, repaired and recoated in a deep red roof membrane.',
    description:
      'The roof was pressure-cleaned and the ridge capping repaired and repointed before the tiles were coated with a heavy-duty roof paint.\n\nThe result is a uniform, weather-protected roof that lifts the look of the whole property.',
    coverImage: img.roof2,
    gallery: [img.roof2, img.roof1, img.roof3],
    featured: true,
  },
  {
    slug: 'timber-entry-stairs-and-screening',
    title: 'Timber Entry Stairs & Screening',
    category: 'Exterior',
    summary: 'Street-front timber stairs, screening and letterbox brought back to a rich, glossy finish.',
    description:
      'The weathered timber was cleaned and prepared, then oiled to bring out the colour and grain and protect it from the sun and rain.',
    coverImage: img.frontStairsHouse,
    gallery: [img.frontStairsHouse, img.frontStairs],
    featured: true,
  },
  {
    slug: 'dark-stained-staircase',
    title: 'Dark-Stained Staircase',
    category: 'Interior',
    summary: 'Treads, stringers, handrail and slat balustrade stained a deep brown with a smooth clear finish.',
    description:
      'Every timber surface on the staircase was sanded and stained for an even, rich colour, then clear-coated for a hard-wearing finish that suits a busy family home.',
    coverImage: img.staircaseDark,
    gallery: [img.staircaseDark, img.staircaseSlats, img.staircaseDetail],
    featured: true,
  },
  {
    slug: 'star-stencil-feature-wall',
    title: 'Star Stencil Feature Wall',
    category: 'Decorative',
    summary: 'A bedroom feature wall with a hand-applied geometric star stencil.',
    description:
      'The wall was painted, masked and set out carefully so the pattern stays straight and evenly spaced from edge to edge, then stencilled by hand in charcoal grey.',
    coverImage: img.starStencil,
    gallery: [img.starStencil],
    featured: true,
  },
  {
    slug: 'merbau-deck-and-entry',
    title: 'Front Deck & Entry Finish',
    category: 'Exterior',
    summary: 'A front entry deck and steps oiled to a deep, glossy finish.',
    description:
      'The decking boards were cleaned and prepared before a protective decking oil was applied, bringing out the natural red-brown colour of the timber.',
    coverImage: img.deck,
    gallery: [img.deck],
    featured: true,
  },
  {
    slug: 'weatherboard-home-exterior',
    title: 'Weatherboard Home Exterior',
    category: 'Exterior',
    summary: 'A full weatherboard repaint in off-white with crisp black window frames and trims.',
    description:
      'The boards were scraped, filled and primed where needed, and the windows masked before the walls were painted. Black frames, gutters and fascia give the period home a sharp, modern contrast.',
    coverImage: img.weatherboard,
    gallery: [img.weatherboard],
    featured: true,
  },
  {
    slug: 'warehouse-facade-repaint',
    title: 'Warehouse Facade Repaint',
    category: 'Commercial',
    summary: 'A brick warehouse facade repainted in bold blue and light grey for a business.',
    description:
      'The brickwork, roller door and office front were repainted in the business colours, with work arranged around the workshop so it could keep trading.',
    coverImage: img.warehouse,
    gallery: [img.warehouse],
  },
  {
    slug: 'new-build-timber-cladding',
    title: 'New-Build Timber Cladding',
    category: 'Commercial',
    summary: 'Vertical timber cladding, soffit and front door stained dark on a new home for a builder.',
    description:
      'Working alongside the builder, we stained the entry cladding, soffit and door for a consistent dark finish ready for handover.',
    coverImage: img.cladding,
    gallery: [img.cladding],
  },
  {
    slug: 'metallic-feature-wall',
    title: 'Metallic Feature Wall',
    category: 'Decorative',
    summary: 'A long entry hallway wall finished in a metallic bronze paint.',
    description:
      'Clean masking lines and careful rolling give the metallic finish an even sheen along the full length of the hallway.',
    coverImage: img.metallicWall,
    gallery: [img.metallicWall],
  },
  {
    slug: 'timber-staircase-stain',
    title: 'Timber Staircase Stain & Clear Coat',
    category: 'Interior',
    summary: 'A winder staircase stained and clear-coated to a warm, glossy finish.',
    description: 'The treads and risers were sanded, stained and finished with a durable gloss clear coat.',
    coverImage: img.timberStairs,
    gallery: [img.timberStairs],
  },
  {
    slug: 'front-door-varnish',
    title: 'Front Door Refinish',
    category: 'Exterior',
    summary: 'A timber front door sanded back and varnished to a high-gloss finish.',
    description: 'The door and frame were sanded back and coated with an exterior varnish to protect the timber and bring back its colour.',
    coverImage: img.frontDoor,
    gallery: [img.frontDoor],
  },
  {
    slug: 'garden-fence-painting',
    title: 'Garden Fence Painting',
    category: 'Exterior',
    summary: 'A garden fence painted charcoal with timber batten inserts oiled in natural tones.',
    description: 'The fence panels were painted in a deep charcoal, while the batten inserts were oiled to keep their natural timber look.',
    coverImage: img.fence,
    gallery: [img.fence],
  },
];

export const PROJECTS = [...PROJECTS_UNSORTED].sort((a, b) => (b.completedAt || '').localeCompare(a.completedAt || ''));

export const getProject = (slug) => PROJECTS.find((p) => p.slug === slug);

export const relatedProjects = (project, count = 3) =>
  PROJECTS.filter((p) => p.category === project.category && p.slug !== project.slug).slice(0, count);
