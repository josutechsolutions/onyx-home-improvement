/* ==========================================================================
   Onyx Home Improvement LLC — site content
   --------------------------------------------------------------------------
   Everything you would want to edit lives in this file. Change it, then run
   `node build.mjs` to regenerate the HTML.

   Anything marked TODO needs a real value before launch.
   ========================================================================== */

export const BIZ = {
  name: 'Onyx Home Improvement',
  legal: 'Onyx Home Improvement LLC',
  tagline: 'Masonry & Stonework · Northern Virginia · Washington DC',
  phone: '(571) 632-9067',
  phoneHref: 'tel:+15716329067',
  email: 'onyxhomeimprovementsllc@gmail.com',
  city: 'Fairfax, VA',
  since: '2010',
  facebook: 'https://www.facebook.com/OnyxHomeImprovementLLC',
  origin: 'https://onyxhomeimprovementllc.com',

  // --- TODO: confirm before launch -------------------------------------
  // Fill these in and rebuild; the build drops the line entirely if empty.
  license: '',              // e.g. 'Class B #2705XXXXXX' — VA DPOR number
  street: '',               // leave blank to show service area only
  // ----------------------------------------------------------------------

  // Taken from the Google Business Profile, where the business sets them.
  hours: 'Open 7 days · 9 AM – 6 PM',

  // Headline rating, shown as a single combined figure.
  //
  // Google was 77 and HomeAdvisor 13 at build time (both straight 5.0). Note
  // that 5 of the 13 HomeAdvisor entries are syndicated Google reviews, so the
  // count of distinct reviews is nearer 85 than 90 — set `reviewCount` to
  // '85+' if you would rather state the conservative figure.
  rating: '5.0',
  reviewCount: '90+',
  ratingSource: 'Google and HomeAdvisor',

  googleProfileUrl: 'https://g.page/r/CcbcvJj8eQQhEBM',
  googleReviewUrl: 'https://g.page/r/CcbcvJj8eQQhEBM/review',
  ratingUrl: 'https://www.homeadvisor.com/rated.onyxhomeimprovementllc.156668864.html',

  // Paste your Formspree form ID here (formspree.io -> New Form).
  // Until it is set, the estimate form falls back to an email link.
  formspreeId: '',
};

/* --- Primary navigation -------------------------------------------------- */
export const NAV = [
  { label: 'Home',      href: '/' },
  { label: 'About',     href: '/about-us/' },
  { label: 'Services',  href: '/services/' },
  { label: 'Portfolio', href: '/portfolio/' },
  { label: 'Reviews',   href: '/reviews/' },
  { label: 'Contact',   href: '/get-your-free-estimate/' },
];

/* --- Services ------------------------------------------------------------
   `href` values intentionally match the old WordPress URLs so existing
   search rankings and inbound links survive the rebuild.
   ------------------------------------------------------------------------ */
