/**
 * Data-driven icon system.
 *
 * Categories, subcategories, services, plans and FAQs store an icon *key*
 * (e.g. "motorbike") and a colour key (e.g. "violet"). The Admin Panel picks
 * both from this registry, so every icon on the user side is a consistent
 * line icon — no emoji, no placeholders.
 *
 * Icons come from Tabler Icons and Lucide (same 24px line style), plus a few
 * custom glyphs neither set has (dress, saree, violin, saxophone, generator).
 */
import { useState } from 'react'
import * as T from '@tabler/icons-react'
import * as L from 'lucide-react'

/* ------------------------------------------------------------------ */
/* custom glyphs                                                       */
/* ------------------------------------------------------------------ */

const svg = (paths) =>
  function CustomIcon({ className, strokeWidth = 1.75 }) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        {paths}
      </svg>
    )
  }

const Dress = svg(
  <>
    <path d="M9.5 2.5v4M14.5 2.5v4" />
    <path d="M9.5 6.5c.8.9 1.6 1.3 2.5 1.3s1.7-.4 2.5-1.3L14 11l5 10H5l5-10-.5-4.5Z" />
    <path d="M10 11h4" />
  </>,
)
const Saree = svg(
  <>
    <path d="M9.5 2.5v4M14.5 2.5v4" />
    <path d="M9.5 6.5c.8.9 1.6 1.3 2.5 1.3s1.7-.4 2.5-1.3L14 11l5 10H5l5-10-.5-4.5Z" />
    <path d="M14.5 6.5 8 21" />
    <path d="M10 11h4" />
  </>,
)
const Violin = svg(
  <>
    <path d="m17.5 3.5 3 3" />
    <path d="M19 5 12.5 11.5" />
    <path d="M11.8 9.3c-1.4-.6-3-.2-4 .8s-1.2 2.3-.7 3.3c-1 .3-1.9 1-2.4 1.9-.9 1.7-.1 3.9 1.8 4.7 1.4.6 3 .2 4-1 .7-.8.9-1.8.8-2.6 1 .4 2.2.1 3-.8 1.1-1 1.3-2.6.7-3.9" />
    <path d="m8.3 15.2 1.6 1.6" />
  </>,
)
const Saxophone = svg(
  <>
    <path d="M6.5 3H11" />
    <path d="M9 3v12.5a4.5 4.5 0 0 0 9 0V13" />
    <path d="M15.5 13h5l-1.4-3.2h-2.2Z" />
    <path d="M12 8h.01M12 11h.01M12 14h.01" />
  </>,
)
const Generator = svg(
  <>
    <path d="M6 6V4h12v2" />
    <rect x="3" y="6" width="18" height="11" rx="2" />
    <path d="m12.6 8.6-2.2 3.2h3.2l-2.2 3.2" />
    <path d="M6.5 17v2.5M17.5 17v2.5" />
  </>,
)

/* ------------------------------------------------------------------ */
/* registry: key -> [Component, label, TABLER?]                        */
/* ------------------------------------------------------------------ */

// marks Tabler entries: their `stroke` prop means line width
const TABLER = 1

