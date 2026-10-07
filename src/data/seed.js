// Seed content for Smagizh Marketing.
//
// Everything here is only the *initial* state. Once the site has run, the
// Admin Panel owns this data (see src/context/DataContext.jsx) and every
// change made there appears on the public website without code edits.
//
// Sources:
//   - Rental categories & subcategories: "MujoRentals Master Catalog"
//     (Integrated Catalog v3.0, Part A) — 4 groups, 17 categories,
//     216 subcategories. Names are used exactly as supplied.
//   - Page copy, services, plans, FAQs: client correction reference deck.

// Bump when the seed structure changes so browsers holding older demo
// content pick up the new categories (see DataContext).
export const DATA_VERSION = 5

export const SITE = {
  name: 'Smagizh Marketing',
  shortName: 'Smagizh',
  legalName: 'Smagizh Marketing',
  tagline: 'Your Business Growth Partner',
  description:
    'Helping rental owners attract more enquiries and turn opportunities into bookings through focused digital promotion.',
  // Home page banner paragraph. Editable in Admin → Settings; the client's
  // final wording replaces this without a code change.
  heroSubtitle:
    'Smagizh Marketing helps rental businesses get discovered, generate quality leads, and connect with more customers.',
  defaultWhatsapp: '919884500063',
  phone: '+91 98845 00063',
  email: 'marketing@smagizh.com',
  address: 'Vedhachalam Nagar, Chennai 303202',
  city: 'Chennai, Tamil Nadu, India',
  hours: 'Mon – Sat: 9:30 AM – 7:00 PM',
  mapUrl: 'https://maps.google.com/?q=Vedhachalam+Nagar+Chennai',
  monthlyDiscount: 5,
  annualDiscount: 20,
  trialPoints: ['Cancel anytime for no fees', 'No charges during the trial period', 'Cancel anytime before renewal'],
  pricingNotes: [
    'Discounts apply to service fees only. Ad spend, applicable taxes and other party costs are extra.',
    'All budgets are used directly in the advertising platforms.',
    'Annual plans require 12 months of commitment and upfront payment. Renewal and cancellation terms apply as per stated policy.',
  ],
  pricingFootnote: 'Payment after structure. Savings shown against 12 months at the standard monthly fee.',
  social: {
    facebook: 'https://facebook.com/',
    instagram: 'https://instagram.com/',
    linkedin: 'https://linkedin.com/',
    youtube: 'https://youtube.com/',
  },
}

// Values the previous seed shipped with. If a browser still holds one of these
// untouched, the migration swaps in the new client-approved value.
export const LEGACY_SITE_DEFAULTS = {
  legalName: 'Smagizh Marketing Pvt. Ltd.',
  tagline: 'Digital Marketing for Rental Businesses',
  description:
    'Digital marketing promotion and lead generation for rental businesses of every kind — from bikes to construction equipment.',
  defaultWhatsapp: '919000000100',
  email: 'hello@smagizhmarketing.com',
  address: '4th Floor, Avinashi Road, Coimbatore, Tamil Nadu – 641018, India',
  city: 'Coimbatore, Tamil Nadu, India',
  mapUrl: 'https://maps.google.com/?q=Avinashi+Road+Coimbatore',
}

// ---------------------------------------------------------------------------
// Category groups (client catalog)
// ---------------------------------------------------------------------------

export const CATEGORY_GROUPS = [
  { id: 'vehicle', name: 'Vehicle Rentals', short: 'Vehicles', icon: 'car', color: 'blue' },
  { id: 'equipment', name: 'Equipment & Machinery', short: 'Equipment & Machinery', icon: 'backhoe', color: 'orange' },
  { id: 'products', name: 'Products & Specialty Rentals', short: 'Products & Specialty Rentals', icon: 'box', color: 'emerald' },
  { id: 'property', name: 'Property', short: 'Property', icon: 'home', color: 'rose' },
]

export const TEAMS = ['Default', 'Team 1', 'Team 2', 'Team 3', 'Team 4']

const SUB_COLORS = ['violet', 'blue', 'emerald', 'red', 'orange', 'cyan', 'pink', 'indigo', 'rose', 'green']

const CHANNELS = ['Google Search Ads', 'Meta Ads', 'Google Business Profile', 'Local SEO', 'WhatsApp Follow-up']

const BENEFITS = ['Local audience research', 'Relevant keywords and creatives', 'Seasonal offers and location-focused promotion']

const ROLE = ['Keep prices and availability current', 'Reply to enquiries promptly', 'Record confirmed bookings']

const OUTCOMES = ['Qualified enquiries', 'Confirmed bookings and revenue', 'Cost per enquiry and booking']

/**
 * Build a category record. `subs` rows are
 * [subcategory name (exact, from catalog), sample listing (from catalog), icon key].
 */
function category(o) {
  const subcategories = o.subs.map(([name, sample, icon], i) => ({
    id: `${o.id}-${i + 1}`,
    name,
    sample,
    icon,
    color: SUB_COLORS[i % SUB_COLORS.length],
    active: true,
  }))
  const noun = o.noun || o.typeLabel.replace(/ types$/, '')
  // "Reach local riders" -> "riders"
  const audience = (o.highlights?.[0]?.title || 'Reach customers').replace(/^Reach (local |the right |more )?/i, '')
  const firstThree = o.subs.slice(0, 3).map((s) => s[0].toLowerCase())
  return {
    image: '',
    banner: '',
    whatsapp: '',
    team: 'Default',
    active: true,
    channels: CHANNELS,
    benefits: BENEFITS,
    role: ROLE,
    outcomes: OUTCOMES,
    headline: 'More customers. More rental bookings.',
    ...o,
    subs: undefined,
    subcategories,
    supportSub: o.supportSub || `Reach the right ${audience} and make every enquiry easier to manage.`,
    builtFor:
      o.builtFor ||
      `We plan around your ${o.typeLabel}, service area, availability and offers, then route enquiries to your team.`,
    overview:
      o.overview ||
      `${o.intro} We plan campaigns around the ${noun} types you actually offer — from ${firstThree.join(', ')} and more — the areas you serve and the customers who need them, then route every enquiry to your team on WhatsApp so you can confirm availability and close bookings faster.`,
    features: [
      { icon: 'map-pin', color: 'violet', title: 'Get discovered', text: o.discovered || 'Local search and location-focused campaigns.' },
      { icon: 'users', color: 'pink', title: 'Attract enquiries', text: o.attract },
      { icon: 'whatsapp', color: 'green', title: 'Follow up faster', text: 'WhatsApp enquiries and organised lead follow-up.' },
      { icon: 'chart', color: 'blue', title: 'Track what converts', text: o.track || 'Measure enquiries, bookings and campaign spend.' },
    ],
  }
}

