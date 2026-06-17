// visualizer/products.js
// Comprehensive product catalog for the Kitchen Design Visualizer.
// Each entry: id, label, desc, prompt. Optional: swatch (hex), imageUrl.
//
// Sources: Kitchen Tune Up door catalog, Granex Industries quartz,
//          Mohawk RevWood/SolidTech flooring, Sherwin-Williams ColorSnap,
//          MSI Surfaces backsplash tile.

const _KTU = 'https://www.kitchentuneup.com/siteassets/national-site/door-catalog'
const _GRANEX = 'https://granexindustries.com/wp-content/uploads/2023/11'
const _MSI = 'https://cdn.msisurfaces.com/images'

const PRODUCTS = {

  // ── CABINET STYLES ──────────────────────────────────────────────────────────

  cabinetStyle: [
    // SHAKER / MISSION
    { id: 'mission',          label: 'Mission',          desc: 'Classic shaker, simple flat center panel',          imageUrl: `${_KTU}/shaker/bw-mission_maple_-iron-th.jpg`,                                      prompt: 'Mission style shaker kitchen cabinets with flat recessed center panel and simple square frame' },
    { id: 'simple-shaker',    label: 'Simple Shaker',    desc: 'Thinner rail and stile, clean shaker look',          imageUrl: `${_KTU}/shaker/bw-simple-shaker-boulder-th.jpg`,                                   prompt: 'simple shaker kitchen cabinets with thinner rail and stile and clean flat center panel' },
    { id: 'slim-shaker',      label: 'Slim Shaker',      desc: 'Very minimal shaker, modern proportion',             imageUrl: `${_KTU}/shaker/nc-shaker-slim-haze-supermatte-th.jpg`,                              prompt: 'slim shaker kitchen cabinets with very thin frame rails and sleek modern proportion' },
    { id: 'shaker-ogee',      label: 'Shaker Ogee',      desc: 'Shaker with decorative ogee moulding detail',        imageUrl: `${_KTU}/recessed/nc-shaker-ogee-haze-supermatte-th.jpg`,                           prompt: 'shaker kitchen cabinets with wide frame and subtle ogee moulding detail on rails' },
    { id: 'shaker-bevel',     label: 'Shaker Bevel',     desc: 'Shaker with a beveled edge on center panel',         imageUrl: `${_KTU}/recessed/nc-shaker-bevel-flint-supermatte-th.jpg`,                         prompt: 'shaker kitchen cabinets with beveled edge detail around the recessed center panel' },
    { id: 'tescott',          label: 'Tescott',          desc: 'Refined shaker with slightly rounded stile edge',    imageUrl: `${_KTU}/shaker/bw-tescott_downy-th.jpg`,                                           prompt: 'Tescott style kitchen cabinets, refined shaker door with gently rounded stile and rail edges' },
    { id: 'mystique',         label: 'Mystique',         desc: 'Contemporary shaker, clean and modern',              imageUrl: `${_KTU}/shaker/el-mystique-white-th.jpg`,                                          prompt: 'Mystique contemporary kitchen cabinets with clean minimalist shaker door and straight lines' },
    { id: 'parsons',          label: 'Parsons',          desc: 'Very clean contemporary, near-flat profile',         imageUrl: `${_KTU}/shaker/el-parsons-cherry-cider-th.jpg`,                                    prompt: 'Parsons contemporary kitchen cabinets with clean near-flat door profile and minimal frame detail' },
    { id: 'seaside-square',   label: 'Seaside Square',   desc: 'Square-profiled shaker, modern coastal',             imageUrl: `${_KTU}/shaker/el-seaside-square_centauri-wolfram-th.jpg`,                         prompt: 'Seaside Square kitchen cabinets with square-profile shaker door and contemporary coastal styling' },
    // RECESSED / CLASSIC
    { id: 'classic-recessed', label: 'Classic Recessed', desc: '5-piece door with recessed center panel',            imageUrl: `${_KTU}/recessed/bw-manhattan-maple-snow-th.jpg`,                                  prompt: 'classic 5-piece kitchen cabinet doors with recessed center panel and traditional frame proportions' },
    { id: 'square-recessed',  label: 'Square Recessed',  desc: 'Square-profile recessed panel, contemporary',        imageUrl: `${_KTU}/recessed/el-marco-square-swiss-elm-dark-th.jpg`,                          prompt: 'square recessed panel kitchen cabinet doors with contemporary square stile and rail profile' },
    { id: 'portico',          label: 'Portico',          desc: 'Classic recessed with elegant arch possibility',     imageUrl: `${_KTU}/recessed/el-portico-white-chocolate-th.jpg`,                               prompt: 'Portico style kitchen cabinet doors with traditional recessed center panel and refined frame detail' },
    { id: 'addison',          label: 'Addison',          desc: 'Traditional recessed, subtle crown detail',          imageUrl: `${_KTU}/recessed/el-addison-hickory-clear-th.jpg`,                                 prompt: 'Addison style kitchen cabinet doors with traditional recessed panel and subtle decorative crown detail' },
    { id: 'caravan',          label: 'Caravan',          desc: 'Recessed panel, slightly rustic proportions',        imageUrl: `${_KTU}/recessed/el-caravan-cherry-clear-lacquer-licorice-glaze-th.jpg`,          prompt: 'Caravan style kitchen cabinet doors with recessed center panel and warm rustic wood proportions' },
    { id: 'liberty',          label: 'Liberty',          desc: 'Classic recessed, light painted finish focus',       imageUrl: `${_KTU}/recessed/el-liberty-white-maple-tell-tale-walnut-th.jpg`,                  prompt: 'Liberty style kitchen cabinet doors with classic recessed panel profile, well-suited to painted finish' },
    { id: 'ponderosa',        label: 'Ponderosa',        desc: 'Rustic alder recessed panel character',              imageUrl: `${_KTU}/recessed/el-ponderosa-alder-triple-walnut-th.jpg`,                         prompt: 'Ponderosa style kitchen cabinet doors with recessed panel and natural knotty alder wood character' },
    { id: 'riverbed',         label: 'Riverbed',         desc: 'Knotty recessed panel, natural grain character',     imageUrl: `${_KTU}/recessed/el-riverbed-knotty-alder-clear-mocha-glaze-th.jpg`,              prompt: 'Riverbed style knotty alder kitchen cabinet doors with recessed panel and natural knot character' },
    // RAISED PANEL
    { id: 'raised-panel',     label: 'Raised Panel',     desc: 'Traditional raised center panel, ornate',            imageUrl: `${_KTU}/raised/imperial_sandstone-t.jpg`,                                          prompt: 'traditional raised panel kitchen cabinet doors with ornate raised center panel and classic frame' },
    { id: 'easton',           label: 'Easton',           desc: 'Cherry raised panel, traditional elegance',          imageUrl: `${_KTU}/raised/easton-cherry-bourbon-t.jpg`,                                       prompt: 'Easton style raised panel kitchen cabinet doors with traditional carved raised center panel' },
    { id: 'benton-square',    label: 'Benton Square',    desc: 'Square raised panel, transitional style',            imageUrl: `${_KTU}/raised/benton_brw-maple-shale-t.jpg`,                                      prompt: 'Benton Square raised panel kitchen cabinet doors with square-profile raised center panel, transitional' },
    { id: 'classic-amati',    label: 'Classic Amati',    desc: 'Full raised panel, walnut-proportion elegance',      imageUrl: `${_KTU}/raised/classic-amati-walnut-th.jpg`,                                       prompt: 'Classic Amati raised panel kitchen cabinet doors with full traditional raised center panel and walnut proportions' },
    { id: 'naples',           label: 'Naples',           desc: 'Clean raised panel, subtle traditional detail',      imageUrl: `${_KTU}/raised/naples-walnut-clear-th.jpg`,                                        prompt: 'Naples style kitchen cabinet doors with clean raised panel and subtle traditional moulding detail' },
    { id: 'richmond-rustic',  label: 'Richmond Rustic',  desc: 'Rustic raised panel, distressed character',          imageUrl: `${_KTU}/raised/richmond-rustic-cherry-tell-tale-walnut-th.jpg`,                   prompt: 'Richmond Rustic raised panel kitchen cabinet doors with rustic wood character and raised center panel' },
    { id: 'wellington',       label: 'Wellington',       desc: 'Classic raised panel suited to bold painted colors', imageUrl: `${_KTU}/raised/wellington-navy-super-matte-th.jpg`,                                prompt: 'Wellington style raised panel kitchen cabinet doors with classic profile, excellent for bold painted finishes' },
    // CONTEMPORARY / RTF
    { id: 'flat-slab',        label: 'Flat / Slab',      desc: 'Modern frameless, no panel detail',                  imageUrl: `${_KTU}/recessed/_qk-graphite-recessed-th-131-x-200-px.jpg`,                      prompt: 'modern flat slab frameless kitchen cabinet doors with no panel detail, clean minimalist European style' },
    { id: 'rtf-flat',         label: 'RTF Flat',         desc: 'Thermofoil wrapped flat door, ultra-smooth',         imageUrl: `${_KTU}/raised/rtf-rockport-white-th.jpg`,                                         prompt: 'RTF thermofoil wrapped flat kitchen cabinet doors with ultra-smooth finish and seamless wrapped edges' },
    { id: 'nc-5-piece',       label: 'NC 5-Piece',       desc: 'Contemporary 5-piece, clean modern lines',           imageUrl: `${_KTU}/recessed/nc-5-piece-tm403-gibraltar-th.jpg`,                              prompt: 'contemporary NC 5-piece kitchen cabinet doors with clean modern square lines and minimal frame profile' },
    { id: 'slide',            label: 'Slide',            desc: 'Flat with horizontal channel detail',                imageUrl: `${_KTU}/recessed/qk-slide-graphite-th.jpg`,                                        prompt: 'Slide style kitchen cabinet doors with flat surface and subtle horizontal channel groove detail' },
    // SPECIALTY
    { id: 'amesbury',         label: 'Amesbury',         desc: 'Transitional raised shaker hybrid',                  imageUrl: `${_KTU}/shaker/nc-amesburyii-forge-supermatte-th.jpg`,                             prompt: 'Amesbury style kitchen cabinet doors, transitional design blending shaker and raised panel elements' },
    { id: 'beadboard',        label: 'Beadboard',        desc: 'Cottage farmhouse, vertical groove inserts',                                                                                                      prompt: 'beadboard kitchen cabinet doors with vertical groove panel inserts, cottage farmhouse character' },
  ],

  // ── CABINET FINISHES ────────────────────────────────────────────────────────

  cabinetFinish: [
    // PAINTED — WHITES & CREAMS
    { id: 'painted-white',         label: 'Satin White',        swatch: '#F5F2EE', prompt: 'painted satin white finish — bright clean white with slight sheen' },
    { id: 'snow-white',            label: 'Snow White',         swatch: '#F8F6F2', prompt: 'painted Snow White finish — bright crisp white with cool undertone' },
    { id: 'alabaster',             label: 'Alabaster',          swatch: '#F2EDE3', prompt: 'painted Alabaster White (SW 7008) — warm soft white with cream undertone' },
    { id: 'antique-white',         label: 'Antique White',      swatch: '#EDE0C4', prompt: 'painted Antique White — warm cream with subtle aged undertone' },
    { id: 'candlelight',           label: 'Candlelight',        swatch: '#F0E6CC', prompt: 'painted Candlelight — soft warm ivory with gentle golden undertone' },
    // PAINTED — NEUTRALS & GRAYS
    { id: 'haze',                  label: 'Haze',               swatch: '#C8C2B8', prompt: 'painted Haze — warm light greige, soft neutral gray with beige undertone' },
    { id: 'silt',                  label: 'Silt',               swatch: '#B8B0A4', prompt: 'painted Silt Super Matte — warm medium gray with matte finish and taupe undertone' },
    { id: 'flint',                 label: 'Flint',              swatch: '#A8A49E', prompt: 'painted Flint Super Matte — cool-neutral medium gray with smooth matte finish' },
    { id: 'gauntlet',              label: 'Gauntlet',           swatch: '#88847E', prompt: 'painted Gauntlet Super Matte — deep warm gray with matte finish' },
    { id: 'greige',                label: 'Greige',             swatch: '#C2BAA6', prompt: 'painted Greige — balanced gray-beige neutral, warm undertone' },
    { id: 'agreeable-gray',        label: 'Agreeable Gray',     swatch: '#C4BAA8', prompt: 'painted Agreeable Gray (SW 7029) — warm light greige, popular neutral' },
    // PAINTED — BLUES & NAVIES
    { id: 'naval',                 label: 'Naval Blue',         swatch: '#344D5C', prompt: 'painted Naval Blue (SW 6244) — deep rich navy blue with slight green undertone' },
    { id: 'navy-matte',            label: 'Navy Super Matte',   swatch: '#2C3E4A', prompt: 'painted deep navy blue in Super Matte finish — rich dark navy, no sheen' },
    { id: 'iron',                  label: 'Iron',               swatch: '#4A4E52', prompt: 'painted Iron — cool dark blue-gray, almost slate, sophisticated dark finish' },
    // PAINTED — GREENS & SAGES
    { id: 'sage',                  label: 'Sage Green',         swatch: '#7A8C75', prompt: 'painted Sage Green — soft muted earthy sage green' },
    { id: 'aloe',                  label: 'Aloe',               swatch: '#8A9E82', prompt: 'painted Aloe — soft light sage green with cool earthy tone' },
    { id: 'shallow-sage',          label: 'Shallow Sage',       swatch: '#9AAE94', prompt: 'painted Shallow Sage — very light soft sage green, airy and fresh' },
    // PAINTED — DARKS
    { id: 'charcoal',              label: 'Charcoal',           swatch: '#4A4540', prompt: 'painted Charcoal — deep warm dark gray, near black' },
    { id: 'graphite',              label: 'Graphite',           swatch: '#42403E', prompt: 'painted Graphite — cool dark gray, near black, contemporary' },
    { id: 'storm',                 label: 'Storm',              swatch: '#38383A', prompt: 'painted Storm — very deep dark gray-black, modern dramatic finish' },
    { id: 'forge',                 label: 'Forge Super Matte',  swatch: '#3A3836', prompt: 'painted Forge Super Matte — very dark near-black with matte finish' },
    { id: 'gibraltar',             label: 'Gibraltar',          swatch: '#2E2C2A', prompt: 'painted Gibraltar — deepest charcoal-black matte, dramatic contemporary finish' },
    // PAINTED — WARM TONES
    { id: 'vintage-sepia',         label: 'Vintage Sepia Oak',  swatch: '#B8896A', prompt: 'Vintage Sepia Oak finish — warm rustic brown with aged sepia oak undertone' },
    // STAINED / WOOD SPECIES
    { id: 'maple-natural',         label: 'Maple Natural',      swatch: '#E8C888', prompt: 'natural maple stain — light warm honey-blonde maple wood grain finish' },
    { id: 'oak-natural',           label: 'Oak Natural',        swatch: '#D4AC70', prompt: 'natural oak stain — warm light golden-brown oak grain finish' },
    { id: 'oak-ginger',            label: 'Oak Ginger',         swatch: '#C8824A', prompt: 'Oak Ginger stain — warm orange-brown ginger-toned oak wood finish' },
    { id: 'oak-safari',            label: 'Oak Safari',         swatch: '#A8783C', prompt: 'Oak Safari stain — medium golden brown oak with safari undertone' },
    { id: 'oak-warm-gray',         label: 'Oak Warm Gray',      swatch: '#B4ADA0', prompt: 'Oak Warm Gray stain — gray-washed oak with warm undertone, light and airy' },
    { id: 'maple-caramel',         label: 'Maple Caramel',      swatch: '#C8924A', prompt: 'Maple Caramel stain — warm amber-caramel maple wood finish' },
    { id: 'maple-iron',            label: 'Maple Iron',         swatch: '#6A6258', prompt: 'Maple Iron stain — cool gray-iron stain over maple, contemporary' },
    { id: 'maple-shale',           label: 'Maple Shale',        swatch: '#9C9490', prompt: 'Maple Shale stain — warm gray shale stain over maple grain' },
    { id: 'maple-warm-gray',       label: 'Maple Warm Gray',    swatch: '#B0A898', prompt: 'Maple Warm Gray stain — warm gray-washed maple, soft and modern' },
    { id: 'cherry-natural',        label: 'Cherry Natural',     swatch: '#A05C40', prompt: 'natural cherry stain — warm reddish-brown cherry wood grain finish' },
    { id: 'cherry-cinnamon',       label: 'Cherry Cinnamon',    swatch: '#8C4A30', prompt: 'Cherry Cinnamon stain — deep warm cinnamon-red cherry wood finish' },
    { id: 'cherry-safari',         label: 'Cherry Safari',      swatch: '#7A4428', prompt: 'Cherry Safari stain — dark warm brown-red cherry with safari undertone' },
    { id: 'hickory-aged',          label: 'Aged Hickory',       swatch: '#9C7A50', prompt: 'Aged Hickory stain — warm medium brown hickory with aged character and natural knots' },
    { id: 'walnut-caramel',        label: 'Walnut Caramel',     swatch: '#8C6840', prompt: 'Walnut Caramel stain — warm caramel-brown walnut with visible straight grain' },
    { id: 'walnut-dark',           label: 'Dark Walnut',        swatch: '#5C3D2E', prompt: 'dark walnut stain — rich deep chocolate-brown walnut wood finish' },
    { id: 'walnut-shale',          label: 'Walnut Shale',       swatch: '#7A7268', prompt: 'Walnut Shale stain — gray-shale wash over walnut grain, sophisticated' },
    { id: 'walnut-warm-gray',      label: 'Walnut Warm Gray',   swatch: '#9A928A', prompt: 'Walnut Warm Gray stain — warm gray wash over walnut, contemporary' },
    { id: 'alder-downy',           label: 'Alder Downy',        swatch: '#D4C0A0', prompt: 'Alder Downy stain — very light natural alder, soft creamy wood finish' },
    { id: 'alder-knotty-natural',  label: 'Knotty Alder Clear', swatch: '#C4A47A', prompt: 'clear knotty alder finish — natural warm alder with character knots and honey tone' },
    { id: 'alder-brown-olive',     label: 'Alder Brown Olive',  swatch: '#7A7254', prompt: 'Knotty Alder Brown Olive stain — warm olive-brown stain over knotty alder' },
    { id: 'willow-natural',        label: 'Willow Natural',     swatch: '#D0B888', prompt: 'natural willow maple stain — light warm blonde willow maple wood finish' },
    { id: 'elm-dark',              label: 'Swiss Elm Dark',     swatch: '#6E5840', prompt: 'Swiss Elm Dark stain — warm deep brown over elm grain, European character' },
    { id: 'rustic-light-oak',      label: 'Rustic Light Oak',   swatch: '#C0A070', prompt: 'Rustic Light Oak finish — warm light oak with rustic grain character, natural and earthy' },
    { id: 'weathered-grey-oak',    label: 'Weathered Grey Oak', swatch: '#A0978C', prompt: 'Weathered Grey Oak finish — gray-weathered oak with natural wood character' },
    { id: 'driftwood',             label: 'Driftwood',          swatch: '#ACA090', prompt: 'Driftwood finish — sun-bleached warm gray with subtle wood grain, coastal' },
  ],

  // ── COUNTERTOPS ─────────────────────────────────────────────────────────────

  countertop: [
    // GRANEX QUARTZ
    { id: 'alberton',        label: 'Alberton',         desc: 'Granex · Soft white with light gray movement',    imageUrl: `${_GRANEX}/Alberton.jpg`,         prompt: 'Alberton quartz countertops — soft white background with gentle light gray movement and veining' },
    { id: 'alexandria',      label: 'Alexandria',       desc: 'Granex · White with dramatic veining',            imageUrl: `${_GRANEX}/Alexandria.jpeg`,      prompt: 'Alexandria quartz countertops — bright white with dramatic flowing gray veining' },
    { id: 'ancaster',        label: 'Ancaster',         desc: 'Granex · Creamy white, subtle warmth',            imageUrl: `${_GRANEX}/Ancaster.jpeg`,        prompt: 'Ancaster quartz countertops — creamy warm white with soft minimal veining' },
    { id: 'aspendale',       label: 'Aspendale',        desc: 'Granex · Light gray with white veining',          imageUrl: `${_GRANEX}/Aspendale.jpeg`,       prompt: 'Aspendale quartz countertops — light warm gray with white veining and subtle movement' },
    { id: 'atherton',        label: 'Atherton',         desc: 'Granex · Neutral gray, classic',                  imageUrl: `${_GRANEX}/Atherton.jpeg`,        prompt: 'Atherton quartz countertops — neutral medium gray with light veining, classic and versatile' },
    { id: 'aylesbury',       label: 'Aylesbury',        desc: 'Granex · Cool white, bright and clean',           imageUrl: `${_GRANEX}/Aylesbury.jpg`,        prompt: 'Aylesbury quartz countertops — cool bright white with very subtle light movement' },
    { id: 'beaconsfield',    label: 'Beaconsfield',     desc: 'Granex · White marble look, gray veining',        imageUrl: `${_GRANEX}/Beaconsfield.jpg`,     prompt: 'Beaconsfield quartz countertops — white marble look with natural flowing gray veining' },
    { id: 'beckworth',       label: 'Beckworth',        desc: 'Granex · Warm white, soft character',             imageUrl: `${_GRANEX}/Beckworth.jpeg`,       prompt: 'Beckworth quartz countertops — warm white with soft natural character and gentle movement' },
    { id: 'blackwater',      label: 'Blackwater',       desc: 'Granex · Deep black, dramatic',                   imageUrl: `${_GRANEX}/Blackwater.jpeg`,      prompt: 'Blackwater quartz countertops — deep jet black with subtle dark movement, dramatic and bold' },
    { id: 'brampton',        label: 'Brampton',         desc: 'Granex · Light gray, soft neutral',               imageUrl: `${_GRANEX}/Brampton.jpeg`,        prompt: 'Brampton quartz countertops — soft light gray with warm undertone and subtle texture' },
    { id: 'brighton',        label: 'Brighton',         desc: 'Granex · Clean white, polished',                  imageUrl: `${_GRANEX}/Brighton.jpeg`,        prompt: 'Brighton quartz countertops — clean polished white with bright uniform appearance' },
    { id: 'brockville',      label: 'Brockville',       desc: 'Granex · Medium gray, contemporary',              imageUrl: `${_GRANEX}/Brockville.jpg`,       prompt: 'Brockville quartz countertops — medium cool gray with contemporary character' },
    { id: 'burlington',      label: 'Burlington',       desc: 'Granex · Warm gray with gold movement',           imageUrl: `${_GRANEX}/Burlington.jpeg`,      prompt: 'Burlington quartz countertops — warm gray with subtle gold and cream movement' },
    { id: 'camberwell',      label: 'Camberwell',       desc: 'Granex · Soft marble look, elegant',              imageUrl: `${_GRANEX}/Camberwell.jpeg`,      prompt: 'Camberwell quartz countertops — soft elegant marble look with light gray veining on cream base' },
    { id: 'castlebar',       label: 'Castlebar',        desc: 'Granex · Warm cream, transitional',               imageUrl: `${_GRANEX}/Castlebar.jpeg`,       prompt: 'Castlebar quartz countertops — warm cream toned surface with gentle natural veining' },
    { id: 'chesley',         label: 'Chesley',          desc: 'Granex · Deep charcoal, bold',                    imageUrl: `${_GRANEX}/Chesley.jpeg`,         prompt: 'Chesley quartz countertops — deep charcoal gray with subtle dark movement, bold and modern' },
    { id: 'clifton',         label: 'Clifton',          desc: 'Granex · Light gray, clean lines',                imageUrl: `${_GRANEX}/Clifton.jpeg`,         prompt: 'Clifton quartz countertops — light clean gray with minimal veining, modern and versatile' },
    { id: 'colchester',      label: 'Colchester',       desc: 'Granex · Warm white with movement',               imageUrl: `${_GRANEX}/Colchester.jpeg`,      prompt: 'Colchester quartz countertops — warm white with natural flowing movement and cream undertone' },
    { id: 'corchester',      label: 'Corchester',       desc: 'Granex · Cool white, crisp',                      imageUrl: `${_GRANEX}/Corchester.jpeg`,      prompt: 'Corchester quartz countertops — crisp cool white with bright clean appearance' },
    // ADDITIONAL POPULAR STYLES
    { id: 'calacatta-gold',  label: 'Calacatta Gold',   desc: 'White with dramatic gold & gray veining',         imageUrl: 'https://cdn.msisurfaces.com/images/quartz-countertops/products/slab/large/calacatta-miraggio-gold-quartz.jpg',      prompt: 'Calacatta Gold quartz countertops — brilliant white with dramatic bold gold and gray veining' },
    { id: 'carrara-white',   label: 'Carrara White',    desc: 'Classic marble look, soft gray veining',          imageUrl: 'https://cdn.msisurfaces.com/images/colornames/fullslab/carrara-white-marble.jpg',                                prompt: 'Carrara white quartz countertops — pure white marble look with soft delicate gray veining' },
    { id: 'absolute-black',  label: 'Absolute Black',   desc: 'Jet black quartz, matte finish',                  imageUrl: 'https://cdn.msisurfaces.com/images/quartz-countertops/products/slab/large/sparkling-black-quartz.jpg',           prompt: 'Absolute Black quartz countertops — deep jet black uniform surface with matte finish' },
    { id: 'gray-concrete',   label: 'Concrete Gray',    desc: 'Cool industrial gray, subtle texture',            imageUrl: 'https://cdn.msisurfaces.com/images/quartz-countertops/products/slab/large/babylon-gray-concrete-quartz.jpg',     prompt: 'concrete gray quartz countertops — cool medium gray with subtle industrial texture' },
    { id: 'taj-mahal',       label: 'Taj Mahal',        desc: 'Warm cream, gold & taupe veining',                imageUrl: 'https://cdn.msisurfaces.com/images/colornames/fullslab/taj-mahal-quartzite.jpg',                                prompt: 'Taj Mahal quartzite look quartz countertops — soft warm cream with subtle gold and taupe veining' },
    { id: 'calacatta-laza',  label: 'Calacatta Laza',   desc: 'White with bold dramatic veining',                imageUrl: 'https://cdn.msisurfaces.com/images/quartz-countertops/products/slab/large/new-calacatta-laza-gold-quartz.jpg',  prompt: 'Calacatta Laza quartz countertops — white with bold dramatic sweeping gray and gold veining' },
    { id: 'butcher-block',   label: 'Butcher Block',    desc: 'Warm maple wood, natural grain',                  imageUrl: 'https://lumberliquidators.com/cdn/shop/files/10006983_sw.jpg?v=1781678640&width=1500',                            prompt: 'maple butcher block countertops — warm natural wood with visible end grain and honey tone' },
    { id: 'white-fantasy',   label: 'White Fantasy',    desc: 'White with fine gray mineral pattern',            imageUrl: 'https://cdn.msisurfaces.com/images/colornames/fullslab/fantasy-white-marble.jpg',                               prompt: 'White Fantasy quartz countertops — bright white with fine speckled gray mineral pattern' },
    { id: 'london-fog',      label: 'London Fog',       desc: 'Soft gray, smoky and sophisticated',              imageUrl: 'https://marble.com/uploads/materials/872/1280X720/quartz_5000-London-Grey-Caesarstone_THq5FQeVNUploCnb3MEp.jpg', prompt: 'London Fog quartz countertops — soft smoky gray with warm undertone and gentle movement' },
  ],

  // ── FLOORING ────────────────────────────────────────────────────────────────

  flooring: [
    // MOHAWK REVWOOD LAMINATE
    { id: 'revwood-stonecroft',    label: 'Stonecroft Oak',        desc: 'Mohawk RevWood · Warm medium brown',        prompt: 'Mohawk RevWood Stonecroft Oak laminate flooring — warm medium brown oak plank with natural grain' },
    { id: 'revwood-brookdale',     label: 'Brookdale Hickory',     desc: 'Mohawk RevWood · Rustic amber & brown',     prompt: 'Mohawk RevWood Brookdale Hickory laminate — rustic multi-tone amber and brown hickory planks' },
    { id: 'revwood-southcharm',    label: 'Southern Charm Oak',    desc: 'Mohawk RevWood · Warm honey, character',    prompt: 'Mohawk RevWood Southern Charm laminate flooring — warm honey-toned oak with natural character marks' },
    { id: 'revwood-antique-pecan', label: 'Antique Pecan',         desc: 'Mohawk RevWood · Rich warm pecan',          prompt: 'Mohawk RevWood Antique Pecan laminate flooring — rich warm pecan tones with antique grain character' },
    { id: 'revwood-saratoga',      label: 'Saratoga Oak',          desc: 'Mohawk RevWood · Light natural oak',        prompt: 'Mohawk RevWood Saratoga Oak laminate flooring — light natural oak with subtle grain, bright and airy' },
    { id: 'revwood-aged-barrel',   label: 'Aged Barrel',           desc: 'Mohawk RevWood · Deep warm rustic',         prompt: 'Mohawk RevWood Aged Barrel laminate flooring — deep warm rustic brown with aged barrel character' },
    { id: 'revwood-driftwood',     label: 'Driftwood Heritage',    desc: 'Mohawk RevWood · Gray-washed, coastal',     prompt: 'Mohawk RevWood Driftwood Heritage laminate flooring — gray-washed wood tone with coastal driftwood character' },
    { id: 'revwood-copper-ridge',  label: 'Copper Ridge',          desc: 'Mohawk RevWood · Warm copper-brown tones',  prompt: 'Mohawk RevWood Copper Ridge laminate flooring — warm copper and brown tones with natural grain' },
    { id: 'revwood-reclaimed',     label: 'Reclaimed Heritage',    desc: 'Mohawk RevWood · Weathered vintage look',   prompt: 'Mohawk RevWood Reclaimed Heritage laminate flooring — weathered vintage wood look with character marks' },
    { id: 'revwood-classic-brown', label: 'Classic Brown',         desc: 'Mohawk RevWood · Versatile medium brown',   prompt: 'Mohawk RevWood Classic Brown laminate flooring — versatile medium brown wood grain, timeless' },
    { id: 'revwood-nat-heritage',  label: 'Natural Heritage',      desc: 'Mohawk RevWood · Warm light natural',       prompt: 'Mohawk RevWood Natural Heritage laminate flooring — warm light natural wood tone with gentle grain' },
    { id: 'revwood-brushed-oak',   label: 'Brushed Oak',           desc: 'Mohawk RevWood · Wire-brushed, textured',   prompt: 'Mohawk RevWood Brushed Oak laminate flooring — wire-brushed oak texture with light natural color' },
    // MOHAWK SOLIDTECH LVP
    { id: 'solidtech-toasted',     label: 'Toasted Almond LVP',   desc: 'Mohawk SolidTech · Warm honey LVP',         prompt: 'Mohawk SolidTech Toasted Almond luxury vinyl plank flooring — warm honey-toned LVP with wood look' },
    { id: 'solidtech-grey',        label: 'Steel Grey LVP',        desc: 'Mohawk SolidTech · Cool modern gray',       prompt: 'Mohawk SolidTech Steel Grey luxury vinyl plank flooring — cool gray modern LVP with subtle grain' },
    { id: 'solidtech-latte',       label: 'Latte LVP',             desc: 'Mohawk SolidTech · Warm latte neutral',     prompt: 'Mohawk SolidTech Latte luxury vinyl plank flooring — warm latte-toned LVP, light and inviting' },
    { id: 'solidtech-ashwood',     label: 'Ashwood LVP',           desc: 'Mohawk SolidTech · Light ashy blonde',      prompt: 'Mohawk SolidTech Ashwood luxury vinyl plank flooring — light ashy blonde LVP, Scandinavian inspired' },
    { id: 'solidtech-espresso',    label: 'Espresso LVP',          desc: 'Mohawk SolidTech · Deep dark brown',        prompt: 'Mohawk SolidTech Espresso luxury vinyl plank flooring — deep dark espresso brown LVP planks' },
    { id: 'solidtech-smoke',       label: 'Smoked Oak LVP',        desc: 'Mohawk SolidTech · Gray-brown smoked look', prompt: 'Mohawk SolidTech Smoked Oak luxury vinyl plank flooring — gray-brown smoked oak LVP' },
    { id: 'solidtech-antique-oak', label: 'Antique Oak LVP',       desc: 'Mohawk SolidTech · Warm vintage character', prompt: 'Mohawk SolidTech Antique Oak luxury vinyl plank flooring — warm vintage oak character LVP' },
    // HARDWOOD LOOKS
    { id: 'white-oak-natural',     label: 'White Oak Natural',     desc: 'Light natural blonde hardwood look',        prompt: 'natural white oak hardwood flooring — light natural blonde with subtle cathedral grain' },
    { id: 'white-oak-grey',        label: 'White Oak Gray',        desc: 'Gray-washed white oak, modern',             prompt: 'gray-washed white oak hardwood flooring — cool gray over natural oak grain, Scandinavian modern' },
    { id: 'medium-oak',            label: 'Medium Oak',            desc: 'Classic medium brown oak',                  prompt: 'classic medium brown oak hardwood flooring — warm golden-brown oak with straight grain' },
    { id: 'dark-walnut-floor',     label: 'Dark Walnut',           desc: 'Rich dark walnut hardwood look',            prompt: 'dark walnut hardwood flooring — rich deep chocolate brown with straight walnut grain' },
    { id: 'wide-plank-oak',        label: 'Wide Plank Oak',        desc: 'Wide format rustic oak planks',             prompt: 'wide plank oak hardwood flooring — broad 5-inch plus planks with natural rustic oak character' },
    // TILE OPTIONS
    { id: 'large-white-tile',      label: 'Large White Porcelain', desc: '24×24 white tile, minimal grout',           prompt: 'large format 24x24 white porcelain tile flooring with minimal grout lines, clean modern look' },
    { id: 'gray-tile',             label: 'Gray Stone Tile',       desc: 'Gray stone look tile, textured',            prompt: 'gray stone look porcelain tile flooring with natural texture and subtle variation' },
    { id: 'slate-tile',            label: 'Slate Tile',            desc: 'Dark natural slate look',                   prompt: 'natural slate look tile flooring — dark charcoal gray with natural stone texture and variation' },
  ],

  // ── WALL COLORS ─────────────────────────────────────────────────────────────

  wallColor: [
    // WHITES & BRIGHT
    { id: 'pure-white',         label: 'Pure White',         swatch: '#F5F2EC', prompt: 'walls painted Sherwin-Williams Pure White SW 7005 — bright crisp white, slightly warm' },
    { id: 'high-ref-white',     label: 'High Ref. White',    swatch: '#F8F8F6', prompt: 'walls painted Sherwin-Williams High Reflective White SW 7757 — brightest white, cool and clean' },
    { id: 'snowbound',          label: 'Snowbound',          swatch: '#EEE9E0', prompt: 'walls painted Sherwin-Williams Snowbound SW 7004 — soft white with very subtle warm undertone' },
    { id: 'alabaster-wall',     label: 'Alabaster',          swatch: '#F2EDE3', prompt: 'walls painted Sherwin-Williams Alabaster SW 7008 — warm soft white with cream undertone' },
    { id: 'creamy',             label: 'Creamy',             swatch: '#F0E6CC', prompt: 'walls painted Sherwin-Williams Creamy SW 7012 — warm ivory cream with yellow undertone' },
    { id: 'white-duck',         label: 'White Duck',         swatch: '#EAE0D0', prompt: 'walls painted Sherwin-Williams White Duck SW 7010 — warm off-white, soft and inviting' },
    // BEIGES & TANS
    { id: 'navajo-white',       label: 'Navajo White',       swatch: '#EDD9B4', prompt: 'walls painted Sherwin-Williams Navajo White SW 6126 — warm sandy beige, classic neutral' },
    { id: 'accessible-beige',   label: 'Accessible Beige',   swatch: '#D4C8B0', prompt: 'walls painted Sherwin-Williams Accessible Beige SW 7036 — warm sand beige neutral' },
    { id: 'balanced-beige',     label: 'Balanced Beige',     swatch: '#CCBFA6', prompt: 'walls painted Sherwin-Williams Balanced Beige SW 7037 — balanced warm beige, classic' },
    { id: 'kilim-beige',        label: 'Kilim Beige',        swatch: '#C8B490', prompt: 'walls painted Sherwin-Williams Kilim Beige SW 6106 — warm golden beige, earthy' },
    { id: 'macadamia',          label: 'Macadamia',          swatch: '#C8BB98', prompt: 'walls painted Sherwin-Williams Macadamia SW 6142 — warm creamy tan, nature-inspired' },
    // GREIGES
    { id: 'agreeable-gray-wall',label: 'Agreeable Gray',     swatch: '#C4BAA8', prompt: 'walls painted Sherwin-Williams Agreeable Gray SW 7029 — warm greige, most popular neutral' },
    { id: 'perfect-greige',     label: 'Perfect Greige',     swatch: '#C0B59E', prompt: 'walls painted Sherwin-Williams Perfect Greige SW 6073 — perfectly balanced gray-beige' },
    { id: 'balance-beige-gr',   label: 'Abalone',            swatch: '#C4B8AA', prompt: 'walls painted Sherwin-Williams Abalone SW 6050 — light greige with pink-beige undertone' },
    // GRAYS
    { id: 'repose-gray',        label: 'Repose Gray',        swatch: '#BDB8B0', prompt: 'walls painted Sherwin-Williams Repose Gray SW 7015 — cool-neutral light gray, versatile' },
    { id: 'mindful-gray',       label: 'Mindful Gray',       swatch: '#B4AFA8', prompt: 'walls painted Sherwin-Williams Mindful Gray SW 7016 — perfect medium gray, balanced' },
    { id: 'dorian-gray',        label: 'Dorian Gray',        swatch: '#A8A49C', prompt: 'walls painted Sherwin-Williams Dorian Gray SW 7017 — classic true gray, medium depth' },
    { id: 'intellectual-gray',  label: 'Intellectual Gray',  swatch: '#9C9890', prompt: 'walls painted Sherwin-Williams Intellectual Gray SW 7045 — sophisticated medium-dark gray' },
    { id: 'colonnade-gray',     label: 'Colonnade Gray',     swatch: '#B8B4AC', prompt: 'walls painted Sherwin-Williams Colonnade Gray SW 7641 — warm medium gray with elegance' },
    { id: 'magnetic-gray',      label: 'Magnetic Gray',      swatch: '#8E8C88', prompt: 'walls painted Sherwin-Williams Magnetic Gray SW 7058 — deeper gray, bold and striking' },
    { id: 'on-the-rocks',       label: 'On the Rocks',       swatch: '#C0BCB4', prompt: 'walls painted Sherwin-Williams On the Rocks SW 7671 — light cool gray, fresh and clean' },
    // BLUES
    { id: 'upward',             label: 'Upward',             swatch: '#9AB4C8', prompt: 'walls painted Sherwin-Williams Upward SW 6239 — soft calm blue-gray, Color of the Year 2026' },
    { id: 'naval-wall',         label: 'Naval',              swatch: '#344D5C', prompt: 'walls painted Sherwin-Williams Naval SW 6244 — deep rich navy blue accent wall color' },
    { id: 'distance',           label: 'Distance',           swatch: '#7496B0', prompt: 'walls painted Sherwin-Williams Distance SW 6243 — medium blue with depth, calming' },
    { id: 'sea-salt',           label: 'Sea Salt',           swatch: '#A8C4BC', prompt: 'walls painted Sherwin-Williams Sea Salt SW 6204 — soft aqua-gray-green, spa-like and calm' },
    { id: 'rainwashed',         label: 'Rainwashed',         swatch: '#A0B8B0', prompt: 'walls painted Sherwin-Williams Rainwashed SW 6211 — light blue-green, fresh coastal tone' },
    { id: 'riverway',           label: 'Riverway',           swatch: '#5C8090', prompt: 'walls painted Sherwin-Williams Riverway SW 6222 — medium teal-blue, bold and sophisticated' },
    { id: 'indigo-batik',       label: 'Indigo Batik',       swatch: '#4A5E7A', prompt: 'walls painted Sherwin-Williams Indigo Batik SW 7602 — deep blue-indigo, rich and moody' },
    { id: 'rainstorm',          label: 'Rainstorm',          swatch: '#4E6474', prompt: 'walls painted Sherwin-Williams Rainstorm SW 6230 — deep blue-gray, dramatic and strong' },
    // GREENS
    { id: 'sage-wall',          label: 'Sage',               swatch: '#7A8C75', prompt: 'walls painted Sherwin-Williams Sage SW 6453 — soft muted sage green, earthy and calm' },
    { id: 'clary-sage',         label: 'Clary Sage',         swatch: '#8A9E82', prompt: 'walls painted Sherwin-Williams Clary Sage SW 6178 — soft organic sage, nature-inspired' },
    { id: 'artichoke',          label: 'Artichoke',          swatch: '#6A7A5C', prompt: 'walls painted Sherwin-Williams Artichoke SW 6179 — deeper earthy green, bold botanical' },
    { id: 'pewter-green',       label: 'Pewter Green',       swatch: '#5E7264', prompt: 'walls painted Sherwin-Williams Pewter Green SW 6208 — deep sage-green with sophistication' },
    { id: 'privilege-green',    label: 'Privilege Green',    swatch: '#4A6A50', prompt: 'walls painted Sherwin-Williams Privilege Green SW 6193 — deep rich green, classic and bold' },
    { id: 'softened-green',     label: 'Softened Green',     swatch: '#A4B49A', prompt: 'walls painted Sherwin-Williams Softened Green SW 6168 — very light soft sage, airy botanical' },
    // WARM / EARTHY
    { id: 'cavern-clay',        label: 'Cavern Clay',        swatch: '#C87848', prompt: 'walls painted Sherwin-Williams Cavern Clay SW 7701 — warm terracotta clay, earthy and bold' },
    { id: 'jaipur',             label: 'Jaipur',             swatch: '#C4905C', prompt: 'walls painted Sherwin-Williams Jaipur SW 6111 — warm spiced amber, global-inspired' },
    { id: 'harvest-gold',       label: 'Harvest Gold',       swatch: '#C8A044', prompt: 'walls painted Sherwin-Williams Harvest Gold SW 6367 — warm golden yellow, sunny and inviting' },
    // DRAMATIC DARKS
    { id: 'tricorn-black',      label: 'Tricorn Black',      swatch: '#2E2E2E', prompt: 'walls painted Sherwin-Williams Tricorn Black SW 6258 — true bold black, dramatic accent' },
    { id: 'urbane-bronze',      label: 'Urbane Bronze',      swatch: '#594F42', prompt: 'walls painted Sherwin-Williams Urbane Bronze SW 7048 — deep warm brown-gray, Color of the Year 2021, sophisticated' },
    { id: 'black-magic',        label: 'Black Magic',        swatch: '#242420', prompt: 'walls painted Sherwin-Williams Black Magic SW 6991 — deepest black with warm undertone' },
  ],

  // ── BACKSPLASH ──────────────────────────────────────────────────────────────
  // MSI Surfaces tile collections. "keep-backsplash" is the default (no change).

  backsplash: [
    { id: 'keep-backsplash',       label: 'Keep Existing',         desc: 'Leave current backsplash as-is',              prompt: '' },
    // STELLA GLOSSY SUBWAY (2×10)
    { id: 'stella-la-perla',       label: 'Stella La Perla',       desc: 'MSI · Glossy white 2×10 subway',              imageUrl: `${_MSI}/porcelainceramic/stella-la-perla-2x10-glossy.jpg`,                          prompt: 'MSI Stella La Perla 2x10 glossy white ceramic subway tile backsplash in a horizontal stack pattern' },
    { id: 'stella-biscotti',       label: 'Stella Biscotti',       desc: 'MSI · Warm cream glossy 2×10',                imageUrl: `${_MSI}/porcelainceramic/stella-biscotti-2x10-glossy.jpg`,                          prompt: 'MSI Stella Biscotti 2x10 glossy warm cream ceramic subway tile backsplash' },
    { id: 'stella-rhino',          label: 'Stella Rhino',          desc: 'MSI · Gray glossy 2×10 subway',               imageUrl: `${_MSI}/porcelainceramic/stella-rhino-2x10-glossy.jpg`,                            prompt: 'MSI Stella Rhino 2x10 glossy gray ceramic subway tile backsplash in a horizontal stack pattern' },
    { id: 'stella-oceano',         label: 'Stella Oceano',         desc: 'MSI · Blue glossy 2×10 subway',               imageUrl: `${_MSI}/porcelainceramic/stella-oceano-2x10-glossy.jpg`,                           prompt: 'MSI Stella Oceano 2x10 glossy ocean blue ceramic subway tile backsplash' },
    { id: 'stella-blush',          label: 'Stella Blush',          desc: 'MSI · Blush pink glossy 2×10',                imageUrl: `${_MSI}/porcelainceramic/stella-blush-2x10-glossy.jpg`,                            prompt: 'MSI Stella Blush 2x10 glossy blush pink ceramic subway tile backsplash' },
    { id: 'stella-emerald',        label: 'Stella Emerald',        desc: 'MSI · Emerald green glossy 2×10',             imageUrl: `${_MSI}/porcelainceramic/stella-emerlad-2x10-glossy.jpg`,                          prompt: 'MSI Stella Emerald 2x10 glossy emerald green ceramic subway tile backsplash' },
    // VILLAGE CERAMIC SUBWAY (4×12)
    { id: 'village-tildes',        label: 'Village Tildes',        desc: 'MSI · Classic white 4×12 subway',             imageUrl: `${_MSI}/porcelainceramic/village-tildes-4x12-a.jpg`,                               prompt: 'MSI Village Tildes 4x12 classic white ceramic subway tile backsplash in horizontal stack layout' },
    { id: 'village-coral',         label: 'Village Coral',         desc: 'MSI · Warm coral 4×12 subway',                imageUrl: `${_MSI}/porcelainceramic/village-coral-4x12-a.jpg`,                                prompt: 'MSI Village Coral 4x12 warm coral ceramic subway tile backsplash' },
    // BRICKSTONE PORCELAIN BRICK (2×10)
    { id: 'brickstone-white',      label: 'Brickstone White',      desc: 'MSI · White brick porcelain 2×10',            imageUrl: `${_MSI}/porcelainceramic/brickstone-white-2x10-brickstone-porcelain.jpg`,          prompt: 'MSI Brickstone White 2x10 porcelain white brick-look backsplash tile in horizontal stack' },
    { id: 'brickstone-ivory',      label: 'Brickstone Ivory',      desc: 'MSI · Ivory brick porcelain 2×10',            imageUrl: `${_MSI}/porcelainceramic/brickstone-ivory-2x10-brickstone-porcelain.jpg`,          prompt: 'MSI Brickstone Ivory 2x10 porcelain ivory brick-look backsplash tile' },
    { id: 'brickstone-taupe',      label: 'Brickstone Taupe',      desc: 'MSI · Warm taupe brick 2×10',                 imageUrl: `${_MSI}/porcelainceramic/brickstone-taupe-2x10-brickstone-porcelain.jpg`,          prompt: 'MSI Brickstone Taupe 2x10 porcelain warm taupe brick-look backsplash tile' },
    { id: 'brickstone-charcoal',   label: 'Brickstone Charcoal',   desc: 'MSI · Dark charcoal brick 2×10',              imageUrl: `${_MSI}/porcelainceramic/capella-charcoal-brick-2x10-brickstone-porcelain.jpg`,    prompt: 'MSI Brickstone Charcoal 2x10 porcelain dark charcoal brick-look backsplash tile' },
    { id: 'brickstone-red',        label: 'Brickstone Red',        desc: 'MSI · Classic red brick 2×10',                imageUrl: `${_MSI}/porcelainceramic/brickstone-red-2x10-brickstone-porcelain.jpg`,            prompt: 'MSI Brickstone Red 2x10 porcelain red brick-look backsplash tile' },
    { id: 'brickstone-rustique',   label: 'Brickstone Rustique',   desc: 'MSI · Rustic white brick 2×18',               imageUrl: `${_MSI}/porcelainceramic/brickstone-roustique-2x18-porcelain-white.jpg`,           prompt: 'MSI Brickstone Rustique White 2x18 rustic textured white porcelain brick backsplash tile' },
    // RENZO GLOSSY PENNY ROUND (5×5)
    { id: 'renzo-dove',            label: 'Renzo Dove',            desc: 'MSI · White penny round mosaic',              imageUrl: `${_MSI}/mosaics/dove-renzo-5x5.jpg`,                                               prompt: 'MSI Renzo Dove white glossy penny round ceramic mosaic tile backsplash' },
    { id: 'renzo-sterling',        label: 'Renzo Sterling',        desc: 'MSI · Gray penny round mosaic',               imageUrl: `${_MSI}/mosaics/sterling-renzo-5x5.jpg`,                                           prompt: 'MSI Renzo Sterling gray glossy penny round ceramic mosaic tile backsplash' },
    { id: 'renzo-sky',             label: 'Renzo Sky',             desc: 'MSI · Sky blue penny round mosaic',           imageUrl: `${_MSI}/mosaics/sky-renzo-5x5.jpg`,                                                prompt: 'MSI Renzo Sky blue glossy penny round ceramic mosaic tile backsplash' },
    { id: 'renzo-denim',           label: 'Renzo Denim',           desc: 'MSI · Denim blue penny round mosaic',         imageUrl: `${_MSI}/mosaics/renzo-denim-5x5.jpg`,                                              prompt: 'MSI Renzo Denim blue glossy penny round ceramic mosaic tile backsplash' },
    { id: 'renzo-jade',            label: 'Renzo Jade',            desc: 'MSI · Jade green penny round mosaic',         imageUrl: `${_MSI}/mosaics/jade-renzo-5x5.jpg`,                                               prompt: 'MSI Renzo Jade green glossy penny round ceramic mosaic tile backsplash' },
    { id: 'renzo-storm',           label: 'Renzo Storm',           desc: 'MSI · Dark storm penny round mosaic',         imageUrl: `${_MSI}/skus/storm-renzo-5x5.jpg`,                                                 prompt: 'MSI Renzo Storm dark gray glossy penny round ceramic mosaic tile backsplash' },
  ],

}

if (typeof window !== 'undefined') window.PRODUCTS = PRODUCTS
if (typeof module !== 'undefined') module.exports = PRODUCTS