const REGISTRY = {
  // vehicles
  motorbike: [T.IconMotorbike, 'Motorbike', TABLER],
  scooter: [T.IconScooter, 'Scooter', TABLER],
  'scooter-electric': [T.IconScooterElectric, 'Electric scooter', TABLER],
  moped: [T.IconMoped, 'Moped / classic bike', TABLER],
  helmet: [T.IconHelmet, 'Helmet', TABLER],
  gauge: [L.Gauge, 'Speed gauge'],
  history: [L.History, 'Vintage'],
  bicycle: [L.Bike, 'Bicycle'],
  car: [T.IconCar, 'Car', TABLER],
  'car-front': [L.CarFront, 'Car (front)'],
  'car-suv': [T.IconCarSuv, 'SUV', TABLER],
  'car-4wd': [T.IconCar4wd, '4WD / MUV', TABLER],
  'car-off-road': [T.IconCarOffRoad, 'Off-road SUV', TABLER],
  'car-crane': [T.IconCarCrane, 'Car carrier / tow', TABLER],
  'steering-wheel': [T.IconSteeringWheel, 'Steering wheel', TABLER],
  'charging-pile': [T.IconChargingPile, 'EV charging', TABLER],
  truck: [T.IconTruck, 'Truck', TABLER],
  'truck-alt': [L.Truck, 'Truck (alt)'],
  'truck-delivery': [T.IconTruckDelivery, 'Delivery truck', TABLER],
  'truck-loading': [T.IconTruckLoading, 'Loading truck', TABLER],
  tir: [T.IconTir, 'Heavy truck / trailer', TABLER],
  bus: [T.IconBus, 'Bus / van', TABLER],
  caravan: [T.IconCaravan, 'Caravan', TABLER],
  container: [L.Container, 'Container'],
  fuel: [L.Fuel, 'Fuel'],
  // construction & machinery
  backhoe: [T.IconBackhoe, 'Excavator / backhoe', TABLER],
  bulldozer: [T.IconBulldozer, 'Loader / bulldozer', TABLER],
  crane: [T.IconCrane, 'Crane', TABLER],
  forklift: [T.IconForklift, 'Forklift', TABLER],
  tractor: [T.IconTractor, 'Tractor', TABLER],
  'tractor-alt': [L.Tractor, 'Tractor (alt)'],
  road: [T.IconRoad, 'Road', TABLER],
  'brick-wall': [L.BrickWall, 'Concrete / masonry'],
  cylinder: [L.Cylinder, 'Roller / cylinder'],
  elevator: [T.IconElevator, 'Lift / access', TABLER],
  pickaxe: [L.Pickaxe, 'Piling / pickaxe'],
  hammer: [L.Hammer, 'Hammer'],
  compass: [T.IconCompass, 'Survey / compass', TABLER],
  'hard-hat': [L.HardHat, 'Safety helmet'],
  // agriculture
  wheat: [L.Wheat, 'Harvest / wheat'],
  sprout: [L.Sprout, 'Sprout'],
  seedling: [T.IconSeedling, 'Seedling', TABLER],
  leaf: [T.IconLeaf, 'Leaf', TABLER],
  spray: [T.IconSpray, 'Sprayer', TABLER],
  grain: [T.IconGrain, 'Grain', TABLER],
  shovel: [T.IconShovel, 'Shovel', TABLER],
  pitchfork: [T.IconShovelPitchforks, 'Pitchfork / cultivator', TABLER],
  'garden-cart': [T.IconGardenCart, 'Garden cart', TABLER],
  'lawn-mower': [T.IconLawnMower, 'Lawn mower', TABLER],
  droplet: [T.IconDroplet, 'Water drop', TABLER],
  droplets: [L.Droplets, 'Water'],
  scissors: [L.Scissors, 'Scissors / cutter'],
  cog: [L.Cog, 'Rotary / cog'],
  // power & tools
  generator: [Generator, 'Generator'],
  factory: [T.IconBuildingFactory, 'Factory', TABLER],
  'factory-alt': [T.IconBuildingFactory2, 'Industrial', TABLER],
  plug: [L.Plug, 'Plug'],
  zap: [L.Zap, 'Power / bolt'],
  battery: [L.BatteryCharging, 'Battery'],
  flame: [L.Flame, 'Flame / gas'],
  trolley: [T.IconTrolley, 'Trolley', TABLER],
  drill: [L.Drill, 'Power drill'],
  saw: [T.IconWaveSawTool, 'Cutting tool', TABLER],
  'hammer-drill': [T.IconHammerDrill, 'Hammer drill', TABLER],
  wrench: [L.Wrench, 'Wrench'],
  tools: [T.IconTools, 'Tools', TABLER],
  ruler: [L.Ruler, 'Measuring'],
  pipeline: [T.IconPipeline, 'Plumbing', TABLER],
  'vacuum-cleaner': [T.IconVacuumCleaner, 'Vacuum cleaner', TABLER],
  wind: [L.Wind, 'Air / wind'],
  ladder: [T.IconLadder, 'Ladder', TABLER],
  // security
  cctv: [T.IconDeviceCctv, 'CCTV camera', TABLER],
  'cctv-alt': [L.Cctv, 'Surveillance'],
  lock: [T.IconLockAccess, 'Access control', TABLER],
  fingerprint: [T.IconFingerprint, 'Biometric', TABLER],
  radio: [L.Radio, 'Walkie-talkie / radio'],
  scan: [L.ScanLine, 'Scanner / detector'],
  siren: [L.Siren, 'Alarm / siren'],
  'fire-extinguisher': [T.IconFireExtinguisher, 'Fire extinguisher', TABLER],
  lightbulb: [L.Lightbulb, 'Lighting'],
  barrier: [T.IconBarrierBlock, 'Barrier', TABLER],
  fence: [L.Fence, 'Fence / crowd control'],
  eye: [T.IconEye, 'Mirror / view', TABLER],
  shield: [L.ShieldCheck, 'Security shield'],
  // tech
  laptop: [T.IconDeviceLaptop, 'Laptop', TABLER],
  desktop: [T.IconDeviceDesktop, 'Desktop', TABLER],
  projector: [T.IconDeviceProjector, 'Projector', TABLER],
  camera: [T.IconCamera, 'Camera', TABLER],
  gamepad: [T.IconDeviceGamepad2, 'Gaming console', TABLER],
  smartphone: [T.IconDeviceMobile, 'Smartphone', TABLER],
  tablet: [T.IconDeviceTablet, 'Tablet', TABLER],
  monitor: [L.Monitor, 'Monitor'],
  printer: [T.IconPrinter, 'Printer', TABLER],
  router: [T.IconRouter, 'Router / network', TABLER],
  headphones: [T.IconHeadphones, 'Headphones', TABLER],
  drone: [T.IconDrone, 'Drone', TABLER],
  watch: [T.IconDeviceWatch, 'Smartwatch', TABLER],
  server: [T.IconServer, 'Server', TABLER],
  cable: [L.Cable, 'Cables / accessories'],
  // home appliances
  fridge: [T.IconFridge, 'Refrigerator', TABLER],
  'wash-machine': [T.IconWashMachine, 'Washing machine', TABLER],
  'air-conditioner': [T.IconAirConditioning, 'Air conditioner', TABLER],
  tv: [L.Tv, 'Television'],
  fan: [L.Fan, 'Fan / cooler'],
  microwave: [T.IconMicrowave, 'Microwave', TABLER],
  utensils: [L.UtensilsCrossed, 'Dishwasher / utensils'],
  blender: [T.IconBlender, 'Blender', TABLER],
  dryer: [T.IconWashTumbleDry, 'Dryer', TABLER],
  'cooking-pot': [L.CookingPot, 'Small appliance'],
  // fashion
  dress: [Dress, 'Dress / gown'],
  saree: [Saree, 'Saree'],
  shirt: [T.IconShirt, 'Shirt / kurta', TABLER],
  'shirt-alt': [L.Shirt, 'Shirt (alt)'],
  tie: [T.IconTie, 'Suit / tie', TABLER],
  jacket: [T.IconJacket, 'Jacket', TABLER],
  masks: [T.IconMasksTheater, 'Costume / theatre', TABLER],
  baby: [L.Baby, 'Kids'],
  handbag: [L.Handbag, 'Handbag'],
  shoe: [T.IconShoe, 'Footwear', TABLER],
  gem: [L.Gem, 'Jewellery'],
  hanger: [T.IconHanger, 'Hanger', TABLER],
  // fitness & sports
  treadmill: [T.IconTreadmill, 'Treadmill', TABLER],
  stretching: [T.IconStretching, 'Stretching', TABLER],
  'stretching-alt': [T.IconStretching2, 'Exercise', TABLER],
  barbell: [T.IconBarbell, 'Barbell', TABLER],
  dumbbell: [L.Dumbbell, 'Dumbbell'],
  biceps: [L.BicepsFlexed, 'Strength'],
  weight: [T.IconWeight, 'Weight', TABLER],
  cricket: [T.IconCricket, 'Cricket', TABLER],
  feather: [L.Feather, 'Badminton'],
  'bike-sport': [T.IconBike, 'Cycling', TABLER],
  yoga: [T.IconYoga, 'Yoga', TABLER],
  karate: [T.IconKarate, 'Boxing / martial arts', TABLER],
  tent: [T.IconTent, 'Tent / outdoor', TABLER],
  kayak: [T.IconKayak, 'Kayak / water sports', TABLER],
  football: [T.IconBallFootball, 'Football', TABLER],
  // medical
  lungs: [T.IconLungs, 'Respiratory', TABLER],
  'hospital-bed': [T.IconEmergencyBed, 'Hospital bed', TABLER],
  wheelchair: [T.IconWheelchair, 'Wheelchair', TABLER],
  'heart-monitor': [T.IconHeartRateMonitor, 'Patient monitor', TABLER],
  'icu-monitor': [T.IconDeviceHeartMonitor, 'ICU monitor', TABLER],
  syringe: [L.Syringe, 'Infusion / injection'],
  massage: [T.IconMassage, 'Physiotherapy', TABLER],
  elderly: [T.IconOld, 'Elderly care', TABLER],
  crutches: [T.IconCrutches, 'Patient transfer', TABLER],
  stethoscope: [L.Stethoscope, 'Diagnostic'],
  'first-aid': [T.IconFirstAidKit, 'Medical kit', TABLER],
  'heart-pulse': [L.HeartPulse, 'Home healthcare'],
  // events
  speaker: [T.IconDeviceSpeaker, 'Speaker', TABLER],
  confetti: [T.IconConfetti, 'Party / confetti', TABLER],
  'party-popper': [L.PartyPopper, 'Party popper'],
  theater: [L.Theater, 'Stage'],
  chair: [T.IconChairDirector, 'Tables & chairs', TABLER],
  disc: [T.IconDisc, 'DJ', TABLER],
  truss: [T.IconBuildingBridge, 'Truss & rigging', TABLER],
  balloon: [T.IconBalloon, 'Decoration', TABLER],
  presentation: [L.Presentation, 'Audio visual'],
  'chef-hat': [L.ChefHat, 'Catering'],
  grid: [T.IconLayoutGrid, 'Dance floor / grid', TABLER],
  sparkles: [L.Sparkles, 'Effects / sparkle'],
  // music
  guitar: [L.Guitar, 'Guitar'],
  piano: [T.IconPiano, 'Keyboard / piano', TABLER],
  drum: [L.Drum, 'Drums'],
  violin: [Violin, 'Violin'],
  saxophone: [Saxophone, 'Saxophone / wind'],
  'music-note': [L.Music2, 'Music'],
  'keyboard-music': [L.KeyboardMusic, 'Electronic instrument'],
  sliders: [L.SlidersVertical, 'Studio'],
  'speaker-alt': [L.Speaker, 'Amplifier'],
  mic: [L.Mic, 'Microphone'],
  vinyl: [T.IconVinyl, 'Vinyl / DJ', TABLER],
  'guitar-pick': [T.IconGuitarPick, 'Accessories', TABLER],
  // property
  home: [T.IconHome, 'House', TABLER],
  building: [T.IconBuilding, 'Apartment', TABLER],
  skyscraper: [T.IconBuildingSkyscraper, 'Office', TABLER],
  store: [T.IconBuildingStore, 'Shop', TABLER],
  'store-alt': [L.Store, 'Showroom'],
  warehouse: [T.IconBuildingWarehouse, 'Warehouse', TABLER],
  cottage: [T.IconBuildingCottage, 'Villa', TABLER],
  bed: [L.BedDouble, 'PG / hostel'],
  'users-group': [T.IconUsersGroup, 'Co-working / group', TABLER],
  'land-plot': [L.LandPlot, 'Land'],
  'map-pin': [T.IconMapPin, 'Location', TABLER],
  community: [T.IconBuildingCommunity, 'Studio apartment', TABLER],
  hotel: [L.Hotel, 'Guest house'],
  // marketing & UI
  megaphone: [T.IconSpeakerphone, 'Megaphone / ads', TABLER],
  search: [T.IconSearch, 'Search', TABLER],
  'search-chart': [T.IconZoomScan, 'SEO', TABLER],
  'map-pinned': [L.MapPinned, 'Local'],
  star: [T.IconStar, 'Star', TABLER],
  browser: [T.IconAppWindow, 'Website', TABLER],
  'browser-tool': [T.IconBrowserCheck, 'Website check', TABLER],
  users: [T.IconUsers, 'Users', TABLER],
  message: [L.MessageCircle, 'Chat'],
  target: [T.IconTarget, 'Target', TABLER],
  chart: [T.IconChartBar, 'Chart', TABLER],
  'chart-line': [T.IconChartLine, 'Growth', TABLER],
  rocket: [T.IconRocket, 'Rocket', TABLER],
  crown: [T.IconCrown, 'Crown', TABLER],
  gift: [T.IconGift, 'Gift', TABLER],
  diamond: [T.IconDiamond, 'Diamond', TABLER],
  folder: [T.IconFolder, 'Folder', TABLER],
  layers: [T.IconStack2, 'Layers', TABLER],
  box: [T.IconBox, 'Box', TABLER],
  package: [L.Package, 'Package'],
  file: [T.IconFileText, 'Document', TABLER],
  clipboard: [T.IconClipboardCheck, 'Checklist', TABLER],
  calendar: [T.IconCalendar, 'Calendar', TABLER],
  wallet: [T.IconWallet, 'Wallet', TABLER],
  tag: [T.IconTag, 'Tag / discount', TABLER],
  'arrows-swap': [T.IconArrowsExchange, 'Change', TABLER],
  clock: [T.IconClock, 'Clock', TABLER],
  trophy: [T.IconTrophy, 'Trophy', TABLER],
  user: [T.IconUser, 'User', TABLER],
  google: [T.IconBrandGoogle, 'Google', TABLER],
  meta: [T.IconBrandMeta, 'Meta', TABLER],
  filter: [T.IconFilter, 'Filter', TABLER],
  pause: [T.IconPlayerPause, 'Pause', TABLER],
  settings: [T.IconSettings, 'Settings', TABLER],
  headset: [T.IconHeadset, 'Support', TABLER],
  send: [T.IconSend, 'Send', TABLER],
  pointer: [T.IconClick, 'Click', TABLER],
  database: [T.IconDatabase, 'Database', TABLER],
  apps: [T.IconApps, 'Grid of apps', TABLER],
  list: [T.IconListCheck, 'List', TABLER],
  whatsapp: [T.IconBrandWhatsapp, 'WhatsApp', TABLER],
  mail: [T.IconMail, 'Mail', TABLER],
  phone: [T.IconPhone, 'Phone', TABLER],
  shieldcheck: [T.IconShieldCheck, 'Shield check', TABLER],
  bolt: [T.IconBolt, 'Bolt', TABLER],
}