export const CATEGORIES = [
  // ------------------------------------------------------------ Vehicle Rentals
  category({
    id: 'bike-rental', slug: 'bike-rental', name: 'Bike Rental', group: 'vehicle', order: 1,
    icon: 'motorbike', color: 'violet', team: 'Team 1',
    short: 'Grow your bike rental business with targeted local campaigns.',
    headline: 'More customers. More bike bookings.',
    intro: 'Promote your rental fleet, reach local riders and turn enquiries into bookings with Smagizh Marketing.',
    highlights: [
      { title: 'Reach local riders', text: 'Targeted campaigns for your city.' },
      { title: 'Get more enquiries', text: 'Turn interest into bookings.' },
      { title: 'Grow your rental business', text: 'More visibility. More customers.' },
    ],
    typeLabel: 'bike types', noun: 'bike', inventoryLabel: 'Fleet size', inventoryPlaceholder: 'e.g. 10 bikes',
    attract: 'Promote bike types, rental plans and offers.',
    subs: [
      ['Scooters / Gearless Scooters', 'Honda Activa 6G – Self-Drive Scooter', 'scooter'],
      ['Commuter Bikes', 'Hero Splendor+ Daily Commuter', 'motorbike'],
      ['Cruiser Bikes', 'Royal Enfield Classic 350', 'moped'],
      ['Sports Bikes', 'Yamaha R15 V4 Track-Ready', 'helmet'],
      ['Touring / Adventure Bikes', 'Royal Enfield Himalayan 450', 'map-pinned'],
      ['Electric Scooters', 'Ather 450X Electric Scooter', 'scooter-electric'],
      ['Electric Motorcycles', 'Revolt RV400 Electric Motorcycle', 'battery'],
      ['Premium Bikes', 'Harley-Davidson Sportster Iron 883', 'star'],
      ['Superbikes', 'Kawasaki Ninja ZX-6R', 'gauge'],
      ['Vintage / Classic Bikes', 'Vintage Royal Enfield Bullet 350 (1990s restored)', 'history'],
    ],
  }),
  category({
    id: 'car-rental', slug: 'car-rental', name: 'Car Rental', group: 'vehicle', order: 2,
    icon: 'car', color: 'blue', team: 'Team 2',
    short: 'Reach more customers for your car rental business.',
    intro: 'Promote your car rental fleet, reach travellers, families and corporate customers, and turn enquiries into bookings with Smagizh Marketing.',
    highlights: [
      { title: 'Reach more travellers', text: 'Targeted campaigns for your city.' },
      { title: 'Get more enquiries', text: 'Turn interest into bookings.' },
      { title: 'Grow your rental business', text: 'More visibility. More customers.' },
    ],
    typeLabel: 'car types', noun: 'car', inventoryLabel: 'Fleet size', inventoryPlaceholder: 'e.g. 10 cars',
    attract: 'Promote your fleet, rental plans and offers.',
    subs: [
      ['Hatchback', 'Maruti Suzuki Swift – Self Drive', 'car'],
      ['Sedan', 'Honda City – Chauffeur Optional', 'car-front'],
      ['SUV', 'Hyundai Creta – Weekend SUV', 'car-suv'],
      ['MUV / MPV', 'Toyota Innova Crysta – Family MPV', 'car-4wd'],
      ['7-Seater Cars', 'Mahindra XUV700 7-Seater', 'users'],
      ['Luxury Cars', 'Mercedes-Benz E-Class – Executive Sedan', 'crown'],
      ['Electric Cars', 'Tata Nexon EV – Self Drive', 'charging-pile'],
      ['Premium Sedan', 'Skoda Superb – Business Sedan', 'diamond'],
      ['Premium SUV', 'Toyota Fortuner – Premium SUV', 'car-off-road'],
      ['Convertible / Sports Cars', 'Ford Mustang GT Convertible', 'steering-wheel'],
    ],
  }),
  category({
    id: 'lmv-rental', slug: 'lmv-rental', name: 'LMV Rental', group: 'vehicle', order: 3,
    icon: 'truck', color: 'teal', team: 'Team 2', whatsapp: '919884500062',
    short: 'Connect your fleet with local transport demand.',
    intro: 'Promote your commercial vehicle rental fleet, reach local businesses and delivery operators, and turn enquiries into bookings with Smagizh Marketing.',
    highlights: [
      { title: 'Reach local businesses', text: 'Targeted campaigns for your city.' },
      { title: 'Get more enquiries', text: 'Turn interest into rental bookings.' },
      { title: 'Grow your rental business', text: 'More visibility. More customers.' },
    ],
    typeLabel: 'vehicle types', noun: 'vehicle', inventoryLabel: 'Fleet size', inventoryPlaceholder: 'e.g. 10 vehicles',
    attract: 'Promote your vehicle types, rental plans and offers.',
    subs: [
      ['Mini Truck', 'Tata Ace Gold – Mini Truck', 'truck'],
      ['Pickup Truck', 'Mahindra Bolero Pik-Up', 'truck-loading'],
      ['Mini Tempo', 'Tata Intra V30 Tempo', 'truck-delivery'],
      ['Cargo Van', 'Maruti Suzuki Eeco Cargo Van', 'package'],
      ['Light Commercial Truck', 'Tata 407 Light Truck', 'truck-alt'],
      ['3-Wheeler Cargo', 'Piaggio Ape Xtra Cargo 3-Wheeler', 'trolley'],
      ['Refrigerated Mini Truck', 'Tata Ace Reefer Mini Truck', 'fridge'],
      ['Mini Water Tanker', 'Tata Intra Mini Water Tanker', 'droplets'],
      ['Passenger Van', 'Tata Winger Passenger Van', 'bus'],
      ['Small Container Truck', 'Ashok Leyland Dost Container', 'container'],
    ],
  }),
  category({
    id: 'hmv-rental', slug: 'hmv-rental', name: 'HMV Rental', group: 'vehicle', order: 4,
    icon: 'tir', color: 'red', team: 'Team 2',
    short: 'Promote your heavy vehicle rental services.',
    intro: 'Promote your HMV rental fleet, reach industrial clients and turn enquiries into bookings with Smagizh Marketing.',
    highlights: [
      { title: 'Reach industrial clients', text: 'Targeted campaigns for your region.' },
      { title: 'Get more enquiries', text: 'Turn interest into bookings.' },
      { title: 'Grow your rental business', text: 'More visibility. More customers.' },
    ],
    typeLabel: 'HMV types', noun: 'HMV', inventoryLabel: 'Fleet size', inventoryPlaceholder: 'e.g. 10 trucks',
    attract: 'Promote your HMV types, rental plans and offers.',
    subs: [
      ['Tipper / Dumper Truck', 'Tata Signa Tipper', 'truck-loading'],
      ['Heavy Cargo Truck', 'Ashok Leyland AVTR Cargo Truck', 'tir'],
      ['Container Truck', 'BharatBenz 3123R Container Truck', 'container'],
      ['Trailer / Flatbed Trailer', 'Tata Prima Tractor-Trailer', 'truck-alt'],
      ['Water Tanker', 'Ashok Leyland Water Tanker', 'droplets'],
      ['Fuel Tanker', 'Eicher Pro Fuel Tanker', 'fuel'],
      ['Refrigerated Truck', 'Tata Signa Reefer Truck', 'fridge'],
      ['Tractor Trailer', 'Volvo FM Prime Mover', 'truck'],
      ['Car Carrier', 'Ashok Leyland Car Carrier Trailer', 'car-crane'],
      ['Bulk / Specialized Carrier', 'BharatBenz Bulk Cement Carrier', 'cylinder'],
    ],
  }),

  // ------------------------------------------------------- Equipment & Machinery
  category({
    id: 'construction-equipment-rental', slug: 'construction-equipment-rental', name: 'Construction Equipment Rental',
    group: 'equipment', order: 5, icon: 'backhoe', color: 'amber', team: 'Team 3',
    short: 'Reach contractors looking for rental equipment.',
    intro: 'Promote your equipment, reach builders and construction contractors and turn enquiries into rental bookings with Smagizh Marketing.',
    highlights: [
      { title: 'Reach local builders', text: 'Targeted campaigns in your city and nearby project locations.' },
      { title: 'Get more enquiries', text: 'Turn interest into rental bookings.' },
      { title: 'Grow your rental business', text: 'More visibility. More customers.' },
    ],
    typeLabel: 'equipment types', noun: 'equipment', inventoryLabel: 'Equipment count', inventoryPlaceholder: 'e.g. 10 machines',
    attract: 'Promote your equipment to builders and contractors.',
    subs: [
      ['Excavators', 'Tata Hitachi EX 200 Excavator', 'backhoe'],
      ['Backhoe Loaders / JCB', 'JCB 3DX Backhoe Loader', 'bulldozer'],
      ['Cranes', 'ACE Hydra Mobile Crane 14T', 'crane'],
      ['Concrete Equipment', 'Schwing Stetter Self-Loading Mixer', 'brick-wall'],
      ['Compaction Equipment', 'Hamm Tandem Roller', 'cylinder'],
      ['Wheel Loaders', 'JCB 455ZX Wheel Loader', 'tractor-alt'],
      ['Skid Steer Loaders', 'Bobcat S650 Skid Steer', 'shovel'],
      ['Road Construction Equipment', 'Ammann Asphalt Paver', 'road'],
      ['Lifting & Access Equipment', 'Genie GS-2646 Scissor Lift', 'elevator'],
      ['Piling & Foundation Equipment', 'Piling Rig – Rotary Type', 'pickaxe'],
      ['Material Handling Equipment', 'Godrej Diesel Forklift 3T', 'forklift'],
      ['Demolition Equipment', 'Hydraulic Concrete Breaker Attachment', 'hammer'],
      ['Surveying Equipment', 'Total Station Survey Kit', 'compass'],
    ],
  }),
  category({
    id: 'agricultural-farming-equipment-rental', slug: 'agricultural-farming-equipment-rental',
    name: 'Agricultural & Farming Equipment Rental', group: 'equipment', order: 6, icon: 'tractor', color: 'green', team: 'Team 3',
    short: 'Connect with farmers through local campaigns.',
    intro: 'Promote your equipment, reach local farmers and agricultural service providers and turn enquiries into bookings with Smagizh Marketing.',
    highlights: [
      { title: 'Reach local farmers', text: 'Targeted campaigns for your area.' },
      { title: 'Get more enquiries', text: 'Turn interest into rental bookings.' },
      { title: 'Grow your rental business', text: 'More visibility. More customers.' },
    ],
    typeLabel: 'equipment types', noun: 'equipment', inventoryLabel: 'Equipment count', inventoryPlaceholder: 'e.g. 10 units',
    discovered: 'Show up in local searches when farmers need equipment.',
    attract: 'Promote your equipment types, rental plans and offers.',
    subs: [
      ['Tractors', 'Mahindra 575 DI Tractor', 'tractor'],
      ['Power Tillers', 'VST Shakti Power Tiller', 'tractor-alt'],
      ['Rotavators', 'Fieldking Rotavator', 'cog'],
      ['Cultivators', 'Spring-Loaded Cultivator 9-Tyne', 'pitchfork'],
      ['Harvesting Equipment', 'Combine Harvester – Paddy', 'wheat'],
      ['Seeders & Planters', 'Seed-Cum-Fertilizer Drill', 'seedling'],
      ['Sprayers', 'Boom Sprayer – Tractor Mounted', 'spray'],
      ['Threshers', 'Multi-Crop Thresher', 'grain'],
      ['Paddy Equipment', 'Paddy Transplanter', 'sprout'],
      ['Irrigation Equipment', 'Diesel Water Pump Set 5HP', 'droplet'],
      ['Land Preparation Equipment', 'Disc Harrow – Tractor Mounted', 'shovel'],
      ['Fodder / Chaff Equipment', 'Chaff Cutter – Power Operated', 'scissors'],
      ['Post-Harvest Equipment', 'Grain Cleaner-cum-Grader', 'garden-cart'],
    ],
  }),
  category({
    id: 'generator-rental', slug: 'generator-rental', name: 'Generator Rental', group: 'equipment', order: 7,
    icon: 'generator', color: 'orange', team: 'Team 3',
    short: 'Promote your power solutions to local customers.',
    intro: 'Promote your generator rental inventory, reach event organisers, businesses and project teams, and turn enquiries into bookings with Smagizh Marketing.',
    highlights: [
      { title: 'Reach local customers', text: 'Targeted campaigns for your area.' },
      { title: 'Get more enquiries', text: 'Turn interest into rental bookings.' },
      { title: 'Grow your rental business', text: 'More visibility. More customers.' },
    ],
    typeLabel: 'equipment types', noun: 'generator', inventoryLabel: 'Generator count', inventoryPlaceholder: 'e.g. 10 generators',
    attract: 'Showcase your equipment types, rental plans and offers.',
    subs: [
      ['Silent Diesel Generators', 'Kirloskar 62.5 kVA Silent DG Set', 'generator'],
      ['Industrial Diesel Generators', 'Cummins 250 kVA Industrial DG', 'factory-alt'],
      ['Portable Generators', 'Honda EU22i Portable Generator', 'plug'],
      ['Trolley-Mounted Generators', 'Mahindra Powerol 30 kVA Trolley DG', 'trolley'],
      ['Vehicle-Mounted Generators', 'Vehicle-Mounted 62.5 kVA DG Unit', 'truck'],
      ['Skid-Mounted Generators', 'Skid-Mounted 125 kVA DG Set', 'container'],
      ['Event Generators', 'Cummins 100 kVA Event Generator', 'party-popper'],
      ['Construction-Site Generators', 'CAT 320 kVA Construction DG', 'crane'],
      ['Gas Generators', 'Industrial Gas Generator 500 kVA', 'flame'],
      ['Battery Power / BESS', 'Battery Energy Storage Unit 60 kWh', 'battery'],
    ],
  }),
  category({
    id: 'tools-equipment-rental', slug: 'tools-equipment-rental', name: 'Tools Equipment Rental', group: 'equipment', order: 8,
    icon: 'tools', color: 'blue', team: 'Team 3',
    short: 'Reach professionals looking for tools on rent.',
    intro: 'Promote your equipment rental business, reach local tradespeople, contractors and businesses, and turn enquiries into bookings with Smagizh Marketing.',
    highlights: [
      { title: 'Reach local businesses', text: 'Targeted campaigns for your city.' },
      { title: 'Get more enquiries', text: 'Turn interest into rental bookings.' },
      { title: 'Grow your rental business', text: 'More visibility. More customers.' },
    ],
    typeLabel: 'equipment types', noun: 'tool', inventoryLabel: 'Tool inventory size', inventoryPlaceholder: 'e.g. 50 tools',
    attract: 'Promote your equipment types, rental rates and offers.',
    subs: [
      ['Power Tools', 'Bosch GSB 13 RE Impact Drill', 'drill'],
      ['Cutting Tools', 'Makita Angle Grinder 4-inch', 'saw'],
      ['Drilling & Demolition Tools', 'Bosch GBH 5-40 D Rotary Hammer', 'hammer-drill'],
      ['Welding & Fabrication', 'Lincoln Electric Inverter Welder 200A', 'flame'],
      ['Hand Tools', 'Stanley 65-Piece Hand Tool Kit', 'wrench'],
      ['Measuring & Survey Tools', 'Bosch Laser Distance Measurer', 'ruler'],
      ['Electrical Tools', 'Fluke Digital Multimeter Kit', 'plug'],
      ['Plumbing Tools', 'Pipe Threading Machine', 'pipeline'],
      ['Cleaning Equipment', 'Karcher High-Pressure Washer', 'vacuum-cleaner'],
      ['Garden & Landscaping Tools', 'Honda Petrol Lawn Mower', 'lawn-mower'],
      ['Material Handling Tools', 'Hydraulic Pallet Jack 2T', 'trolley'],
      ['Air / Pneumatic Tools', 'Air Compressor 25L with Impact Gun', 'wind'],
      ['Ladders & Access Equipment', 'Aluminium Extension Ladder 20ft', 'ladder'],
      ['Safety Equipment', 'Fall-Protection Safety Harness Kit', 'hard-hat'],
    ],
  }),

  // ------------------------------------------------ Products & Specialty Rentals
  category({
    id: 'security-equipment-rental', slug: 'security-equipment-rental', name: 'Security Equipment Rental', group: 'products', order: 9,
    icon: 'cctv', color: 'sky', team: 'Team 4',
    short: 'Promote your security equipment rental services.',
    intro: 'Promote your security equipment rental business, reach event organisers, offices and site managers, and turn enquiries into bookings with Smagizh Marketing.',
    highlights: [
      { title: 'Reach local clients', text: 'Targeted campaigns for your area.' },
      { title: 'Get more enquiries', text: 'Turn interest into rental bookings.' },
      { title: 'Grow your rental business', text: 'More visibility. More customers.' },
    ],
    typeLabel: 'equipment types', noun: 'security equipment', inventoryLabel: 'Equipment count', inventoryPlaceholder: 'e.g. 50 items',
    attract: 'Promote equipment types, rental plans and offers.',
    subs: [
      ['CCTV Cameras', 'Hikvision 4-Camera CCTV Kit', 'cctv'],
      ['Surveillance Systems', 'CP Plus IP Surveillance System 8-Camera', 'monitor'],
      ['Access Control Systems', 'Godrej Biometric Door Access Kit', 'lock'],
      ['Biometric Devices', 'eSSL Biometric Attendance Machine', 'fingerprint'],
      ['Walkie-Talkies', 'Motorola Walkie-Talkie Pair Set', 'radio'],
      ['Metal Detectors', 'Handheld & Walk-through Metal Detector Set', 'scan'],
      ['Security Alarms', 'Wireless Home Security Alarm Kit', 'siren'],
      ['Fire Safety Equipment', 'ABC Fire Extinguisher Set (5 units)', 'fire-extinguisher'],
      ['Security Lighting', 'Solar Security Floodlight Set', 'lightbulb'],
      ['Bollards & Barriers', 'Retractable Crowd-Control Bollards', 'barrier'],
      ['Convex / Security Mirrors', 'Convex Traffic Safety Mirror', 'eye'],
      ['Security Accessories', 'Security Guard Equipment Kit', 'shield'],
    ],
  }),
  category({
    id: 'tech-electronics-rental', slug: 'tech-electronics-rental', name: 'Tech & Electronics Rental', group: 'products', order: 10,
    icon: 'laptop', color: 'indigo', team: 'Team 4',
    short: 'Reach customers looking for technology on rent.',
    intro: 'Promote your devices, reach creators, event planners and local businesses, and turn enquiries into bookings with Smagizh Marketing.',
    highlights: [
      { title: 'Reach more customers', text: 'Targeted campaigns for your city.' },
      { title: 'Get more enquiries', text: 'Turn interest into rental bookings.' },
      { title: 'Grow your rental business', text: 'More visibility. More customers.' },
    ],
    typeLabel: 'device types', noun: 'device', inventoryLabel: 'Device inventory size', inventoryPlaceholder: 'e.g. 10 devices',
    attract: 'Promote your devices to creators, event teams and businesses.',
    subs: [
      ['Laptops', 'Dell Latitude 5420 Business Laptop', 'laptop'],
      ['Desktop Computers', 'HP ProDesk Desktop Workstation', 'desktop'],
      ['Projectors', 'Epson Full-HD Projector', 'projector'],
      ['Cameras', 'Canon EOS R6 Mirrorless Camera Kit', 'camera'],
      ['Gaming Consoles', 'Sony PlayStation 5 with 2 Controllers', 'gamepad'],
      ['Smartphones', 'Apple iPhone 15 – Short-Term Rental', 'smartphone'],
      ['Tablets', 'Apple iPad 10th Gen', 'tablet'],
      ['Monitors', 'LG 27-inch 4K Monitor', 'monitor'],
      ['Printers & Scanners', 'Canon All-in-One Printer for Events', 'printer'],
      ['Networking Equipment', 'TP-Link Event Wi-Fi Router Kit', 'router'],
      ['Audio Electronics', 'JBL Portable PA Speaker System', 'headphones'],
      ['Drones', 'DJI Mavic 3 Pro Drone', 'drone'],
      ['Wearables', 'Apple Watch Series 9 – Event Rental', 'watch'],
      ['Servers & Workstations', 'Dell PowerEdge Rack Server', 'server'],
      ['Electronics Accessories', 'Wireless Presenter & Cable Kit', 'cable'],
    ],
  }),
  category({
    id: 'home-appliances-rental', slug: 'home-appliances-rental', name: 'Home Appliances Rental', group: 'products', order: 11,
    icon: 'wash-machine', color: 'cyan', team: 'Team 4',
    short: 'Connect with households seeking rental appliances.',
    intro: 'Promote your home appliance rental business, reach local households, students and relocating professionals, and turn enquiries into bookings with Smagizh Marketing.',
    highlights: [
      { title: 'Reach local customers', text: 'Targeted campaigns for your city.' },
      { title: 'Get more enquiries', text: 'Turn interest into rental bookings.' },
      { title: 'Grow your rental business', text: 'More visibility. More customers.' },
    ],
    typeLabel: 'appliance types', noun: 'appliance', inventoryLabel: 'Appliance inventory size', inventoryPlaceholder: 'e.g. 50 appliances',
    attract: 'Promote your appliances to households, students and relocating professionals.',
    subs: [
      ['Refrigerators', 'LG 260L Double-Door Refrigerator', 'fridge'],
      ['Washing Machines', 'Samsung 7kg Front-Load Washing Machine', 'wash-machine'],
      ['Air Conditioners', 'Voltas 1.5-Ton Split AC', 'air-conditioner'],
      ['Televisions', 'Sony Bravia 55-inch 4K Smart TV', 'tv'],
      ['Water Purifiers', 'Kent RO+UV Water Purifier', 'droplet'],
      ['Air Coolers', 'Symphony Desert Air Cooler', 'fan'],
      ['Microwave Ovens', 'IFB Convection Microwave Oven', 'microwave'],
      ['Dishwashers', 'Bosch 12-Place Dishwasher', 'utensils'],
      ['Air Purifiers', 'Dyson Pure Cool Air Purifier', 'wind'],
      ['Vacuum Cleaners', 'Karcher Wet & Dry Vacuum Cleaner', 'vacuum-cleaner'],
      ['Kitchen Appliances', 'Commercial Mixer-Grinder & Blender Set', 'blender'],
      ['Dryers', 'LG 7kg Tumble Dryer', 'dryer'],
      ['Small Home Appliances', 'Induction Cooktop & Kettle Combo', 'cooking-pot'],
    ],
  }),
  category({
    id: 'fashion-rental', slug: 'fashion-rental', name: 'Fashion Rental', group: 'products', order: 12,
    icon: 'dress', color: 'pink', team: 'Team 4',
    short: 'Promote your fashion rentals for special occasions.',
    intro: 'Promote your fashion rental collections, reach wedding customers and occasion shoppers, and turn enquiries into bookings with Smagizh Marketing.',
    highlights: [
      { title: 'Reach local customers', text: 'Targeted campaigns for weddings and special occasions.' },
      { title: 'Get more enquiries', text: 'Turn interest into rental bookings.' },
      { title: 'Grow your rental business', text: 'More visibility. More customers.' },
    ],
    typeLabel: 'fashion rental types', noun: 'outfit', inventoryLabel: 'Collection size', inventoryPlaceholder: 'e.g. 50 outfits',
    discovered: 'Local search and occasion-focused campaigns.',
    attract: 'Showcase your collections to the right customers.',
    subs: [
      ['Bridal Wear', 'Designer Red Bridal Lehenga Set', 'dress'],
      ['Designer Lehenga', 'Pastel Embroidered Party Lehenga', 'dress'],
      ['Sarees', 'Kanjivaram Silk Saree', 'saree'],
      ["Men's Ethnic Wear", 'Designer Kurta-Pyjama Set', 'shirt'],
      ['Sherwani', "Groom's Sherwani with Stole", 'shirt-alt'],
      ['Suits & Tuxedos', 'Slim-Fit Formal Tuxedo Suit', 'tie'],
      ['Gowns', 'Sequinned Evening Gown', 'dress'],
      ['Party Wear', 'Indo-Western Party Outfit', 'sparkles'],
      ['Traditional / Cultural Costumes', 'Bharatanatyam Dance Costume Set', 'masks'],
      ['Kids Costumes', 'Kids Fancy-Dress Costume', 'baby'],
      ['Western Designer Wear', 'Designer Cocktail Dress', 'jacket'],
      ['Handbags & Accessories', 'Designer Clutch & Jewellery Set', 'handbag'],
      ['Footwear', 'Designer Heels / Traditional Juttis', 'shoe'],
      ['Fashion Jewellery', 'Bridal Kundan Jewellery Set', 'gem'],
    ],
  }),
  category({
    id: 'fitness-sports-rental', slug: 'fitness-sports-rental', name: 'Fitness & Sports Rental', group: 'products', order: 13,
    icon: 'barbell', color: 'emerald', team: 'Team 4',
    short: 'Reach fitness enthusiasts and sports communities.',
    intro: 'Promote your fitness and sports equipment, reach local enthusiasts and sports organisers, and turn enquiries into bookings with Smagizh Marketing.',
    highlights: [
      { title: 'Reach local enthusiasts', text: 'Targeted campaigns for your city.' },
      { title: 'Get more enquiries', text: 'Turn interest into bookings.' },
      { title: 'Grow your rental business', text: 'More visibility. More customers.' },
    ],
    typeLabel: 'equipment types', noun: 'equipment', inventoryLabel: 'Equipment count', inventoryPlaceholder: 'e.g. 10 items',
    attract: 'Promote your equipment to fitness enthusiasts, gyms and event organisers.',
    subs: [
      ['Treadmills', 'Cosco Motorized Treadmill', 'treadmill'],
      ['Exercise Bikes / Spin Bikes', 'Fitkit Spin Bike', 'bicycle'],
      ['Cross Trainers / Ellipticals', 'Cockatoo Elliptical Cross Trainer', 'stretching'],
      ['Rowing Machines', 'Concept2 Model D Rowing Machine', 'stretching-alt'],
      ['Multi-Gym Equipment', 'Home Multi-Gym Station', 'barbell'],
      ['Strength Machines', 'Leg Press & Lat Pulldown Combo Machine', 'biceps'],
      ['Free Weights', 'Dumbbell & Kettlebell Set (Full Range)', 'dumbbell'],
      ['Benches & Racks', 'Adjustable Weight Bench with Squat Rack', 'weight'],
      ['Cricket Equipment', 'Cricket Kit – Full Set', 'cricket'],
      ['Badminton Equipment', 'Badminton Racket & Net Set', 'feather'],
      ['Cycling Equipment', 'Trek Mountain Bike – Trail Ready', 'bike-sport'],
      ['Yoga & Pilates', 'Yoga Mat & Pilates Ring Set', 'yoga'],
      ['Boxing & MMA', 'Boxing Bag & Gloves Set', 'karate'],
      ['Outdoor Sports', 'Camping & Trekking Gear Set', 'tent'],
      ['Water Sports', 'Kayak with Paddle & Life Jacket', 'kayak'],
    ],
  }),
  category({
    id: 'medical-equipment-rental', slug: 'medical-equipment-rental', name: 'Medical Equipment Rental', group: 'products', order: 14,
    icon: 'first-aid', color: 'red', team: 'Team 4',
    short: 'Help customers discover your medical equipment rentals.',
    intro: 'Promote your medical equipment rental service, reach caregivers and healthcare providers, and turn enquiries into bookings with Smagizh Marketing.',
    highlights: [
      { title: 'Reach local customers', text: 'Targeted campaigns for your city.' },
      { title: 'Get more enquiries', text: 'Turn interest into rental bookings.' },
      { title: 'Grow your rental business', text: 'More visibility. More customers.' },
    ],
    typeLabel: 'medical equipment types', noun: 'medical equipment', inventoryLabel: 'Equipment count', inventoryPlaceholder: 'e.g. 50 items',
    attract: 'Reach caregivers and healthcare providers.',
    subs: [
      ['Respiratory Care', 'BPL Oxygen Concentrator 5L', 'lungs'],
      ['Hospital Beds & Cots', 'Semi-Fowler Hospital Bed', 'hospital-bed'],
      ['Mobility Aids', 'Folding Wheelchair', 'wheelchair'],
      ['Patient Monitoring', 'Multi-Parameter Patient Monitor', 'heart-monitor'],
      ['Oxygen Therapy', 'Oxygen Cylinder with Regulator', 'cylinder'],
      ['ICU / Critical Care', 'ICU Bed with Ventilator Support Setup', 'icu-monitor'],
      ['Infusion & Injection Equipment', 'Infusion Pump', 'syringe'],
      ['Physiotherapy & Rehabilitation', 'CPM Knee Rehabilitation Machine', 'massage'],
      ['Elderly Care', 'Commode Chair with Wheels', 'elderly'],
      ['Patient Transfer Equipment', 'Patient Transfer Stretcher', 'crutches'],
      ['Diagnostic Equipment', 'Digital Blood Pressure & Glucose Monitor Kit', 'stethoscope'],
      ['Surgical / Post-Surgery Equipment', 'Post-Surgery Recovery Kit', 'scissors'],
      ['Home Healthcare Essentials', 'Nebulizer & Home Care Essentials Kit', 'heart-pulse'],
    ],
  }),
  category({
    id: 'party-events-rental', slug: 'party-events-rental', name: 'Party & Events Rental', group: 'products', order: 15,
    icon: 'confetti', color: 'fuchsia', team: 'Team 4',
    short: 'Connect with customers planning their next event.',
    intro: 'Promote your event equipment rental business, reach families, businesses and event planners, and turn enquiries into bookings with Smagizh Marketing.',
    highlights: [
      { title: 'Reach local event planners', text: 'Targeted campaigns in your city.' },
      { title: 'Get more enquiries', text: 'Turn interest into rental bookings.' },
      { title: 'Grow your rental business', text: 'More visibility. More customers.' },
    ],
    typeLabel: 'event rental types', noun: 'event rental', inventoryLabel: 'Inventory / package count', inventoryPlaceholder: 'e.g. 50 items or 10 packages',
    attract: 'Reach families, businesses and event planners.',
    subs: [
      ['Sound Systems', 'JBL Professional PA Sound System', 'speaker'],
      ['Lighting Equipment', 'Par LED Stage Lighting Set (8 units)', 'lightbulb'],
      ['LED Walls / Video Walls', 'Indoor LED Video Wall – P3', 'tv'],
      ['Stage & Flooring', 'Modular Stage Platform (20x16 ft)', 'theater'],
      ['Tables & Chairs', 'Round Tables & Chiavari Chairs (Set of 100)', 'chair'],
      ['Tents / Shamiana / Structures', 'German Hangar Tent (40x60 ft)', 'tent'],
      ['DJ Equipment', 'Pioneer DJ Controller & Speaker Setup', 'disc'],
      ['Truss & Rigging', 'Aluminium Truss System (20 ft span)', 'truss'],
      ['Event Decoration', 'Floral & Balloon Décor Package', 'balloon'],
      ['Audio Visual Equipment', 'Conference AV Package (Screen + Projector + Mic)', 'presentation'],
      ['Catering Equipment', 'Commercial Buffet Chafing Dish Set', 'chef-hat'],
      ['Cooling Equipment', 'Industrial Air Cooler / Mist Fan for Events', 'fan'],
      ['Photography & Video Equipment', 'Wedding Photography & Videography Rig', 'camera'],
      ['Dance Floors', 'Portable LED Dance Floor (16x16 ft)', 'grid'],
      ['Special Effects', 'Cold Pyro & Confetti Cannon Set', 'sparkles'],
      ['Crowd Control Equipment', 'Queue Manager Stanchion Set', 'fence'],
    ],
  }),
  category({
    id: 'musical-instrument-rental', slug: 'musical-instrument-rental', name: 'Musical Instrument Rental', group: 'products', order: 16,
    icon: 'guitar', color: 'violet', team: 'Team 4',
    short: 'Reach musicians, learners and event organisers.',
    intro: 'Promote your instrument rental collection, reach local musicians, learners and event organisers, and turn enquiries into bookings with Smagizh Marketing.',
    highlights: [
      { title: 'Reach local musicians', text: 'Targeted campaigns for your city.' },
      { title: 'Get more enquiries', text: 'Turn interest into rental bookings.' },
      { title: 'Grow your rental business', text: 'More visibility. More customers.' },
    ],
    typeLabel: 'instrument types', noun: 'instrument', inventoryLabel: 'Instrument count', inventoryPlaceholder: 'e.g. 50 instruments',
    discovered: 'Appear in local searches when musicians look for instruments to rent.',
    attract: 'Promote your instrument types, rental plans and offers to interested users.',
    subs: [
      ['Guitars', 'Yamaha F310 Acoustic Guitar', 'guitar'],
      ['Keyboards & Pianos', 'Casio CT-X870 Keyboard', 'piano'],
      ['Drums & Percussion', 'Pearl Export Drum Kit', 'drum'],
      ['Violins & String Instruments', 'Student Violin 4/4 Size', 'violin'],
      ['Indian Classical Instruments', 'Concert Tabla Set', 'music-note'],
      ['Wind Instruments', 'Yamaha Alto Saxophone', 'saxophone'],
      ['Electronic Instruments', 'Roland Electronic Drum Kit', 'keyboard-music'],
      ['Studio Equipment', 'Home Recording Studio Kit', 'sliders'],
      ['Amplifiers', 'Marshall Guitar Amplifier', 'speaker-alt'],
      ['Microphones', 'Shure SM58 Vocal Microphone Pair', 'mic'],
      ['DJ & Audio Gear', 'Pioneer DJ Controller Kit', 'vinyl'],
      ['Musical Accessories', 'Guitar Stand, Tuner & Capo Set', 'guitar-pick'],
    ],
  }),

  // ------------------------------------------------------------------- Property
  category({
    id: 'property-rental', slug: 'property-rental', name: 'Property Rental', group: 'property', order: 17,
    icon: 'home', color: 'rose', team: 'Team 4',
    short: 'Promote your rental properties to the right audience.',
    headline: 'More enquiries. More occupied properties.',
    intro: 'Promote your properties, reach serious tenants and business occupiers, and turn enquiries into viewings and signed leases with Smagizh Marketing.',
    highlights: [
      { title: 'Reach the right tenants', text: 'Targeted campaigns for your city and property types.' },
      { title: 'Get more enquiries', text: 'Turn interest into viewings.' },
      { title: 'Increase occupancy', text: 'More visibility. More rental income.' },
    ],
    typeLabel: 'property types', noun: 'property', inventoryLabel: 'Property / unit count', inventoryPlaceholder: 'e.g. 5 properties or 50 units',
    attract: 'Reach tenants and business occupiers with the right offers.',
    track: 'Enquiries, viewings and signed leases.',
    outcomes: ['Qualified enquiries', 'Viewings and signed leases', 'Cost per enquiry and lease'],
    subs: [
      ['Apartments / Flats', '2BHK Semi-Furnished Flat', 'building'],
      ['Independent Houses', '3BHK Independent House with Garden', 'home'],
      ['Office Spaces', 'Furnished Office Space – 1,200 sq.ft', 'skyscraper'],
      ['Shops / Retail Spaces', 'Ground-Floor Retail Shop – Main Road', 'store'],
      ['Warehouse / Godown', '10,000 sq.ft Warehouse with Loading Dock', 'warehouse'],
      ['Villas', '4BHK Independent Villa with Pool', 'cottage'],
      ['PG / Hostel', 'Single-Sharing PG for Working Professionals', 'bed'],
      ['Co-working Space', 'Dedicated Desk – Co-working Space', 'users-group'],
      ['Showrooms', 'Ground-Floor Showroom – 2,500 sq.ft', 'store-alt'],
      ['Industrial Property', 'Industrial Shed with 3-Phase Power', 'factory'],
      ['Commercial Land', '1-Acre Commercial Land Parcel', 'land-plot'],
      ['Residential Land', '2,400 sq.ft Residential Plot', 'map-pin'],
      ['Agricultural Land', '5-Acre Agricultural Land for Lease', 'sprout'],
      ['Factory / Industrial Shed', 'Factory Shed with Office Block', 'factory-alt'],
      ['Studio Apartment', 'Fully Furnished Studio Apartment', 'community'],
      ['Guest House / Serviced Property', 'Serviced Guest House Room', 'hotel'],
    ],
  }),
]