export const SERVICES = [
  {
    slug: 'driveway-paving',
    href: '/masonry/driveway-paving/',
    title: 'Driveway Paving',
    group: 'Masonry',
    card: 'Asphalt, paver, and concrete driveways across Northern Virginia and DC. Base prep done right, every layer laid the way it should be.',
    image: 'driveway-paver-grey',
    feature: 'driveway-circle',
    gallery: ['driveway-circle', 'driveway-paver-grey', 'driveway-asphalt-new', 'driveway-roller', 'driveway-paver-tan', 'driveway-crew'],
    h1: 'Driveway Paving Built From the Base Up',
    intro: 'A professionally paved driveway does more than lift curb appeal — it improves safety, drainage, and the value of the property. Whether you are replacing a surface that has reached the end of its life or installing something new, the right materials and the right preparation make a difference you can see for decades.',
    sections: [
      {
        h: "Signs it's time to repave",
        p: [
          'Even a well-built driveway shows its age eventually. Cracking, potholes, water pooling after rain, and a faded, brittle surface all point toward repaving rather than patching. Uneven areas are not only unattractive — they become trip hazards and collect standing water.',
          'Once a driveway is past the point of minor repair, a new surface gives you a smoother, safer approach to the house and a chance to correct the drainage problems that shortened the life of the old one.',
        ],
      },
      {
        h: 'Materials that keep maintenance low',
        p: [
          'The material you choose has more effect on long-term upkeep than almost anything else. Concrete, interlocking pavers, and properly sealed asphalt all resist cracking, staining, and weather damage with very little attention year to year.',
          'Grading and sealant quality matter just as much. We walk through the options with you and recommend the combination that fits the site, the look you want, and the amount of maintenance you actually want to do. Pavers in particular make future repairs simple: individual units lift out and go back without patch marks.',
        ],
      },
      {
        h: 'Built to hold up to daily use',
        p: [
          'Every driveway we build starts with site preparation — excavation, a compacted aggregate base, and attention to how water will leave the surface. Skipping that step is the most common reason driveways fail early, and it is the step you can never go back and fix.',
          'From base prep through precision finishing, each stage gets the same attention. The result is a surface built for daily traffic and Northern Virginia freeze-thaw cycles.',
        ],
      },
    ],
  },
  {
    slug: 'brickwork',
    href: '/masonry/brickwork/',
    title: 'Brickwork',
    group: 'Masonry',
    card: 'Brick patios, entryways, steps, facades, and repointing. Traditional technique, materials chosen to match what is already there.',
    image: 'walkway-brick',
    feature: 'steps-stone',
    gallery: ['steps-brick', 'walkway-brick', 'brick-flooring', 'patio-red', 'steps-landing', 'wall-brick-long'],
    h1: 'Brickwork That Adds Character and Lasting Value',
    intro: 'Quality brickwork does not just change how a property looks — it adds character, strength, and value that holds. Whether you are refreshing a worn exterior, building something new, or restoring detail that has been lost, expert craftsmanship is what separates work that lasts from work that has to be redone.',
    sections: [
      {
        h: 'Custom brickwork designed to last',
        p: [
          'Every home deserves brick features built with care and attention to detail. Our projects are tailored to fit your style, whether that is a new patio, an elegant entryway, or a full exterior upgrade.',
          'We use premium materials and time-tested techniques so that every structure stands up to the elements and to time. We also help with the decisions that are easy to get wrong — color, bond pattern, and layout — so the finished work reads as though it was always part of the house.',
        ],
      },
      {
        h: 'Traditional technique, modern materials',
        p: [
          'Good brickwork honors the traditions of the craft while taking advantage of what modern materials do better. We blend old-world technique with current methods to deliver results that are classic and functional at once.',
          'Whether we are restoring a historic feature or building something entirely new, the approach is the same: care, precision, and materials that meet today’s performance standards without losing the timeless look.',
        ],
      },
      {
        h: 'Serving homeowners across Fairfax',
        p: [
          'We are proud to work throughout Fairfax and the surrounding communities, on everything from intricate facades to sturdy retaining walls and pathways. Local knowledge matters more than people expect — soil, drainage, and the way local weather works on mortar all shape how a job should be built.',
        ],
      },
    ],
  },
  {
    slug: 'retaining-walls',
    href: '/masonry/retaining-walls/',
    title: 'Retaining Walls',
    group: 'Masonry',
    card: 'Natural stone and segmental block walls that hold back soil, stop erosion, and add real structure to a yard.',
    image: 'wall-closeup',
    feature: 'wall-curved',
    gallery: ['wall-curved', 'wall-build', 'wall-steps', 'wall-closeup', 'wall-brick-long', 'wall-hero'],
    h1: 'Custom Retaining Walls Built for Strength and Style',
    intro: 'Retaining walls do more than hold back soil. They create structure, add depth to landscaping, and protect a property from erosion. Ours are built to match your style while standing up to the pressure behind them — because a retaining wall that looks good and fails in five years has not done its job.',
    sections: [
      {
        h: 'Strength, stability, and style together',
        p: [
          'We combine structural integrity with thoughtful design. Proper installation is the whole game: we take the time to prepare each site carefully so the wall resists shifting, hydrostatic pressure, and erosion.',
          'Material and design options run from natural stone to segmental concrete block, which means there is a solution that fits almost any property and budget. The result is functional, good-looking, and adds real value to the space around it.',
        ],
      },
      {
        h: 'Design ideas worth considering',
        p: [
          'A retaining wall can completely change the look and usable layout of a yard. Whether you prefer something sleek and modern or natural and rustic, the design should follow the land as much as the house.',
        ],
        list: [
          ['Natural stone walls', 'A timeless, organic look that suits traditional and modern landscapes alike. Especially good for garden borders, raised beds, and sloped yards.'],
          ['Segmental block walls', 'Clean lines and consistent structure, with an interlocking design that delivers long-term stability and a uniform look.'],
          ['Tiered walls', 'Multiple levels add dimension, maximize planting space, and improve drainage on steeper slopes.'],
          ['Planter-integrated walls', 'Planting areas built directly into the wall, adding greenery without giving up yard space.'],
          ['Curved walls', 'A softer shape than straight runs — well suited to garden settings and pathways where flow matters.'],
          ['Seat walls', 'Double as built-in outdoor seating around patios and fire pits, which makes entertaining easier without adding furniture.'],
        ],
      },
      {
        h: 'Drainage is not optional',
        p: [
          'Most retaining wall failures trace back to water, not weight. Every wall we build gets the drainage detail it needs — open-graded backfill, filter fabric, and outlets that actually carry water away from the structure.',
        ],
      },
    ],
  },
  {
    slug: 'foundation-repair',
    href: '/masonry/foundation-repair/',
    title: 'Foundation Repair',
    group: 'Masonry',
    card: 'Crack repair, stabilization, and restoration. Early attention to a foundation problem is the cheapest it will ever be.',
    image: 'foundation-exterior',
    feature: 'foundation-exterior',
    gallery: ['foundation-exterior', 'foundation-driveway'],
    h1: 'Professional Foundation Repair in Fairfax, VA',
    intro: 'Your foundation is the most important structural element of the house, and protecting it means protecting the whole investment. Cracks, shifting, and settling get worse quickly when they are left alone — which is why early detection and timely repair matter so much.',
    sections: [
      {
        h: 'Stop the damage early',
        p: [
          'Small cracks turn into big problems when they are not addressed. We stabilize the structure and protect against water intrusion, soil movement, and the damage that follows both.',
          'Catching a problem early preserves the strength of the foundation and saves you from far more extensive and expensive work later. We identify the problem areas and deliver repairs built to hold.',
        ],
      },
      {
        h: 'What drives the cost of a repair',
        p: [
          'No two foundation repairs are the same. The size and type of the damage, the foundation construction, the materials required, and how accessible the repair area is all affect the total.',
          'Soil conditions around the house and the extent of any underlying issues matter too. During your consultation we walk you through a clear, itemized estimate so you know exactly what you are looking at before anything starts.',
        ],
      },
      {
        h: 'Repairs you can rely on',
        p: [
          'From minor crack repair through major structural restoration, the goal is the same: a solution that holds, explained honestly, priced transparently. We would rather tell you a repair can wait than sell you work you do not need.',
        ],
      },
    ],
  },
  {
    slug: 'chimney-repair',
    href: '/masonry/chimney-repair/',
    title: 'Chimney Repair',
    group: 'Masonry',
    card: 'Repointing, crown and flashing repair, and rebuilds. A damaged chimney is a water problem before it is a fire problem.',
    image: 'chimney-home',
    feature: 'chimney-home',
    gallery: ['chimney-home'],
    h1: 'Chimney Repair and Restoration',
    intro: 'A damaged chimney leads to structural problems and safety risks, and it usually starts quietly. Whether the issue is cracked mortar, deteriorated flashing, or ordinary weathering, timely repair protects both the chimney and everything underneath it.',
    sections: [
      {
        h: 'Signs you may need chimney repair',
        p: [
          'Chimneys take constant weather from every direction. Small problems often go unnoticed until they cause water damage, heat loss, or structural movement. These are the indicators worth acting on:',
        ],
        list: [
          ['Cracks in the brick or crown', 'Visible cracking lets water in and accelerates deterioration, and can lead to shifting over time.'],
          ['Loose, missing, or damaged flashing', 'Flashing that has lifted or gone missing exposes the joint between chimney and roof — a small gap is enough.'],
          ['Water stains or moisture indoors', 'Spots, bubbling paint, or discoloration near the chimney usually mean water is already getting through.'],
          ['Rusted or corroded metal', 'Rust on flashing or the damper is direct evidence of moisture, and it weakens the assembly around it.'],
          ['Damp smells near the fireplace', 'Odors or a damp feeling point to hidden moisture, which leads to mold and mortar breakdown.'],
        ],
      },
      {
        h: 'Protecting the rest of the house',
        p: [
          'Your chimney shields the house from the elements, but minor issues like damaged flashing or failed mortar joints turn into serious structural problems when water reaches the roof deck, the walls, and the interior.',
          'We address the underlying cause rather than the symptom, which is the only way to keep the repair from coming back.',
        ],
      },
      {
        h: 'Local experience matters',
        p: [
          'Fairfax homes face seasonal swings that are hard on masonry — freeze-thaw cycles work on any joint that is already compromised. We know how local weather and aging construction materials interact, and we build repairs accordingly.',
        ],
      },
    ],
  },
  {
    slug: 'patio-design',
    href: '/stone-work/patio-design/',
    title: 'Patio Design',
    group: 'Stone Work',
    card: 'Paver, bluestone, and natural stone patios. Designed around how you actually use the space, set on a base that holds level.',
    image: 'patio-firepit',
    feature: 'patio-firepit',
    gallery: ['patio-firepit', 'patio-cobble', 'patio-backyard', 'patio-pool', 'patio-stone', 'patio-red'],
    h1: 'Patio Design and Installation',
    intro: 'A well-designed patio changes how you use the outside of your house. Whether you picture a quiet retreat, a place to host, or something in between, the layout and the materials should follow the way you actually live — then be built well enough to stay that way.',
    sections: [
      {
        h: 'Stone steps that tie the levels together',
        p: [
          'Stone staircases are not only functional — they are a design element that adds structure and elegance. We integrate steps into the patio layout so transitions between levels feel natural and the space stays accessible.',
          'Each staircase is built to match the materials and pattern of the patio it belongs to. On sloped ground especially, well-placed steps are the simplest way to take a patio from ordinary to custom.',
        ],
      },
      {
        h: 'Patios and walkways working together',
        p: [
          'Patios and walkways create flow, define space, and make a yard genuinely more usable. We design them together, with movement in mind, so the layout feels welcoming rather than accidental.',
          'Stone, pavers, and stamped concrete can all be tailored to the architecture of the house. Whether a path is guiding guests toward a seating area or leading to a garden, it completes the look while doing real work.',
        ],
      },
      {
        h: 'Built for the Fairfax climate',
        p: [
          'We build with materials suited to this climate — weather-resistant stone, properly sealed pavers, and joints set to handle freeze-thaw movement. Good drainage and a compacted base are what keep a patio level years after installation.',
        ],
      },
    ],
  },
  {
    slug: 'stone-veneer',
    href: '/stone-work/stone-veneer/',
    title: 'Stone Veneer',
    group: 'Stone Work',
    card: 'Natural stone veneer for facades, fireplaces, columns, and accent walls — real stone texture without full masonry weight.',
    image: 'veneer-siding',
    feature: 'veneer-siding',
    gallery: ['veneer-siding', 'veneer-walkway', 'veneer-drive', 'veneer-drive-build'],
    h1: 'Stone Veneer Crafted to Complement Your Home',
    intro: 'Stone veneer strikes the balance between natural beauty and practicality. Whether you are updating an exterior, facing a fireplace, or adding an accent wall, veneer delivers genuine stone texture without the weight or the cost of full masonry.',
    sections: [
      {
        h: 'Texture and depth on almost any surface',
        p: [
          'Veneer brings depth and character to surfaces inside and out. Whether the goal is a sleek contemporary finish or something more rustic, the range of colors, patterns, and textures is wide enough to match nearly any design direction.',
          'We help homeowners choose materials that complement what is already there rather than fighting it. Veneer is also an efficient way to highlight architectural details — columns, chimneys, and entry surrounds — that would otherwise go unnoticed.',
        ],
      },
      {
        h: 'Panels, walls, and full facades',
        p: [
          'Stone veneer panels and custom stone walls change the feel of a property quickly. They suit entryways, patios, accent walls, and outdoor living spaces, adding sophistication and structure at once.',
          'We design installations that blend into the property’s existing layout, with attention to corners, terminations, and the details that give away rushed work. Done well, veneer also improves resale appeal by making the exterior read as more considered.',
        ],
      },
      {
        h: 'Natural stone, installed properly',
        p: [
          'Natural veneer resists weather and wear far better than manufactured alternatives, which makes it the right choice when you want the work to last. Proper drainage plane, flashing, and mortar detail behind the stone are what determine whether it stays that way.',
        ],
      },
    ],
  },
  {
    slug: 'outdoor-fireplaces',
    href: '/stone-work/outdoor-fireplaces/',
    title: 'Outdoor Fireplaces',
    group: 'Stone Work',
    card: 'Custom fireplaces and fire pits scaled to the space, with seating walls, storage, and lighting built in where it makes sense.',
    image: 'fireplace-stone',
    feature: 'fireplace-stone',
    gallery: ['fireplace-stone', 'fireplace-build', 'fireplace-install', 'fireplace-bbq', 'patio-firepit'],
    h1: 'Outdoor Fireplaces Designed for Northern Virginia Homes',
    intro: 'A custom outdoor fireplace becomes the center of an outdoor living area — the thing that draws people together for conversation, for warmth, and for evenings that run longer than planned. Scale and placement are what make that happen, and both are design decisions worth getting right.',
    sections: [
      {
        h: 'A gathering space, not just a feature',
        p: [
          'We design fireplaces scaled properly to the patio, deck, or garden they sit in, so they blend with the architecture of the house instead of competing with it. Finishes run from rustic stone to sleek and modern.',
          'Placement affects more than looks. Done thoughtfully, it maximizes usable warmth, shelters the seating area from prevailing wind, and keeps smoke away from the house.',
        ],
      },
      {
        h: 'Ideas worth building in',
        p: [
          'Outdoor fireplaces can be as individual as the homes they belong to. Built-in seating walls, integrated lighting, pizza ovens, and firewood storage are all straightforward to incorporate when they are planned from the start rather than added later.',
          'We will work through the options that suit your space and budget — including whether a traditional wood-burning design or a lower-maintenance gas build makes more sense for how you will actually use it.',
        ],
      },
      {
        h: 'Materials that survive the weather',
        p: [
          'We select materials that hold up to sustained heat and to weather, and we build the firebox and flue to work properly rather than just look right. A fireplace that draws badly is a problem you notice every single time you use it.',
        ],
      },
    ],
  },
];