export const ICON_KEYS = Object.keys(REGISTRY)
export const iconLabel = (key) => REGISTRY[key]?.[1] || key

/* ------------------------------------------------------------------ */
/* colour palette (static class strings so Tailwind keeps them)        */
/* ------------------------------------------------------------------ */

export const COLORS = {
  violet: { tile: 'bg-violet-50', text: 'text-violet-600', ring: 'ring-violet-100', dot: 'bg-violet-500' },
  indigo: { tile: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-100', dot: 'bg-indigo-500' },
  blue: { tile: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-100', dot: 'bg-blue-500' },
  sky: { tile: 'bg-sky-50', text: 'text-sky-600', ring: 'ring-sky-100', dot: 'bg-sky-500' },
  cyan: { tile: 'bg-cyan-50', text: 'text-cyan-600', ring: 'ring-cyan-100', dot: 'bg-cyan-500' },
  teal: { tile: 'bg-teal-50', text: 'text-teal-600', ring: 'ring-teal-100', dot: 'bg-teal-500' },
  emerald: { tile: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-100', dot: 'bg-emerald-500' },
  green: { tile: 'bg-green-50', text: 'text-green-600', ring: 'ring-green-100', dot: 'bg-green-500' },
  amber: { tile: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-100', dot: 'bg-amber-500' },
  orange: { tile: 'bg-orange-50', text: 'text-orange-500', ring: 'ring-orange-100', dot: 'bg-orange-500' },
  red: { tile: 'bg-red-50', text: 'text-red-500', ring: 'ring-red-100', dot: 'bg-red-500' },
  rose: { tile: 'bg-rose-50', text: 'text-rose-500', ring: 'ring-rose-100', dot: 'bg-rose-500' },
  pink: { tile: 'bg-pink-50', text: 'text-pink-500', ring: 'ring-pink-100', dot: 'bg-pink-500' },
  fuchsia: { tile: 'bg-fuchsia-50', text: 'text-fuchsia-600', ring: 'ring-fuchsia-100', dot: 'bg-fuchsia-500' },
}
export const COLOR_KEYS = Object.keys(COLORS)
export const colorOf = (key) => COLORS[key] || COLORS.violet

/* ------------------------------------------------------------------ */
/* components                                                          */
/* ------------------------------------------------------------------ */

/** Bare icon. Falls back to a neutral box so a bad key never breaks a page. */
export default function AppIcon({ name, className = 'h-6 w-6', strokeWidth = 1.75 }) {
  const C = REGISTRY[name]?.[0] || T.IconBox
  // Tabler's `stroke` prop is the line width; Lucide's `stroke` is the colour,
  // so each library gets its own prop.
  return REGISTRY[name]?.[2] === TABLER ? (
    <C className={className} stroke={strokeWidth} aria-hidden="true" />
  ) : (
    <C className={className} strokeWidth={strokeWidth} aria-hidden="true" />
  )
}

/* ------------------------------------------------------------------ */
/* 3D icons                                                            */
/* ------------------------------------------------------------------ */

/**
 * Solid colour ramps for the 3D treatment: [highlight, face, side, deep].
 * Inline hex (not Tailwind classes) because these feed CSS filters.
 */
const SOLID = {
  violet: ['#C4B5FD', '#A78BFA', '#7C3AED', '#4C1D95'],
  indigo: ['#A5B4FC', '#818CF8', '#4F46E5', '#312E81'],
  blue: ['#93C5FD', '#60A5FA', '#2563EB', '#1E3A8A'],
  sky: ['#7DD3FC', '#38BDF8', '#0284C7', '#0C4A6E'],
  cyan: ['#67E8F9', '#22D3EE', '#0891B2', '#164E63'],
  teal: ['#5EEAD4', '#2DD4BF', '#0D9488', '#134E4A'],
  emerald: ['#6EE7B7', '#34D399', '#059669', '#064E3B'],
  green: ['#86EFAC', '#4ADE80', '#16A34A', '#14532D'],
  amber: ['#FCD34D', '#FBBF24', '#D97706', '#78350F'],
  orange: ['#FDBA74', '#FB923C', '#EA580C', '#7C2D12'],
  red: ['#FCA5A5', '#F87171', '#DC2626', '#7F1D1D'],
  rose: ['#FDA4AF', '#FB7185', '#E11D48', '#881337'],
  pink: ['#F9A8D4', '#F472B6', '#DB2777', '#831843'],
  fuchsia: ['#F0ABFC', '#E879F9', '#C026D3', '#701A75'],
}
export const solidOf = (key) => SOLID[key] || SOLID.violet

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => {
  const [r1, g1, b1] = hex(a)
  const [r2, g2, b2] = hex(b)
  const p = (x, y) => Math.round(x + (y - x) * t)
  return `rgb(${p(r1, r2)},${p(g1, g2)},${p(b1, b2)})`
}

/**
 * Renders any registry icon as a chunky 3D object, in the style of the
 * client's 3D icon set: a bright top face, an extruded body that falls away
 * to the bottom-right, and a soft contact shadow underneath.
 *
 * The extrusion is a chain of hard `drop-shadow()`s — each one applies to the
 * result of the previous, so stepping the colour from the side tone down to
 * the deep tone builds a solid, evenly shaded side wall.
 */
export function Icon3D({ name, color = 'violet', size = 44, className = '' }) {
  const [light, face, side, deep] = solidOf(color)

  // Extrusion depth scales with the icon so a 24px chip and a 160px hero
  // illustration read as the same material.
  const depth = Math.max(3, Math.round(size * 0.07))
  const step = Math.max(0.45, size * 0.011)
  const extrude = Array.from({ length: depth }, (_, i) => {
    const t = i / Math.max(1, depth - 1)
    return `drop-shadow(${step.toFixed(2)}px ${(step * 1.2).toFixed(2)}px 0 ${mix(side, deep, t)})`
  }).join(' ')

  // Heavier strokes at small sizes keep the extrusion from closing up the glyph.
  const strokeWidth = size < 32 ? 2.4 : size < 64 ? 2.15 : 1.9

  return (
    <span
      className={`relative grid shrink-0 place-items-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* contact shadow on the ground */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-[50%]"
        style={{
          bottom: -size * 0.04,
          width: size * 0.66,
          height: size * 0.1,
          background: deep,
          opacity: 0.2,
          filter: `blur(${Math.max(2, size * 0.035)}px)`,
        }}
      />
      {/* extruded body, lit from the top-left */}
      <span
        className="relative grid h-full w-full place-items-center"
        style={{
          color: face,
          filter: `${extrude} drop-shadow(0 ${(size * 0.05).toFixed(1)}px ${(size * 0.06).toFixed(1)}px rgba(76,29,149,.3))`,
        }}
      >
        <AppIcon name={name} className="h-full w-full" strokeWidth={strokeWidth} />
      </span>
      {/* specular highlight along the lit edge */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid place-items-center"
        style={{
          color: light,
          opacity: 0.85,
          transform: `translate(${(-step * 0.85).toFixed(2)}px, ${(-step * 1).toFixed(2)}px)`,
        }}
      >
        <AppIcon name={name} className="h-full w-full" strokeWidth={strokeWidth * 0.5} />
      </span>
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* client 3D artwork                                                   */
/* ------------------------------------------------------------------ */

/**
 * Where the client's rendered 3D icons live. Drop a file named after the
 * category slug into `public/icons/3d/` — e.g. `public/icons/3d/bike-rental.png`
 * — and it is used automatically everywhere that category appears. No code
 * change, no rebuild of the icon registry.
 *
 * Resolution order:
 *   1. an image uploaded for this item in the Admin Panel
 *   2. public/icons/3d/<slug>.png
 *   3. the registry icon, rendered with the 3D treatment
 */
export const ART_BASE = '/icons/3d/'
export const artSrc = (slug) => (slug ? `${ART_BASE}${slug}.png` : '')

export function CategoryArt({ slug, icon, color = 'violet', image = '', size = 44, className = '' }) {
  const src = image || artSrc(slug)
  const [failed, setFailed] = useState(!src)

  if (!failed) {
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        onError={() => setFailed(true)}
        className={`shrink-0 object-contain ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }
  return <Icon3D name={icon} color={color} size={size} className={className} />
}

/**
 * 3D icon on the soft rounded pad used by the client's mockups
 * (category hero, category and service cards).
 */
export function Icon3DTile({ icon, color = 'violet', image = '', size = 'md', className = '' }) {
  const s = {
    xs: { box: 'h-9 w-9', icon: 'h-6 w-6' },
    sm: { box: 'h-12 w-12', icon: 'h-8 w-8' },
    md: { box: 'h-16 w-16', icon: 'h-11 w-11' },
    lg: { box: 'h-20 w-20', icon: 'h-14 w-14' },
    xl: { box: 'h-28 w-28', icon: 'h-20 w-20' },
    hero: { box: 'h-44 w-44', icon: 'h-32 w-32' },
  }[size]
  const [, face] = solidOf(color)
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-3xl ${s.box} ${className}`}
      style={{ background: `linear-gradient(160deg, ${mix(face, '#FFFFFF', 0.82)} 0%, ${mix(face, '#FFFFFF', 0.94)} 100%)` }}
    >
      {image ? (
        <img src={image} alt="" className={`${s.icon} object-contain`} />
      ) : (
        <Icon3D name={icon} color={color} className={s.icon} />
      )}
    </span>
  )
}

/**
 * Coloured icon tile used by every card. When an admin has uploaded an image
 * it replaces the icon, keeping the same tile size so cards stay aligned.
 * `variant="3d"` swaps the flat glyph for the 3D treatment.
 */
export function IconTile({
  icon,
  color = 'violet',
  image = '',
  size = 'md',
  shape = 'rounded',
  variant = 'flat',
  className = '',
}) {
  if (variant === '3d' && !image) return <Icon3DTile icon={icon} color={color} size={size} className={className} />
  const c = colorOf(color)
  const s = {
    xs: { box: 'h-9 w-9', icon: 'h-5 w-5', img: 'h-6 w-6' },
    sm: { box: 'h-11 w-11', icon: 'h-6 w-6', img: 'h-7 w-7' },
    md: { box: 'h-14 w-14', icon: 'h-7 w-7', img: 'h-9 w-9' },
    lg: { box: 'h-16 w-16', icon: 'h-8 w-8', img: 'h-10 w-10' },
    xl: { box: 'h-20 w-20', icon: 'h-10 w-10', img: 'h-12 w-12' },
  }[size]
  const radius = shape === 'circle' ? 'rounded-full' : 'rounded-2xl'
  return (
    <span className={`grid shrink-0 place-items-center ${radius} ${s.box} ${c.tile} ${c.text} ${className}`}>
      {image ? (
        <img src={image} alt="" className={`${s.img} object-contain`} />
      ) : (
        <AppIcon name={icon} className={s.icon} />
      )}
    </span>
  )
}