// ---------------------------------------------------------------------------
// Digital marketing services
// ---------------------------------------------------------------------------

export const SERVICES = [
  {
    id: 'meta-ads', slug: 'meta-ads-management', name: 'Meta Ads Management', tag: 'Paid Social',
    icon: 'megaphone', color: 'violet', image: '', whatsapp: '', order: 1, active: true,
    description: 'Promote your rental inventory and offers on Facebook and Instagram.',
    points: ['Location and audience targeting', 'Ad creative and copy testing', 'Campaign optimisation', 'Performance reporting'],
    overview:
      'Meta Ads put your rental inventory, seasonal offers and availability in front of people in your service area on Facebook and Instagram. We plan audiences around your category and location, test creative and copy, and connect every ad to a WhatsApp or form enquiry so your team can respond quickly.',
    benefits: ['Reach local customers before they start searching', 'Showcase inventory, prices and offers visually', 'Clear view of spend and cost per enquiry'],
  },
  {
    id: 'google-ads', slug: 'google-ads-management', name: 'Google Ads Management', tag: 'Paid Search',
    icon: 'search', color: 'blue', image: '', whatsapp: '', order: 2, active: true,
    description: 'Reach people searching for rentals in your service area.',
    points: ['Keyword and search-term research', 'Search campaign management', 'Enquiry and conversion tracking', 'Budget reviews and reporting'],
    overview:
      'Google Ads captures customers at the moment they search for a rental near them. We research the search terms your customers use, build focused campaigns for your rental category and service area, and track enquiries so budget moves towards what converts.',
    benefits: ['Appear when customers are ready to rent', 'Control budget by location and search term', 'Enquiry and conversion tracking from day one'],
  },
  {
    id: 'gbp-setup', slug: 'google-business-profile-setup', name: 'Google Business Profile Setup', tag: 'One-time Setup',
    icon: 'map-pin', color: 'red', image: '', whatsapp: '', order: 3, active: true,
    description: 'Build an accurate business presence on Google Search and Maps.',
    points: ['Profile and verification guidance', 'Categories and service areas', 'Contact details and business hours', 'Photos and service information'],
    overview:
      'A complete Google Business Profile helps nearby customers find your rental business on Search and Maps. We guide profile creation and verification, and set up the right categories, service areas, contact details, hours, photos and service information.',
    benefits: ['Be found on Google Search and Maps', 'Accurate hours, location and contact details', 'A trusted first impression for local customers'],
  },
  {
    id: 'gbp-optimisation', slug: 'google-business-profile-optimisation', name: 'Google Business Profile Optimisation', tag: 'Ongoing Support',
    icon: 'star', color: 'amber', image: '', whatsapp: '', order: 4, active: true,
    description: 'Keep your profile complete, relevant and useful to local customers.',
    points: ['Profile accuracy checks', 'Posts and service updates', 'Review requests and replies', 'Performance insights'],
    overview:
      'Ongoing profile management keeps your listing accurate and active. We check details regularly, publish posts and service updates, guide review requests and replies, and share insights on how customers find and contact you.',
    benefits: ['Fresh, accurate information for customers', 'A steady flow of reviews and replies', 'Insight into calls, directions and visits'],
  },
  {
    id: 'seo', slug: 'search-engine-optimisation', name: 'Search Engine Optimisation', tag: 'Content & Local SEO',
    icon: 'search-chart', color: 'teal', image: '', whatsapp: '', order: 5, active: true,
    description: 'Create useful rental content for organic search visibility.',
    points: ['Keyword and content planning', 'Category and location pages', 'On-page content optimisation', 'Search performance reporting'],
    overview:
      'SEO builds long-term organic visibility for your rental categories and locations. We plan keywords and content, create and optimise category and location pages, and report on search performance. SEO results build over months and cannot be guaranteed.',
    benefits: ['Organic visibility that builds over time', 'Category and location pages customers can find', 'Less reliance on paid ads in the long run'],
  },
  {
    id: 'website-seo', slug: 'website-seo-support', name: 'Website SEO Support', tag: 'Technical SEO',
    icon: 'browser-tool', color: 'indigo', image: '', whatsapp: '', order: 6, active: true,
    description: 'Improve website accessibility for search engines and customers.',
    points: ['Crawl and indexing checks', 'Page speed and mobile usability', 'Technical audit and fixes', 'Search Console monitoring'],
    overview:
      'Technical SEO resolves website issues that affect search access and usability. We check crawling and indexing, page speed and mobile usability, run a technical audit with prioritised fixes, and monitor Search Console.',
    benefits: ['Pages search engines can crawl and index', 'Faster, mobile-friendly experience', 'Prioritised list of fixes'],
  },
  {
    id: 'local-promotion', slug: 'local-business-promotion', name: 'Local Business Promotion', tag: 'Local Reach',
    icon: 'map-pinned', color: 'rose', image: '', whatsapp: '', order: 7, active: true,
    description: 'Promote your rental services within the areas you serve.',
    points: ['Local directory consistency', 'Location-focused campaigns', 'Community partnership planning', 'Local creator collaborations'],
    overview:
      'Local promotion strengthens your presence in the areas you serve. We keep directory listings consistent, run location-focused campaigns, and plan community partnerships and local creator collaborations.',
    benefits: ['Stronger presence in your service areas', 'Consistent business details across directories', 'Local partnerships that bring referrals'],
  },
  {
    id: 'lead-generation', slug: 'lead-generation-campaigns', name: 'Lead Generation Campaigns', tag: 'Lead Capture',
    icon: 'users-group', color: 'sky', image: '', whatsapp: '', order: 8, active: true,
    description: 'Connect campaigns, enquiry forms and follow-up in one process.',
    points: ['Landing pages and enquiry forms', 'Campaign-to-enquiry tracking', 'Lead qualification workflow', 'CRM and WhatsApp integration'],
    overview:
      'Lead generation connects your campaigns, landing pages, enquiry forms and follow-up in one process. We track each enquiry back to the campaign that produced it, agree what a qualified lead is, and connect enquiries to your CRM and WhatsApp.',
    benefits: ['Every enquiry traced to its campaign', 'Agreed lead qualification criteria', 'Faster follow-up through WhatsApp'],
  },
  {
    id: 'consultation', slug: 'digital-marketing-consultation', name: 'Digital Marketing Consultation', tag: 'Strategy',
    icon: 'message', color: 'fuchsia', image: '', whatsapp: '', order: 9, active: true,
    description: 'Get a clear marketing direction for your rental business.',
    points: ['Business and audience review', 'Channel recommendations', 'Prioritised action plan', 'Budget and measurement guidance'],
    overview:
      'A consultation gives you a clear marketing direction before you spend. We review your business, audience and current channels, recommend where to focus, and give you a prioritised action plan with budget and measurement guidance.',
    benefits: ['Clarity before committing budget', 'Channel recommendations for your category', 'A prioritised, practical action plan'],
  },
]