/* --- Real customer reviews ----------------------------------------------
   Verbatim from the Onyx HomeAdvisor profile (5.0 / 13 reviews).
   Reviews sourced from Google are marked so.
   ------------------------------------------------------------------------ */
export const REVIEWS = [
  { name: 'Ann', where: 'Arlington', date: '', project: '', source: '',
    text: 'Their crews came when they said they would and they left a nice clean job site at the end of every day.', feature: false, hide: true },

  { name: 'Patricia W.', where: '', date: 'June 2026', project: 'Brick and stone patios, walks, and steps installation', source: 'HomeAdvisor',
    text: 'John and his team replaced our back brick stairs that were falling apart. They were able to create a new set of stairs that matched our old pavers much better than the previous stairs. They were able to re-grade/level our patio so that it now sits flat. The grading before prevented us from being able to sit our table flat without wobbling. Lastly they provided a new walkway into our backyard. We love the new look and functionality.' },

  { name: 'Nancy P.', where: '', date: 'June 2026', project: 'Brick, stone or block wall installation', source: 'HomeAdvisor',
    text: 'Mike and his crew did a terrific job! He gave us a good price on the job, explained everything ahead of time, and carried it out as promised (and even more, throwing in a couple of extras). They arrived on time, completed everything as promised, cleaned up as they went! Mike personally supervised and followed up on each stage. We have absolutely no hesitation in recommending Onyx, and certainly would call on them if we had another project.' },

  { name: 'Michael G.', where: '', date: 'May 2026', project: '', source: 'HomeAdvisor',
    text: 'The Onyx team was a pleasure to deal with from start to finish. The owner showed up within an hour after my posting. The brick front stoop was a mess, made worse by an incomplete repair. Onyx quoted a good price. The work was completed skillfully and efficiently. Customer service was first-rate throughout. We now have the best-looking, best built brick steps to our front door that we could have hoped for. I recommend Onyx without reservation.' },

  // `image` is the photo shown beside this quote when it leads the home page.
  // It illustrates the kind of work described — it is not this customer's own
  // project. Swap in their actual job photo if you have one.
  { name: 'Susan D.', where: '', date: 'March 2026', project: 'Paver walkway', source: 'Google',
    image: 'walkway-curved',
    text: 'I’m extremely happy with my new paver walkway! The workmanship is excellent, and the project turned out even better than I imagined. The crew was professional, timely, and paid attention to every detail — from the layout and leveling to the final cleanup. The walkway looks beautiful, adds great curb appeal, and feels very solid underfoot. I highly recommend Onyx to anyone looking for quality paver work.' },

  { name: 'Bob R.', where: '', date: 'March 2026', project: 'Driveway replacement and front entry steps', source: 'Google',
    text: 'Had a great experience with Onyx replacing and widening our driveway. They also replaced our front entry steps. John Cash walked us through the process and then kept us informed of the next steps as the actual work was progressing. The crew was very professional and we are very happy with the finished product. Will definitely use again for any future projects.' },

  { name: 'Dani S.', where: '', date: 'March 2026', project: 'Paver patio leveling and drainage repair', source: 'Google',
    text: 'Onyx leveled our paver patio for us after roots caused the pavers to lift up and be a danger to us. We are older and more likely to be injured if we fall. They dug out the roots and about 4 inches of dirt, repaired the broken drainage pipe underneath, leveled the foundation, added bluestone then put back our pavers and added a few new ones. They also built a small wall around the flower bed. The whole effect is quite stunning. They changed the pattern along the side as well making it more pleasing to the eye. We are quite happy with the result.' },

  { name: 'Erin J.', where: '', date: 'March 2026', project: 'Front stoop, walkway and driveway', source: 'Google',
    text: 'Our work with Onyx was amazing. Our front stoop, walkway, driveway and back areas were a mess. Together we planned, worked, and accomplished amazing things. The team and work crew were very respectful and willing to listen to and address any and all concerns that we had. We are very pleased with their work.' },

  { name: 'Larry D.', where: '', date: 'May 2026', project: 'Brick or stone tuckpointing', source: 'HomeAdvisor',
    text: 'We were very pleased with the work they did completely replacing the steps up to the front of our house. They also designed and installed pavers to create an attractive entrance into our home. Hard working crew and very personable, easy to talk to owners.' },

  { name: 'Jason S.', where: '', date: 'May 2026', project: 'Repointing and step repair', source: 'HomeAdvisor',
    text: 'After some discussion we decided to have all of it repointed as well as just the necessary repairs. I must say that was the right choice as it looks great. All of the mortar joints were redone, a few cracked bricks were replaced, and the steps are once again complete and solid. Great work.' },

  { name: 'Gemma V.', where: '', date: 'June 2026', project: '', source: 'HomeAdvisor',
    text: 'Onyx’s response was fast and professional. They came out and gave a very fair price and did a fantastic job. They were professional, expedient, friendly and punctual. Would highly recommend them.' },

  { name: 'RJ C.', where: '', date: 'March 2026', project: 'Driveway repaving', source: 'Google',
    text: 'We had our driveway repaved and it looks great. These brothers are delightful. Highly recommend for your next project.' },

  { name: 'Eric O.', where: '', date: 'June 2026', project: 'Interlocking pavers for patios, walks & steps', source: 'HomeAdvisor',
    text: 'Beautiful work.' },

  { name: 'Michael C.', where: '', date: 'March 2026', project: '', source: 'HomeAdvisor',
    text: 'Great team!' },
];

