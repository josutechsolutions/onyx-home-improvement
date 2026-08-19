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
  city: 'Northern Virginia',
  since: '2010',
  facebook: 'https://www.facebook.com/OnyxHomeImprovementLLC',
  origin: 'https://onyxhomeimprovementllc.com',

  // --- TODO: confirm before launch -------------------------------------
  // Fill these in and rebuild; the build drops the line entirely if empty.
  license: '#2705193852',   // VA DPOR number, rendered as "License #…"
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
  formspreeId: 'xaewlaon',

  // --- Analytics & search-console verification ---------------------------
  // Both lines are dropped entirely from the HTML while blank, so the site is
  // safe to ship before either account exists.
  //
  // gscVerification is emitted on every build, including staging, so the tag
  // is already in place whenever you verify. ga4Id is emitted only on a
  // production build (no BASE_PATH) — otherwise local previews and the
  // staging site would report as real traffic.
  ga4Id: '',            // 'G-XXXXXXXXXX' — GA4 > Admin > Data streams > Web
  gscVerification: '',  // token only, not the whole tag — Search Console >
                        // Add property > URL prefix > HTML tag; from
                        // <meta name="google-site-verification" content="THIS">
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
    warranty: ['asphalt', 'concrete', 'pavers'],
    reviewFrom: 'RJ C.',
    process: [
      ['Site visit and written estimate', 'We walk the driveway with you, look at how water currently leaves it, check access for equipment, and measure. You get an itemized written price before anything is scheduled.'],
      ['Excavation', 'The old surface comes out and we dig to the depth the new surface has to carry. Skipping depth here is the single most common reason a driveway fails early, and it cannot be corrected later.'],
      ['Base and compaction', 'Aggregate goes in and is compacted in lifts rather than all at once. Compaction is what stops the settling you see as dips and low spots a few winters in.'],
      ['Grading for drainage', 'Pitch is set so water runs off the surface and away from the house and garage, not toward them. If the old driveway had a drainage problem, this is the stage where it gets corrected.'],
      ['Surface installation', 'Asphalt is laid hot and rolled, or pavers are set, cut to the edges, and locked in. Either way the finish work happens on a base that is already right.'],
      ['Edging, jointing, and cleanup', 'Edge restraint goes in, paver joints are swept and compacted, and the site is cleaned. We walk the finished job with you before we leave.'],
    ],
    faq: [
      { q: 'How long does a new driveway take?',
        a: ['A typical residential replacement runs three to five days from excavation to finished surface. Larger or steeper driveways, poor access, and drainage correction all add time. Weather is the biggest variable — asphalt in particular cannot be laid properly in the wet or the cold, and we would rather wait a few days than lay a surface that will not hold.'] },
      { q: 'Should I choose asphalt, pavers, or concrete?',
        a: ['Asphalt is the least expensive up front, goes down fastest, and is straightforward to resurface later. Pavers cost more initially but individual units lift out and go back without a patch mark, so repairs and utility work do not leave scars. Concrete sits between the two and gives the cleanest uniform surface.', 'We walk through all three against your site, your budget, and how much maintenance you actually want to do — rather than steering you toward one by default.'] },
      { q: 'Can you pave over the existing driveway?',
        a: ['Sometimes, but usually it is a false economy. Overlaying leaves whatever caused the original failure in place underneath, so cracks reflect back through the new surface, often within a couple of seasons. If the base is sound and the problem is genuinely surface-level, we will tell you an overlay is reasonable. More often, the honest answer is that the base is the problem.'] },
      { q: 'When can I drive on it?',
        a: ['A paver driveway is ready as soon as the edging and jointing are finished. New asphalt needs to cure — light traffic after a day or two, and we ask you to keep heavy vehicles and sharp turning off it for longer than that, especially in hot weather. We give you specific timing for your job when we finish.'] },
      { q: 'Will you fix the drainage that ruined the old driveway?',
        a: ['Yes, and we will raise it whether or not you ask. Water is the reason most paving fails early. If the grading around your driveway is sending water the wrong way, replacing the surface without correcting it just buys you a few years before the same failure repeats. It goes in the estimate as a line item so you can see what it costs.'] },
    ],
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
    warranty: ['masonry'],
    reviewFrom: 'Patricia W.',
    process: [
      ['Assessment and brick matching', 'We look at what is already there — the brick size, color, texture, and the bond it was laid in — and work out what will blend. On repairs, matching the existing brick matters more than anything else you choose.'],
      ['Mortar analysis', 'Old brick was laid with softer mortar than modern mixes. We match the mortar to the brick rather than defaulting to the strongest available, because a mortar harder than the brick will destroy the brick instead of protecting it.'],
      ['Preparation and demolition', 'Failed material comes out, joints are raked to depth, and surfaces are cleaned. On new work, the base or substrate is prepared first.'],
      ['Layout and dry bond', 'Courses are laid out dry so the pattern lands correctly at corners, edges, and openings. This is where a bond pattern either reads as deliberate or reads as improvised.'],
      ['Laying or repointing', 'Brick is laid and joints are struck to match the existing profile. Consistency in the joint is what your eye actually reads as good brickwork.'],
      ['Cleaning and cure', 'The work is cleaned down without acid-washing new mortar prematurely, and left to cure. We clean the site at the end of every day, not just at the end of the job.'],
    ],
    faq: [
      { q: 'Can you match my existing brick?',
        a: ['Usually, and it is the first thing we look at. Brick sizes and colors have changed over the decades, so a close match often means sourcing a reclaimed or specialty brick rather than picking the nearest thing off a pallet. On an older house we will show you options before ordering, because a mismatch on a front facade is permanent and obvious.'] },
      { q: 'What is repointing, and how do I know if I need it?',
        a: ['Repointing is raking out failed mortar joints and replacing them. You need it when mortar is crumbling, has receded noticeably behind the face of the brick, or you can rake it out with a key. Left alone, open joints let water into the wall, and freeze-thaw does the rest — at which point you are replacing brick rather than mortar.'] },
      { q: 'Will the new mortar match the old?',
        a: ['We mix to match color and tool the joint to the same profile, and on most walls the repair reads as part of the wall within a season. New mortar cures lighter and darkens as it weathers, so there is usually a visible difference for the first few months. We tell you that up front rather than letting you discover it.'] },
      { q: 'Why is there white powder on my brick?',
        a: ['That is efflorescence — mineral salts carried to the surface by water moving through the masonry. It is cosmetic in itself and often washes off, but it is a signal worth reading: it means water is getting into the wall and traveling. If it keeps returning after cleaning, the useful question is where the water is coming in, not how to scrub it off.'] },
    ],
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
        h: 'Serving homeowners across Northern Virginia',
        p: [
          'We are proud to work throughout Northern Virginia and the surrounding communities, on everything from intricate facades to sturdy retaining walls and pathways. Local knowledge matters more than people expect — soil, drainage, and the way local weather works on mortar all shape how a job should be built.',
        ],
      },
    ],
  },
  {
    slug: 'retaining-walls',
    warranty: ['walls'],
    reviewFrom: 'Nancy P.',
    process: [
      ['Survey the slope and the water', 'We measure the grade, work out how much soil the wall actually has to hold, and trace where water moves across the site. Load and water are what size the wall — the look is chosen afterward.'],
      ['Design, engineering, and permits', 'Taller walls and walls carrying a surcharge such as a driveway need an engineered design and a permit. We tell you which category yours falls into before you commit, and confirm the requirement with your jurisdiction rather than guessing.'],
      ['Excavation and footing', 'We dig below the finished grade and build a compacted aggregate footing. The first course sits below ground level, which is what stops the wall walking forward over time.'],
      ['Drainage detail', 'Open-graded backfill, filter fabric, and an outlet that carries water somewhere useful. Most wall failures are water failures, and this is the stage that decides whether yours is one of them.'],
      ['Courses and backfill', 'Units are set level and backfilled as we go, compacting in lifts behind the wall rather than dumping soil in at the end.'],
      ['Caps and finish grading', 'Caps are set and secured, grade is restored above and below, and the site is cleaned up.'],
    ],
    faq: [
      { q: 'How tall can a wall be before it needs an engineer?',
        a: ['In most Northern Virginia jurisdictions the threshold is around four feet, measured from the bottom of the footing rather than from the ground you are standing on — which catches people out, because a wall that looks three feet tall may not be. Walls carrying extra load above them, such as a driveway or a slope, can trigger the requirement lower.', 'We confirm the specific requirement with your county before we build rather than working from a rule of thumb.'] },
      { q: 'Do you handle the permit?',
        a: ['Where a permit is required we walk you through what is needed and coordinate with the jurisdiction. What we will not do is build a wall that needed a permit without one — it is your property that carries the consequence at resale or inspection, not ours.'] },
      { q: 'Why do retaining walls fail?',
        a: ['Almost always water, not weight. Soil that cannot drain becomes far heavier than the wall was built to hold, and hydrostatic pressure pushes it out from behind. The second cause is a footing that was not dug below grade or not compacted. Both are invisible once the wall is finished, which is exactly why they get skipped.'] },
      { q: 'Segmental block or natural stone?',
        a: ['Block is engineered, consistent, and the straightforward choice for a structural wall of any height — it is designed to lock together and to be built to a spec. Natural stone costs more and takes longer, and it looks like nothing else. Many properties end up with block where the wall is doing structural work and stone where it is doing visual work.'] },
    ],
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
    reviewFrom: 'Gemma V.',
    process: [
      ['Inspection and diagnosis', 'We look at the crack pattern, the direction of movement, and the ground around the house. What a crack looks like tells you a great deal about whether it is settlement, water, or seasonal movement — and those need different repairs.'],
      ['Find the water', 'Most foundation problems are water problems first. Gutters discharging at the wall, grade pitched toward the house, and a driveway or patio draining the wrong way are ordinary causes with ordinary fixes.'],
      ['Written scope and honest scoping', 'You get an itemized estimate and a straight answer about urgency. If a crack is stable and cosmetic, we say so.'],
      ['Excavation where needed', 'Exterior repairs mean opening up the ground against the wall. We protect what we can and restore what we disturb.'],
      ['Repair and stabilization', 'Cracks are cut, cleaned, and filled properly rather than skimmed over, and the affected masonry is rebuilt where rebuilding is what it needs.'],
      ['Drainage correction and restoration', 'The water path is corrected so the repair is not undone by the thing that caused it, then grade, plantings, and surfaces go back.'],
    ],
    faq: [
      { q: 'How do I know whether a crack is serious?',
        a: ['Width, direction, and whether it is moving. Fine vertical cracks in a poured wall are common and often cosmetic. Horizontal cracks, stair-step cracking through block joints, and any crack wide enough to put a coin into are worth looking at now rather than next year. So is a crack that has visibly changed since you first noticed it.', 'If you are unsure, that is what a free estimate is for. We would rather look and tell you it can wait.'] },
      { q: 'Is this masonry work or structural engineering?',
        a: ['Some of it is neither ours to do nor safe to guess at. Crack repair, stabilization, repointing, waterproofing, and rebuilding damaged masonry are masonry work. Underpinning, piering, and anything involving structural movement of the house belong to a structural engineer, and the honest thing is to tell you that rather than take the job.', 'If what your house needs is outside masonry repair, we will say so plainly.'] },
      { q: 'Will you tell me if the repair can wait?',
        a: ['Yes. A foundation is the one place where the cheapest version of a problem is the version you catch early, so there is nothing to gain from us talking you into work you do not need — and a great deal to lose. Several of our reviews mention exactly this.'] },
      { q: 'Why does foundation work cost so differently from job to job?',
        a: ['Because the visible crack is rarely the whole scope. The type of foundation, the extent of damage behind the surface, how accessible the repair area is, how much excavation is needed, and the soil conditions around the house all move the number substantially. We break the estimate out by line so you can see which of those is driving your price.'] },
    ],
    href: '/masonry/foundation-repair/',
    title: 'Foundation Repair',
    group: 'Masonry',
    card: 'Crack repair, stabilization, and restoration. Early attention to a foundation problem is the cheapest it will ever be.',
    image: 'foundation-exterior',
    feature: 'foundation-exterior',
    gallery: ['foundation-exterior', 'foundation-driveway'],
    h1: 'Professional Foundation Repair in Northern Virginia',
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
      {
        h: 'What we repair',
        p: [
          'Foundation work covers a wide range, from a morning of crack repair to rebuilding a failed section of wall. These are the jobs we are called out for most:',
        ],
        list: [
          ['Crack repair and sealing', 'Cracks cut back, cleaned, and filled properly so the repair bonds to sound material instead of sitting on the surface.'],
          ['Block and brick foundation repair', 'Failed courses rebuilt and deteriorated mortar joints repointed, matched to the existing construction.'],
          ['Parging and resurfacing', 'A failed or spalling exterior coating removed and replaced, which protects the wall as well as tidying it.'],
          ['Water intrusion and exterior waterproofing', 'Excavating against the wall, treating it, and correcting where water is arriving from in the first place.'],
          ['Drainage correction', 'Regrading, redirecting downspout discharge, and fixing hardscape that pitches water back toward the house.'],
          ['Settlement and stabilization', 'Stabilizing masonry that has moved, and rebuilding where the material is past repair.'],
        ],
      },
      {
        h: 'The problems behind the problem',
        p: [
          'Foundations rarely fail on their own. In the great majority of what we see, the foundation is the place where a water problem somewhere else on the property finally became visible — gutters discharging at the wall, ground pitched toward the house rather than away, a driveway or patio draining backward, or a downspout that runs into a buried line nobody has checked in twenty years.',
          'That is why our first visit spends as much time on the ground around the house as on the crack you called about. Repairing masonry while leaving the water in place produces a repair that fails again, on your money the second time. If the cause is something simple and cheap, we would rather tell you to fix that and watch the crack.',
        ],
      },
    ],
  },
  {
    slug: 'chimney-repair',
    reviewFrom: 'Jason S.',
    process: [
      ['Inspection from the ground and the roof', 'A chimney has to be looked at from above to be assessed honestly. We check the crown, the flashing, the joint at the roofline, and the condition of the mortar on every face.'],
      ['Trace the water path', 'Almost every chimney problem is water finding a way in. Before scoping a repair we work out where it is entering, because repairing the symptom leaves the leak in place.'],
      ['Written scope', 'You get an itemized estimate that says which parts need work now and which are worth watching. Chimneys are easy to over-scope, and we would rather be specific.'],
      ['Repointing, crown, and flashing', 'Failed joints are raked and repointed, cracked or spalled brick is replaced, the crown is repaired or recast with a proper overhang and drip edge, and flashing is reset so the roof-to-chimney joint actually sheds water.'],
      ['Rebuild where repair will not hold', 'Where deterioration has gone too far, the affected section is taken down and rebuilt rather than patched. We tell you which one you are looking at before we start.'],
      ['Weatherproofing and cleanup', 'Where appropriate, a breathable water repellent goes on so masonry can still dry outward, and the roof and grounds are cleared of debris.'],
    ],
    faq: [
      { q: 'What is a chimney crown, and why does it matter so much?',
        a: ['The crown is the sloped slab across the top of the chimney that sheds water away from the masonry below. When it cracks — and thin, poorly formed crowns crack early — water runs straight down inside the chimney structure. A large share of the chimney damage we are called out to look at started as a failed crown, which is why we assess it first.'] },
      { q: 'How often does a chimney need repointing?',
        a: ['There is no fixed interval; it depends on exposure, the original mortar, and how much weather that face of the house takes. A chimney is the most exposed masonry on the building, so it almost always needs attention before the walls do. The practical answer is to look at it when you notice receding joints, spalling brick faces, or staining on the interior near the fireplace.'] },
      { q: 'I have a stain on the ceiling near the chimney. Is that the chimney?',
        a: ['Often, and the usual culprit is flashing rather than the brickwork. Flashing is the metal that seals the joint between the chimney and the roof, and when it lifts, corrodes, or was poorly detailed to begin with, water gets in at exactly that point. It is worth looking at before you repaint, because the stain will come back.'] },
      { q: 'Why does freeze-thaw damage matter here specifically?',
        a: ['Northern Virginia cycles above and below freezing repeatedly through a single winter rather than staying cold. Water that has soaked into a mortar joint expands each time it freezes and works the joint open a little more. That is why a small crack in November is a noticeably larger one by March, and why timing a repair before winter is worth doing.'] },
    ],
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
          'Northern Virginia homes face seasonal swings that are hard on masonry — freeze-thaw cycles work on any joint that is already compromised. We know how local weather and aging construction materials interact, and we build repairs accordingly.',
        ],
      },
      {
        h: 'The repairs we carry out',
        p: [
          'Most chimneys need one or two of these rather than all of them, and a scope that lists everything is worth a second opinion:',
        ],
        list: [
          ['Repointing', 'Failed mortar joints raked back to sound material and replaced, matched in color and joint profile to the existing work.'],
          ['Crown repair or recasting', 'A cracked or undersized crown rebuilt with proper slope, overhang, and a drip edge so water is thrown clear of the brickwork.'],
          ['Flashing repair and replacement', 'The roof-to-chimney joint resealed and detailed correctly — the most common single source of a ceiling stain near a fireplace.'],
          ['Brick replacement', 'Spalled or cracked units cut out and replaced individually rather than skimmed over with mortar.'],
          ['Partial rebuild', 'Where deterioration has gone past repair, the affected section taken down to sound masonry and rebuilt.'],
          ['Waterproofing', 'A breathable repellent applied where it is appropriate, which sheds water while still letting the masonry dry outward.'],
        ],
      },
      {
        h: 'Matching mortar to the chimney you have',
        p: [
          'Mortar is not one product, and using the wrong one does real damage. Older brick is softer than modern brick and was laid with a softer lime-based mortar that was intended to move slightly and to fail before the brick does — mortar is the sacrificial part of the wall by design.',
          'Repointing an older chimney with a modern high-strength mix produces joints harder than the brick around them. The assembly still has to move, so instead of the mortar giving, the faces of the brick spall off. It is a common and expensive mistake, and it is why we match the mortar to what is already there rather than defaulting to the strongest bag available.',
        ],
      },
    ],
  },
  {
    slug: 'patio-design',
    warranty: ['pavers', 'concrete', 'masonry'],
    reviewFrom: 'Dani S.',
    process: [
      ['How you will actually use it', 'Before any layout, we talk about what the space is for — dining, a fire feature, a route to somewhere else — and how many people at once. Patios that feel wrong are usually the right material at the wrong size.'],
      ['Layout and material selection', 'We set the shape and size on the ground, and choose material against the house, the light, and the maintenance you are willing to do.'],
      ['Excavation', 'The area is dug out to the depth the base needs, not to the depth that happens to be convenient. This is the stage that decides whether it stays level.'],
      ['Base and compaction', 'Aggregate goes in and is compacted in lifts, with the grade already pitched so water leaves the surface and travels away from the house.'],
      ['Setting bed and laying', 'A screeded bedding layer, then units set to the pattern. Cuts at the edges are made to fit rather than filled in with slivers.'],
      ['Edging, jointing, and compaction', 'Edge restraint holds the field together, joints are filled and compacted in, and the site is cleaned down.'],
    ],
    faq: [
      { q: 'How long does a patio take to build?',
        a: ['Most residential patios run three to six days depending on size, access, and how much excavation is involved. A backyard that equipment cannot reach is the factor homeowners most often underestimate — wheelbarrowing base material by hand can add days to an otherwise straightforward job, and we account for it in the estimate rather than discovering it on day two.'] },
      { q: 'Pavers, natural stone, or poured concrete?',
        a: ['Pavers are the most forgiving over time: individual units lift and reset, so settling, staining, and utility work do not mean replacing the whole surface. Natural stone such as bluestone gives a look manufactured units do not, at a higher cost. Poured concrete is the cheapest large surface but cracks on its own schedule, and a crack in concrete is permanent in a way a lifted paver is not.'] },
      { q: 'Will my patio settle?',
        a: ['A properly built one settles very little, and what does happen is correctable. Settling comes from base material that was not compacted in lifts, or from water moving under the surface because the grade sends it the wrong way. Both are decisions made before a single paver is laid, which is why we spend more of the job below the surface than on it.'] },
      { q: 'Can you fix an existing patio that has sunk or pools water?',
        a: ['Yes, and it is a common call. With pavers, the field is lifted, the base corrected and recompacted, the grade re-established, and the same units reset — you generally do not need new material. If the original base was never adequate, we will tell you that rebuilding is the honest fix rather than relevelling something that will sink again.'] },
      { q: 'Do I need a permit for a patio?',
        a: ['A ground-level patio usually does not, but requirements vary by jurisdiction and change when steps, walls, or proximity to a property line are involved. We check with your county rather than assuming, and tell you before work is scheduled.'] },
    ],
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
        h: 'Built for the Northern Virginia climate',
        p: [
          'We build with materials suited to this climate — weather-resistant stone, properly sealed pavers, and joints set to handle freeze-thaw movement. Good drainage and a compacted base are what keep a patio level years after installation.',
        ],
      },
    ],
  },
  {
    slug: 'stone-veneer',
    warranty: ['masonry'],
    reviewFrom: 'Gemma V.',
    process: [
      ['Assess the substrate', 'What is behind the stone determines how it has to be installed. We check the existing wall, the sheathing, and how water currently drains down the face of the building before quoting anything.'],
      ['Drainage plane and lath', 'A weather-resistive barrier and metal lath go on first, with a way for water that gets behind the stone to get back out. This layer is invisible in the finished job and is the single biggest difference between veneer that lasts and veneer that fails.'],
      ['Scratch coat', 'A mortar bed is applied over the lath and keyed so the stone has something to bond to properly.'],
      ['Dry layout', 'Stone is laid out on the ground first to balance color, size, and shape across the wall. Skipping this is how you end up with all the large pieces in one corner.'],
      ['Setting, corners, and terminations', 'Stone is set from the corners inward. Corners and edges are where rushed veneer gives itself away, so they get cut and fitted rather than filled.'],
      ['Pointing and cleaning', 'Joints are pointed to the profile the look calls for, and the face is cleaned before the mortar sets hard.'],
    ],
    faq: [
      { q: 'Natural stone or manufactured veneer?',
        a: ['Manufactured veneer is lighter, cheaper, and comes in consistent shapes, which makes installation faster. Natural stone costs more, weighs more, and holds its color and texture far longer — manufactured product is pigmented through a surface layer and fades with sustained sun exposure in a way real stone does not. On a front elevation that will be looked at every day for twenty years, the difference is worth the cost. On a sheltered accent wall, often it is not.'] },
      { q: 'Can veneer fall off?',
        a: ['Badly installed veneer can, and when it does the cause is almost always behind the stone rather than in it — no drainage plane, no proper lath, or stone set directly onto a surface it cannot bond to. Water gets behind, has nowhere to go, and freeze-thaw pushes the stone off the wall. It is the reason we spend as much time on what goes on before the stone as on the stone itself.'] },
      { q: 'Can it go over my existing brick or siding?',
        a: ['Over sound masonry, usually yes, with the surface prepared so the mortar bonds. Over siding it is not a matter of sticking stone to what is there — the siding comes off and the wall is built up properly underneath. Anyone offering to apply veneer straight onto existing siding is describing a job that will fail.'] },
      { q: 'Does stone veneer need maintenance?',
        a: ['Very little. An occasional rinse, and attention to any joint that opens up so water does not start traveling behind the face. What matters more is keeping gutters and grade doing their job, since veneer problems almost always begin as water problems somewhere else on the building.'] },
    ],
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
      {
        h: 'Where veneer works',
        p: [
          'Veneer earns its place where you want the weight and texture of stone on something that was never built to carry structural masonry:',
        ],
        list: [
          ['Full and partial facades', 'A whole elevation, or a water table and base course that grounds the house visually without facing the entire wall.'],
          ['Chimney chases', 'A framed chase faced in stone so it reads as masonry from the ground rather than as a box.'],
          ['Columns and entry surrounds', 'Porch columns and door surrounds, where the added depth changes how the entrance reads more than its size would suggest.'],
          ['Interior fireplace walls', 'A hearth wall faced floor to ceiling, with the fireplace opening and hearth detailed together.'],
          ['Accent and seating walls', 'Freestanding garden and seating walls faced on both sides, with caps that tie into the surrounding hardscape.'],
          ['Foundation and skirt walls', 'Exposed foundation faced so the house sits on stone instead of on bare block.'],
        ],
      },
      {
        h: 'Why veneer fails, and how it is avoided',
        p: [
          'When stone veneer comes off a wall, the stone is almost never the problem. Water gets behind the face of any veneer installation — that is expected, and it is designed for. What decides the outcome is whether it has a way back out.',
          'A correct installation has a weather-resistive barrier, metal lath, a properly keyed scratch coat, and drainage at the base with flashing where the veneer meets other materials. Leave out the drainage plane and water sits behind the stone, saturates the substrate, and freeze-thaw does the rest. Everything in that list is invisible in the finished job, which is exactly why it is the part that gets cut when a price looks too good.',
        ],
      },
    ],
  },
  {
    slug: 'outdoor-fireplaces',
    warranty: ['masonry'],
    reviewFrom: 'Gemma V.',
    process: [
      ['Siting for wind and smoke', 'Where the fireplace goes is decided before what it looks like. We look at prevailing wind, how close the house and any overhang sit, and where people will actually be sitting — a fireplace that pushes smoke into the seating area is a mistake you notice every single evening.'],
      ['Design and scale', 'The structure is scaled to the patio and to the house rather than to a catalog. Oversized outdoor fireplaces dominate a small yard; undersized ones look like an afterthought.'],
      ['Footing', 'A fireplace is a heavy masonry structure and needs a footing built for it. Setting one on an existing patio surface without a proper footing is how they crack and lean.'],
      ['Firebox and flue', 'The firebox and flue are built to draw properly. Draw is a function of firebox dimensions and flue height in relation to each other, not something you can adjust afterward.'],
      ['Veneer, hearth, and finish', 'The visible masonry goes on, with the hearth and mantel detailed to match the surrounding hardscape.'],
      ['Built-ins and first burn', 'Seating walls, wood storage, and lighting are finished, and we walk you through curing and the first fires before you use it properly.'],
    ],
    faq: [
      { q: 'Wood-burning or gas?',
        a: ['Wood gives you the fire people picture — the sound, the smell, the heat — at the cost of storage, laying it, and cleaning it out. Gas lights instantly, produces no smoke to blow at your guests, and takes no work, but it is a different experience and needs a gas line run to the location. The question worth answering honestly is how you will use it on an ordinary Tuesday, not how you imagine using it.'] },
      { q: 'How close can it be to the house or a deck?',
        a: ['Clearances to combustible structures are set by code and vary by jurisdiction, and a wood-burning structure has different requirements than a gas one. We confirm the requirement with your county before siting rather than working from a general rule, and it is one of the reasons placement gets decided early.'] },
      { q: 'Does it need a permit?',
        a: ['Often yes, particularly for a full masonry fireplace with a flue, and gas connections carry their own requirements. We tell you what your jurisdiction requires as part of the estimate so it is not a surprise partway through.'] },
      { q: 'Does it need its own footing?',
        a: ['Yes. A masonry fireplace weighs a great deal and concentrates that weight in a small footprint, so it needs a footing sized and dug for it — not the patio base. Building one on top of an existing patio without a footing underneath is a common shortcut, and it shows up as cracking through the structure and the patio around it within a few years.'] },
      { q: 'Can we use it through the winter?',
        a: ['That is largely the point of building one here. What extends the season more than anything is placement — sheltering the seating area from wind does more for comfort than the size of the fire does. It is worth thinking about at the design stage, when it is free to change.'] },
    ],
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
      {
        h: 'Fire features we build',
        p: [
          'A full masonry fireplace is not the right answer for every yard. What suits the space depends on how much room you have, how you will use it, and how much of the budget belongs above ground:',
        ],
        list: [
          ['Full masonry fireplaces', 'A built firebox, flue, hearth, and chimney — the largest and most permanent option, and the one that provides directional heat and shelter.'],
          ['Fire pits', 'Open, seen from all sides, and social in a way a fireplace is not. Far less structure and far less cost, at the price of no wind shelter.'],
          ['Built-in grills and outdoor kitchens', 'Masonry surrounds with counter space, storage, and utilities run in, built alongside the fire feature or on their own.'],
          ['Seating walls', 'Low walls that give the space its edge and seat people without furniture. Often the detail that makes an outdoor room feel like a room.'],
          ['Pizza ovens', 'Straightforward to incorporate when planned from the start, considerably harder to add afterward.'],
          ['Wood storage and lighting', 'Built-in storage that keeps wood dry and to hand, and low-level lighting so the space works once the fire dies down.'],
        ],
      },
      {
        h: 'Materials that take the heat',
        p: [
          'The inside of a firebox and the outside of a fireplace face completely different problems, and they are not built from the same things. The firebox needs firebrick set in refractory mortar — ordinary brick and standard mortar break down under sustained heat, and the failure shows up as cracking and spalling inside the box within a season or two of real use.',
          'The exterior faces weather rather than fire, so the choice there is about how the stone or brick sits against the house and how it handles freeze-thaw. Caps, hearths, and any horizontal surface get the most attention, because those are where water collects and where a poorly chosen material shows it first.',
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
  'Alexandria, VA', 'McLean, VA', 'Tysons, VA', 'Reston, VA',
  'Burke, VA', 'Fairfax Station, VA', 'Springfield, VA',
  'Annandale, VA', 'Clifton, VA', 'Washington, DC',
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

/* --- Projects ------------------------------------------------------------
   Real completed jobs, each tied to the service it belongs under and the
   city it was built in. Project pages are generated at
   {service.href}{slug}/ — e.g. /masonry/driveway-paving/paver-driveway-
   arlington-va/ — so a project always sits beneath its own service.

   Every entry here must be an actual job. Titles and copy are written from
   the photograph, which is why several differ from the labels the old site
   carried: four of those labels described the wrong material entirely.

   To add a job: drop {slug}-1200.jpg and {slug}-760.jpg into
   assets/img/projects/, add an entry below, run `node build.mjs`. The page,
   its schema, the sitemap entry, and the links from both the service page
   and the city page are all generated from this one record.
   ------------------------------------------------------------------------ */
export const PROJECTS = [
  {
    slug: 'paver-driveway-medallion-arlington-va',
    title: 'Paver Driveway with Circular Medallion',
    city: 'Arlington, VA',
    service: '/masonry/driveway-paving/',
    material: 'Interlocking pavers',
    w: 1200, h: 900,
    alt: 'Tan paver driveway with a circular medallion inlay in front of a stone-faced Arlington home with two garage doors',
    summary: 'A full paver driveway in tumbled tan and grey units, laid to a running bond with a darker circular medallion set on the approach to the garages.',
    body: [
      'The field is laid in a running bond that keeps the eye moving toward the house, with a soldier course running the full perimeter to lock the edges. The circular medallion is the piece that does the work here — set on axis with the two garage bays, it breaks up what would otherwise read as a large uninterrupted expanse of paving and gives the approach a centre.',
      'Pavers earn their keep on a driveway of this size. Individual units lift out and go back without a patch mark, so a future utility trench or a settled area is a repair rather than a scar. The stone facade on the house set the colour direction: the paving picks up its warm tans without matching it exactly, which would have flattened both.',
    ],
  },
  {
    slug: 'stamped-concrete-driveway-annandale-va',
    title: 'Stamped Concrete Driveway',
    city: 'Annandale, VA',
    service: '/masonry/driveway-paving/',
    material: 'Stamped concrete',
    w: 1200, h: 874,
    alt: 'Stamped concrete driveway in a large-format ashlar slate pattern running to the garage of a white Annandale colonial',
    summary: 'A single-width drive replaced in stamped concrete, textured in a large-format ashlar pattern and run the full length from street to garage.',
    body: [
      'A narrow lot leaves no room for a driveway that reads as a slab, so this one is stamped in a large-format ashlar pattern that gives the surface scale and grip without the maintenance of a jointed material. The tone was kept close to the grey of the roof and shutters rather than competing with the white brick.',
      'Stamped concrete suits a drive like this one: a single continuous pour with no joints for weeds to find, textured enough to keep its footing in a wet Northern Virginia winter. The run is graded to carry water off the surface and away from the house rather than toward the foundation.',
    ],
  },
  {
    slug: 'concrete-driveway-paver-border-springfield-va',
    title: 'Concrete Driveway with Paver Border',
    city: 'Springfield, VA',
    service: '/masonry/driveway-paving/',
    material: 'Concrete with paver edging',
    w: 1200, h: 900,
    alt: 'Broom-finished concrete driveway edged with a grey paver soldier course, curving to the garage of a brick Springfield home in winter',
    summary: 'A broom-finished concrete drive with a grey paver soldier course run down both edges, curving from the street to a two-car garage.',
    body: [
      'The curve is the reason for the border. A concrete drive that sweeps rather than runs straight needs its edge defined, or the eye reads the sweep as a mistake — the paver soldier course does that, and it also gives the slab a clean termination against the lawn instead of a raw edge that grass creeps over.',
      'Poured in winter, which is a matter of watching the forecast rather than avoiding the season. Concrete needs its cure protected from freezing, so the pour was scheduled into a clear window and the surface kept covered. The broom finish across the driving surface is what gives it traction once the weather turns.',
    ],
  },
  {
    slug: 'asphalt-driveway-springfield-va',
    title: 'Asphalt Driveway Replacement',
    city: 'Springfield, VA',
    service: '/masonry/driveway-paving/',
    material: 'Asphalt',
    w: 1200, h: 722,
    alt: 'Onyx crew compacting a freshly laid asphalt driveway with a ride-on roller at a Springfield home',
    summary: 'A full-width asphalt replacement, photographed mid-compaction with the roller working the fresh mat.',
    body: [
      'This is what the middle of an asphalt job looks like. The mat has been laid and the ride-on roller is compacting it while the material is still hot — compaction is the step that decides how long the surface lasts, and it has a window measured in minutes, not hours. Get it right and the driveway sheds water for two decades; rush it and the surface ravels at the edges within a few winters.',
      'The old surface was torn out and the base regraded before any new material went down. That is the part no one photographs and the part that actually matters: asphalt laid over a failing base fails in exactly the same places the old one did, on roughly the same schedule.',
    ],
  },
  {
    slug: 'asphalt-driveway-paver-border-mclean-va',
    title: 'Asphalt Driveway with Paver Border',
    city: 'McLean, VA',
    service: '/masonry/driveway-paving/',
    material: 'Asphalt with paver edging',
    w: 1200, h: 934,
    alt: 'Freshly laid asphalt driveway edged with a tan paver border, running past clipped shrubs at a McLean home',
    summary: 'A long asphalt drive finished with a tan paver soldier course along its edge, separating the paving from the planting beds.',
    body: [
      'Asphalt on its own gives you a clean surface and a soft edge. The paver border is what turns it into a finished piece of hardscape — it holds the asphalt edge from crumbling under a tyre that strays, and it draws a deliberate line between the drive and the beds instead of letting mulch and blacktop meet in a ragged seam.',
      'On a run this long the border also does something for the eye: it follows the curve and makes the length feel intentional. The alternative, an unedged strip of asphalt disappearing between the shrubs, reads as utility rather than as part of the property.',
    ],
  },
  {
    slug: 'circular-fire-pit-patio-vienna-va',
    title: 'Circular Fire Pit Patio with Seating Wall',
    city: 'Vienna, VA',
    service: '/stone-work/patio-design/',
    material: 'Stone patio with block seating wall',
    w: 1200, h: 900,
    alt: 'Circular stone patio with a low seating wall and a central fire pit ringed by Adirondack chairs in a landscaped Vienna backyard',
    summary: 'A free-standing circular patio built around a fire pit, ringed by a low seating wall and set into an established lawn.',
    body: [
      'The circle is set away from the house rather than attached to it, which is the right call on a property that already had a pool terrace doing the job of an entertaining space. This is the other kind of outdoor room — the one you use in October, facing inward at the fire rather than outward at the yard.',
      'The low wall around the perimeter is structural and social at once: it retains the raised pad against the surrounding grade and it seats another half-dozen people when the four chairs are taken. Sized so that a person on the wall and a person in a chair are at roughly the same height, which is the detail that decides whether a fire pit space actually gets used.',
    ],
  },
  {
    slug: 'brick-herringbone-walkway-arlington-va',
    title: 'Brick Herringbone Walkway',
    city: 'Arlington, VA',
    service: '/masonry/brickwork/',
    material: 'Clay brick pavers',
    w: 1200, h: 900,
    alt: 'Onyx mason setting red clay brick pavers in a herringbone pattern with a mallet during installation in Arlington',
    summary: 'Red clay brick set in a herringbone bond, photographed during installation with the field being closed unit by unit.',
    body: [
      'Herringbone is the strongest bond you can lay in a brick field, which is why it is worth the extra labour it costs. Every unit locks against its neighbours in two directions, so the surface distributes load instead of letting individual bricks work loose — the reason it has been the pattern of choice for paved surfaces since long before anyone was laying them by machine.',
      'Set by hand, one at a time, with a mallet and a string line. The cuts at the perimeter are what the work is judged on: a herringbone field meeting its border cleanly means every edge unit was measured and cut to fit, and there is no way to hurry that part.',
    ],
  },
  {
    slug: 'block-retaining-wall-steps-vienna-va',
    title: 'Segmental Block Retaining Wall with Steps',
    city: 'Vienna, VA',
    service: '/masonry/retaining-walls/',
    material: 'Segmental block',
    w: 1200, h: 900,
    alt: 'Curved cream segmental block retaining wall with integrated steps and a paver landing at the front entrance of a Vienna home',
    summary: 'A curved segmental block wall terracing a sloped front yard, with steps and a paver landing built into the run.',
    body: [
      'A front yard that falls away from the house gives you two bad options and one good one: live with an awkward slope, cut a raw bank into it, or terrace it properly. This is the third. The wall holds the grade back in a curve that follows the natural line of the approach, and the steps are built into the wall rather than bolted on beside it.',
      'Segmental block suits a wall like this because it flexes. Each course sets back slightly into the slope, so the wall leans into the load it is holding instead of standing straight up against it, and the curve is achieved by the geometry of the units rather than by cutting. The capping course finishes the top and, on the lower run, doubles as somewhere to sit.',
    ],
  },
  {
    slug: 'paver-walkway-soldier-border-fairfax-va',
    title: 'Paver Walkway with Soldier Border',
    city: 'Fairfax, VA',
    service: '/stone-work/patio-design/',
    material: 'Interlocking pavers',
    w: 1200, h: 554,
    alt: 'Wide paver walkway with a contrasting soldier-course border running from the public sidewalk toward a Fairfax home',
    summary: 'A wide paver walk running from the public sidewalk to the house, bordered on both sides with a contrasting soldier course.',
    body: [
      'Wider than a standard front walk, and deliberately so — two people should be able to walk up to a front door side by side. The field is laid in a running bond with the contrasting border framing it the whole way, which keeps a long straight run from reading as a corridor.',
      'The walk meets the public sidewalk flush, with the transition set level so there is nothing to catch a toe or a wheel. Everything is pitched to shed water into the lawn on either side rather than letting it run the length of the walk and pool at the low end.',
    ],
  },
];

/* --- FAQ ----------------------------------------------------------------- */
export const FAQ = [
  {
    q: 'Do you charge for estimates?',
    a: ['No. Estimates are free across our entire service area. We come out, look at the site, talk through what you are trying to accomplish, and give you a written price with no obligation.'],
  },
  {
    q: 'How long has Onyx been in business?',
    a: ['We have been serving homeowners across Northern Virginia since 2010. Onyx is family-operated — you deal with the owners directly, not a salesperson, and the same people who quote the job are on site while it is being built.'],
  },
  {
    q: 'What areas do you serve?',
    a: ['Fairfax, Vienna, Falls Church, Arlington, Alexandria, McLean, Tysons, Reston, Burke, Fairfax Station, Springfield, Annandale, and Clifton in Virginia, plus Washington, DC. If you are just outside that list, call and ask — we often can.'],
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

/* --- Workmanship warranty -------------------------------------------------
   These terms are advertised on the warranty page and on each service page.
   They are contractual promises: change them here only to match what the
   written contract actually says, never to match what reads well.
   ------------------------------------------------------------------------ */
export const WARRANTY = {
  headline: 'Our Workmanship Warranty',
  lede: 'Every installation we complete is covered by a written workmanship warranty. The length depends on what was built, and the term is stated in your contract before you sign it.',
  terms: [
    { key: 'asphalt',  years: 3, label: 'Asphalt driveways and paving' },
    { key: 'concrete', years: 5, label: 'Concrete driveways, patios, and walkways' },
    { key: 'pavers',   years: 5, label: 'Paver patios, driveways, and walkways' },
    { key: 'masonry',  years: 5, label: 'Masonry, brick, and stonework' },
    { key: 'walls',    years: 5, label: 'Retaining walls' },
    { key: 'drainage', years: 3, label: 'Drainage and French drain installations' },
  ],
};

/* --- Homepage "why us" points -------------------------------------------- */
export const POINTS = [
  ['Family-operated since 2010', 'You deal with the owners directly. The people who quote your job are on site while it is being built.'],
  ['Base prep done properly', 'Excavation, compacted aggregate, and drainage before anything decorative goes down. It is the step that decides whether the work lasts.'],
  ['Clean sites, kept schedules', 'Our crews show up when they say they will and leave the site clean at the end of every day — the thing customers mention most.'],
  ['Free written estimates', 'Itemized, no obligation, and honest about what can wait. We would rather keep a customer than sell a job.'],
];

/* --- Retired URLs --------------------------------------------------------
   Landing pages from the old WordPress site that live Google Ads campaigns
   still point at. The rebuild dropped them, so every one of these was
   returning a 404 — which is what stopped the campaigns. Each maps to the
   closest equivalent page on the current site.

   Keep this list even after the ads' final URLs are updated: these URLs are
   also in whatever inbound links and citations the old pages accumulated. */
export const REDIRECTS = [
  // Ad landing pages from the old WordPress site.
  ['/driveway-landing-page/',            '/masonry/driveway-paving/'],
  ['/patio-design-installation-nova/',   '/stone-work/patio-design/'],
  ['/hardscape/',                        '/services/'],
  ['/retaining-walls-landing/',          '/masonry/retaining-walls/'],

  // Service areas Onyx no longer covers. Their pages were indexed, so they
  // point at the current list rather than going dark. Delete these four
  // entries if you would rather they 404 outright.
  ['/service-areas/herndon-va/',         '/service-areas/'],
  ['/service-areas/manassas-va/',        '/service-areas/'],
  ['/service-areas/manassas-park-va/',   '/service-areas/'],
  ['/service-areas/fredericksburg-va/',  '/service-areas/'],
];