// ---------------------------------------------------------------------------
// Plans
// ---------------------------------------------------------------------------

export const PLANS = [
  {
    id: 'free', name: 'Free Plan', short: 'Free', tagline: 'Start Free', icon: 'gift', color: 'violet',
    price: 0, adBudget: 0, free: true, showOnCategory: true, recommended: false, order: 1, active: true,
    description: 'Perfect to get started with Smagizh.',
    categoryNote: 'Explore the basics',
    freeFeatures: ['1 User', 'Up to 3 Projects', 'Basic Support', 'Community Access'],
    features: ['1 user • Up to 3 projects', 'Basic support', 'Community access'],
    scope: [
      'Google Search (10 KWs) / month',
      'Website Visit (10 K) / month',
      '1 automation per month',
      'Google Business Profile',
      'Monthly progress summary',
      'Priority check-in (monthly)',
    ],
  },
  {
    id: 'basic', name: 'Basic Plan', short: 'Basic', tagline: 'Local Starter', icon: 'rocket', color: 'orange',
    price: 4999, adBudget: 6000, free: false, showOnCategory: true, recommended: false, order: 2, active: true,
    description: 'Great value and grow steadily.',
    categoryNote: 'Build your local presence',
    features: ['Google Business Profile support', 'Local campaign setup', 'Monthly progress review'],
    scope: [
      'Google Search (20 KWs) / month',
      'Website Visit (20 K) / month',
      '2 automations per month',
      'Google Business Profile',
      'Monthly progress full review',
      'Priority check-in (bi-weekly)',
    ],
  },
  {
    id: 'business', name: 'Business Plan', short: 'Business', tagline: 'Booking Growth', icon: 'chart', color: 'violet',
    price: 8999, adBudget: 12000, free: false, showOnCategory: true, recommended: true, order: 3, active: true,
    description: 'More reach, better results.',
    categoryNote: 'Grow with consistent enquiries',
    features: ['Everything in Basic', 'Enquiry tracking and lead sheet', 'Weekly campaign optimisation'],
    scope: [
      'Google Search (50 KWs) / month',
      'Website Visit (50 K) / month',
      '4 automations per month',
      'Google Business Profile',
      'Enquiry tracking and lead sheet',
      'Weekly optimisation + Monthly review',
    ],
  },
  {
    id: 'premium', name: 'Premium Plan', short: 'Premium', tagline: 'Business Expansion', icon: 'crown', color: 'amber',
    price: 14999, adBudget: 20000, free: false, showOnCategory: true, recommended: false, order: 4, active: true,
    description: 'Scale faster with dedicated support.',
    categoryNote: 'Scale with dedicated support',
    features: ['Everything in Business', 'Remarketing campaigns', 'Daily optimisation • Fortnightly review'],
    scope: [
      'Google Search (100 KWs) / month',
      'Website Visit (100 K) / month',
      'Unlimited automations',
      'Google Business Profile',
      'Remarketing + retargeting',
      'Daily optimisation + Fortnightly performance review',
    ],
  },
]