/* The three shown on the home page: one lead quote plus two supporting. */
export const FEATURED_REVIEWS = ['Susan D.', 'Bob R.', 'Nancy P.'];

/* --- Service areas ------------------------------------------------------- */
export const AREAS = [
  'Fairfax, VA', 'Vienna, VA', 'Falls Church, VA', 'Arlington, VA',
  'Alexandria, VA', 'Herndon, VA', 'Manassas, VA', 'Manassas Park, VA',
  'Fredericksburg, VA', 'Washington, DC',
];

/* --- Portfolio ----------------------------------------------------------- */
/* Order matters — this is the sequence on the portfolio page. */
export const PORTFOLIO = [
  'driveway-circle', 'walkway-bluestone', 'patio-firepit', 'wall-curved',
  'walkway-brick', 'driveway-paver-grey', 'steps-stone', 'patio-cobble',
  'walkway-curved', 'driveway-asphalt-new', 'wall-steps', 'patio-backyard',
  'walkway-steps', 'driveway-paver-tan', 'fireplace-stone', 'patio-pool',
  'walkway-front', 'wall-build', 'steps-brick', 'veneer-siding',
  'driveway-paver-band', 'walkway-flowers', 'patio-stone', 'fireplace-bbq',
  'driveway-roller', 'walkway-crew', 'patio-build', 'wall-closeup',
  'steps-landing', 'driveway-paver-blue', 'walkway-banded', 'veneer-drive',
  'driveway-crew', 'walkway-side', 'steps-wide', 'fireplace-build',
];

