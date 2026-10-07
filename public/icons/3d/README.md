# Client 3D category icons

Drop the client's rendered 3D icons in **this folder**, named after the category
slug, and they appear automatically on the category cards, the home page grid
and the category page hero. No code change and no rebuild of the icon registry
is needed — `CategoryArt` in `src/components/AppIcon.jsx` looks here first and
falls back to the built-in icon only when a file is missing.

## File names, and what is in place

Source: the client's named set `rental icons.zip` (WhatsApp, 16 Sep 2026) — one
file per category, named by the client, so the mapping is theirs and not a
guess. The JPEGs were cut out to transparent PNGs, trimmed, squared and resized
to 384×384; `Fitness & Sports Rental.png` already had an alpha channel, so its
own transparency was kept untouched.

All 17 categories are covered.

| File | Category | Client artwork |
| --- | --- | --- |
| `bike-rental.png` | Bike Rental | motorbike |
| `car-rental.png` | Car Rental | hatchback car |
| `lmv-rental.png` | LMV Rental | pickup / mini truck |
| `hmv-rental.png` | HMV Rental | tipper / dump truck |
| `construction-equipment-rental.png` | Construction Equipment Rental | excavator |
| `generator-rental.png` | Generator Rental | portable generator |
| `tools-equipment-rental.png` | Tools Equipment Rental | drill + spanner |
| `security-equipment-rental.png` | Security Equipment Rental | CCTV camera |
| `tech-electronics-rental.png` | Tech & Electronics Rental | laptop + camera |
| `home-appliances-rental.png` | Home Appliances Rental | fridge + washing machine |
| `fashion-rental.png` | Fashion Rental | dress + handbag |
| `medical-equipment-rental.png` | Medical Equipment Rental | wheelchair |
| `party-events-rental.png` | Party & Events Rental | tent + balloons |
| `musical-instrument-rental.png` | Musical Instrument Rental | guitar |
| `agricultural-farming-equipment-rental.png` | Agricultural & Farming Equipment Rental | tractor |
| `property-rental.png` | Property Rental | house |
| `fitness-sports-rental.png` | Fitness & Sports Rental | dumbbell + bottle + mat |

`_spare-scooter.png` is kept but unused. It came from the client's first
(unnamed) batch and is what the Canva mockup shows in the Bike Rental hero, but
their named file for Bike Rental is the motorbike, so the motorbike is what the
site uses. To switch back, copy `_spare-scooter.png` over `bike-rental.png`.

## Image guidance

- **PNG with a transparent background** (the renders sit on the page's own
  lavender panel, so a baked-in white square will show as a hard edge).
- Square, **384×384** (they render between 44px and 176px, so this covers 2x
  displays). The supplied set was cut out, trimmed, squared and resized to this.
- Keep the client's artwork exactly as supplied — do not recolour, crop or
  stretch it. The site always scales it proportionally (`object-contain`).
- Keep each file under ~300 KB so category pages stay fast.

If a category's artwork has not arrived yet, that one category keeps the
built-in icon — the rest of the site is unaffected.

## Per-item override

An image uploaded for a single category in **Admin → Categories** wins over the
file in this folder, so the client can swap one icon without touching the code.