export const TRIAL_POINTS = ['Cancel anytime for no fees', 'No charges during the trial period', 'Cancel anytime before renewal']

// Plan comparison table (values keyed by plan id; editable in Admin → Plans).
export const COMPARISON = [
  { id: 'channels', label: 'Advertising channels', values: { free: 'Not included', basic: 'Google Search OR Meta', business: 'Google Search + Meta', premium: 'Google Search + Meta' } },
  { id: 'locations', label: 'Service locations', values: { free: '1', basic: '1', business: '1', premium: 'Up to 2' } },
  { id: 'campaigns', label: 'Active campaigns', values: { free: 'Not included', basic: 'Up to 2', business: 'Up to 4', premium: 'Up to 6' } },
  { id: 'variations', label: 'Ad variations / month', values: { free: 'Not included', basic: '2', business: '4', premium: '8' } },
  { id: 'research', label: 'Audience & keyword research', values: { free: '10 keywords / month', basic: 'Focused research', business: 'Expanded research', premium: 'Research + competitor review' } },
  { id: 'setup', label: 'Campaign setup & management', values: { free: 'Not included', basic: 'Included', business: 'Included', premium: 'Included' } },
  { id: 'gbp', label: 'Google Business Profile', values: { free: 'Included', basic: 'Audit', business: 'Optimisation support', premium: 'Optimisation support' } },
  { id: 'landing', label: 'Landing pages', values: { free: 'Not included', basic: 'Quoted separately', business: '1 template page', premium: '2 template pages' } },
  { id: 'whatsapp', label: 'WhatsApp enquiry link', values: { free: 'Included', basic: 'Included', business: 'Included', premium: 'Included' } },
  { id: 'tracking', label: 'Enquiry tracking', values: { free: 'Not included', basic: 'Basic lead log', business: 'Tracking + lead sheet', premium: 'Tracking + lead sheet' } },
  { id: 'retargeting', label: 'Retargeting', values: { free: 'Not included', basic: 'Not included', business: 'Not included', premium: 'When eligible' } },
  { id: 'optimisation', label: 'Campaign optimisation', values: { free: 'Not included', basic: 'Weekly checks', business: 'Weekly optimisation', premium: 'Twice weekly' } },
  { id: 'report', label: 'Performance report', values: { free: 'Monthly summary', basic: 'Monthly', business: 'Monthly', premium: 'Fortnightly' } },
  { id: 'booking', label: 'Booking outcome review', values: { free: 'Not included', basic: 'Owner lead log', business: 'Monthly review', premium: 'Fortnightly review' } },
  { id: 'support', label: 'Support', values: { free: 'Community + basic support', basic: 'Email', business: 'Email + WhatsApp', premium: 'Assigned account contact' } },
  { id: 'strategy', label: 'Strategy review', values: { free: 'Monthly check-in', basic: 'At setup', business: 'Monthly', premium: 'Monthly + quarterly planning' } },
]