/* Nine shown on the home page. */
export const HOME_PORTFOLIO = [
  'driveway-circle', 'walkway-bluestone', 'patio-firepit',
  'wall-curved', 'walkway-brick', 'driveway-paver-grey',
  'steps-stone', 'patio-cobble', 'walkway-curved',
];

/* --- FAQ ----------------------------------------------------------------- */
export const FAQ = [
  {
    q: 'Do you charge for estimates?',
    a: ['No. Estimates are free across our entire service area. We come out, look at the site, talk through what you are trying to accomplish, and give you a written price with no obligation.'],
  },
  {
    q: 'How long has Onyx been in business?',
    a: ['We have been serving homeowners in and around Fairfax since 2010. Onyx is family-operated — you deal with the owners directly, not a salesperson, and the same people who quote the job are on site while it is being built.'],
  },
  {
    q: 'What areas do you serve?',
    a: ['Fairfax, Vienna, Falls Church, Arlington, Alexandria, Herndon, Manassas, Manassas Park, and Fredericksburg in Virginia, plus Washington, DC. If you are just outside that list, call and ask — we often can.'],
  },
  {
    q: 'How long does a typical project take?',
    a: ['It depends heavily on scope and weather. A front walkway or set of steps is often two to three days. A full driveway replacement usually runs three to five. Larger patios, retaining walls, and multi-part projects take longer, and we give you a realistic schedule with the estimate rather than an optimistic one.'],
  },
  {
    q: 'What affects the price of a masonry project?',
    a: ['Square footage, material choice, site access, how much excavation and base work is needed, and any drainage that has to be corrected. Access is the factor homeowners tend to underestimate — a backyard that equipment cannot reach changes the labor considerably. We break all of this out in the estimate so you can see where the money goes.'],
  },
  {
    q: 'Do you clean up at the end of each day?',
    a: ['Yes. Job site cleanliness is something we take seriously, and it comes up repeatedly in our reviews. You should be able to use your property while a project is in progress.'],
  },
  {
    q: 'Do you handle drainage as part of a project?',
    a: ['Yes, and in most cases we insist on it. Water is the reason most masonry and paving fails early. If your existing drainage is contributing to the problem we are being asked to fix, we will tell you and include the correction in the scope.'],
  },
];

/* --- Homepage "why us" points -------------------------------------------- */
export const POINTS = [
  ['Family-operated since 2010', 'You deal with the owners directly. The people who quote your job are on site while it is being built.'],
  ['Base prep done properly', 'Excavation, compacted aggregate, and drainage before anything decorative goes down. It is the step that decides whether the work lasts.'],
  ['Clean sites, kept schedules', 'Our crews show up when they say they will and leave the site clean at the end of every day — the thing customers mention most.'],
  ['Free written estimates', 'Itemized, no obligation, and honest about what can wait. We would rather keep a customer than sell a job.'],
];