// ---------------------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------------------

const faq = (id, order, group, icon, color, question, answer) => ({ id, order, group, icon, color, question, answer, active: true })

export const FAQ_GROUPS = [
  { id: 'plans', name: 'Plans & Getting Started', sub: "Your plan, costs, setup and what's included.", icon: 'rocket' },
  { id: 'results', name: 'Results & Account Control', sub: 'Performance, enquiries, accounts and policies.', icon: 'chart' },
]

export const FAQS = [
  faq('f1', 1, 'plans', 'arrows-swap', 'violet', 'Can I change my plan?',
    'Request an upgrade or downgrade. Timing and fee adjustments follow your billing cycle and agreement; prepaid annual changes need a separate review.'),
  faq('f2', 2, 'plans', 'wallet', 'blue', 'Is ad spend included?',
    'No. Service fees, advertising spend, applicable taxes and third-party costs are separate. Agree each cost before launch.'),
  faq('f3', 3, 'plans', 'tag', 'pink', 'What discounts are available?',
    'Proposed offer: 5% off monthly service fees or 20% off 12 months paid upfront. Discounts cannot be combined and exclude ad spend.'),
  faq('f4', 4, 'plans', 'calendar', 'orange', 'Can I cancel or request a refund?',
    'Monthly and annual commitments differ. Notice periods, cancellation charges and refund eligibility must be confirmed in your agreement before payment.'),
  faq('f5', 5, 'plans', 'chart', 'emerald', 'Which reports will I receive?',
    'Review spend, enquiries and cost per enquiry. Booking and revenue reporting requires your team to record outcomes. Report frequency depends on the plan.'),
  faq('f6', 6, 'plans', 'whatsapp', 'green', 'How do enquiries reach us?',
    'Through your business WhatsApp, calls or forms, depending on setup. Your assigned team follows up, confirms availability and closes bookings.'),
  faq('f7', 7, 'plans', 'apps', 'violet', 'Do you cover my rental category?',
    'The proposed service covers 17 categories across vehicles, equipment, products and property. Confirm your subcategories, location and scope during consultation.'),
  faq('f8', 8, 'plans', 'settings', 'red', 'What is needed to launch?',
    'Provide business details, inventory, prices, availability, photos and account access. Launch follows agreed budgets, creative approval and platform review.'),
  faq('f9', 9, 'results', 'clock', 'pink', 'When can I expect results?',
    'Paid ads can run after approval, but useful performance data takes time. SEO can take months. Timing varies with competition, budget and website readiness.'),
  faq('f10', 10, 'results', 'trophy', 'violet', 'Are bookings or top rankings guaranteed?',
    'No. Campaigns aim to attract relevant enquiries. Bookings depend on pricing, demand, availability and follow-up; search rankings cannot be guaranteed.'),
  faq('f11', 11, 'results', 'user', 'teal', 'Who controls my accounts?',
    'Keep ownership or admin access to your business accounts. Use permission-based agency access rather than sharing passwords. Agree asset ownership and handover in writing.'),
  faq('f12', 12, 'results', 'google', 'blue', 'Is Google Business Profile free?',
    'Google provides Business Profile at no charge for eligible businesses. Any Smagizh fee is for agreed setup or management work, not a fee to Google for listing.'),
  faq('f13', 13, 'results', 'filter', 'indigo', 'What is a qualified enquiry?',
    'Define it together: required rental type, service area, dates and other agreed criteria. An enquiry is not a confirmed booking; record spam, duplicates and outcomes separately.'),
  faq('f14', 14, 'results', 'pause', 'orange', 'Can we start small or pause seasonal ads?',
    'Start with a focused location and priority inventory. Adjust campaigns when availability changes. Pausing ads does not automatically pause service fees or annual commitments.'),
  faq('f15', 15, 'results', 'map-pin', 'rose', 'Do we need a website or multiple-location plan?',
    'Some campaigns can use WhatsApp or lead forms; others need a landing page. Extra locations, pages and tracking are scoped separately to avoid spreading the budget too thin.'),
  faq('f16', 16, 'results', 'message', 'blue', 'Can we message every lead on WhatsApp?',
    'Obtain the permission required for business-initiated messaging, respect opt-outs and use customer data only for agreed purposes. Platform messaging and template rules may apply.'),
]

// ---------------------------------------------------------------------------
// Testimonials — the client's design marks these as sample feedback until
// approved customer quotes are supplied.
// ---------------------------------------------------------------------------

export const TESTIMONIALS = [
  { id: 't1', sample: true, quote: 'The team helped us present our equipment clearly and organise our local promotion.', role: 'Construction rental owner', name: '', business: '', categoryId: 'construction-equipment-rental' },
  { id: 't2', sample: true, quote: 'Having enquiries and campaign spend in one report made our monthly review easier.', role: 'Car rental owner', name: '', business: '', categoryId: 'car-rental' },
  { id: 't3', sample: true, quote: 'A clear point of contact helped us coordinate offers and customer follow-up.', role: 'Event equipment rental owner', name: '', business: '', categoryId: 'party-events-rental' },
]

// ---------------------------------------------------------------------------
// Demo enquiries
// ---------------------------------------------------------------------------

export const ENQUIRIES = [
  { id: 'ENQ-2026-00121', owner: 'Suresh Babu', business: 'Suresh Bike Point', mobile: '9876543210', email: 'suresh@example.com', categoryId: 'bike-rental', subcategories: ['Scooters / Gearless Scooters', 'Commuter Bikes'], city: 'Coimbatore', state: 'Tamil Nadu', plan: 'Basic Plan', service: 'Meta Ads Management', budget: '₹5,000 – ₹10,000', status: 'New', assignedTo: 'Arun Kumar', message: 'Looking to promote weekend bike rentals.', createdAt: '2026-08-17T10:30:00' },
  { id: 'ENQ-2026-00122', owner: 'Meena R.', business: 'Meena Event Rentals', mobile: '9876501234', email: 'meena@example.com', categoryId: 'party-events-rental', subcategories: ['Sound Systems', 'Tents / Shamiana / Structures'], city: 'Chennai', state: 'Tamil Nadu', plan: 'Premium Plan', service: 'Lead Generation Campaigns', budget: '₹20,000+', status: 'Contacted', assignedTo: 'Priya N.', message: 'Need leads for wedding season.', createdAt: '2026-08-16T16:15:00' },
  { id: 'ENQ-2026-00123', owner: 'Kannan D.', business: 'KD Construction Equipments', mobile: '9944556677', email: 'kannan@example.com', categoryId: 'construction-equipment-rental', subcategories: ['Excavators', 'Cranes'], city: 'Salem', state: 'Tamil Nadu', plan: 'Business Plan', service: 'Google Ads Management', budget: '₹10,000 – ₹20,000', status: 'Follow-Up Required', assignedTo: 'Vignesh S.', message: 'JCB and crane rentals across Salem district.', createdAt: '2026-08-15T11:20:00' },
  { id: 'ENQ-2026-00124', owner: 'Farhan A.', business: 'Farhan Car Rentals', mobile: '9012345678', email: 'farhan@example.com', categoryId: 'car-rental', subcategories: ['SUV', 'Sedan'], city: 'Madurai', state: 'Tamil Nadu', plan: 'Business Plan', service: 'Search Engine Optimisation', budget: '₹10,000 – ₹20,000', status: 'Service Confirmed', assignedTo: 'Janani M.', message: 'Want to rank for self-drive car rental Madurai.', createdAt: '2026-08-13T15:45:00' },
  { id: 'ENQ-2026-00125', owner: 'Divya S.', business: 'Divya Camera Hire', mobile: '9887766554', email: 'divya.s@example.com', categoryId: 'tech-electronics-rental', subcategories: ['Cameras'], city: 'Coimbatore', state: 'Tamil Nadu', plan: 'Basic Plan', service: 'Local Business Promotion', budget: '₹2,000 – ₹5,000', status: 'Interested', assignedTo: 'Karthik R.', message: 'Looking to promote DSLR and lens rentals.', createdAt: '2026-08-12T09:10:00' },
]

// Old category ids from the previous seed -> the catalog category they belong to.
export const LEGACY_CATEGORY_MAP = {
  'van-rental': 'lmv-rental',
  'bus-rental': 'lmv-rental',
  'self-drive-vehicle-rental': 'car-rental',
  'travel-vehicle-rental': 'car-rental',
  'event-equipment-rental': 'party-events-rental',
  'sound-system-rental': 'party-events-rental',
  'camera-rental': 'tech-electronics-rental',
  'costume-rental': 'fashion-rental',
  'machinery-rental': 'construction-equipment-rental',
  'tools-rental': 'tools-equipment-rental',
}

export const ENQUIRY_STATUSES = ['New', 'Contacted', 'Interested', 'Follow-Up Required', 'Service Confirmed', 'Closed']

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
]

export const BUDGET_OPTIONS = ['Below ₹6,000', '₹6,000 – ₹12,000', '₹12,000 – ₹20,000', '₹20,000 – ₹35,000', '₹35,000+']

export const GOAL_OPTIONS = ['More enquiries', 'More bookings', 'Launch a new location', 'Promote seasonal offers', 'Improve Google visibility', 'Not sure yet']

export const NEXT_STEPS = [
  { title: 'Business review', text: 'Understand your fleet and goals.' },
  { title: 'Confirm scope', text: 'Agree services, budget and area.' },
  { title: 'Approve launch', text: 'Review access and campaign creatives.' },
  { title: 'Capture enquiries', text: 'Receive leads on your WhatsApp.' },
  { title: 'Review bookings', text: 'Track enquiry quality and results.' },
]
