# Color System

The palette is organized into four groups: brand primary, brand secondary, semantic status, and neutrals. Each color ramp runs from a light fill (50) to a dark text shade (800/900). When placing text on a colored background, always use the dark end of that same ramp — never plain black or generic gray.

## Brand — primary (Trust Blue)

Anchors navigation, primary actions, and links. Reads as institutional and dependable across cultures.

| Stop | Hex | Usage |
|------|-----|-------|
| 50 | `#E6F1FB` | Light backgrounds, info surfaces, avatar fills |
| 100 | `#B5D4F4` | Hover states on light surfaces |
| 200 | `#85B7EB` | Subtle borders, secondary button outlines |
| 400 | `#378ADD` | Accents, active icons |
| 600 | `#185FA5` | Primary buttons, links, key actions |
| 800 | `#0C447C` | Text on light blue fills |
| 900 | `#042C53` | Darkest text, high-emphasis labels |

## Brand — secondary (Growth Teal)

Progress, completed onboarding steps, and supportive accents. Signals welcome and forward motion.

| Stop | Hex | Usage |
|------|-----|-------|
| 50 | `#E1F5EE` | Progress track backgrounds, success-adjacent surfaces |
| 100 | `#9FE1CB` | Hover states |
| 200 | `#5DCAA5` | Borders, light accents |
| 400 | `#1D9E75` | Progress fills, completed indicators |
| 600 | `#0F6E56` | Strong teal actions, emphasis |
| 800 | `#085041` | Text on light teal fills |
| 900 | `#04342C` | Darkest teal text |

## Semantic — status

Status colors are load-bearing. Always pair with an icon and text label — never rely on color alone. Each example below uses a light fill with a colored left border and dark text from the same ramp.

| State | Fill | Border / accent | Text | Example |
|-------|------|-----------------|------|---------|
| Success | `#EAF3DE` | `#639922` | `#173404` | Document approved |
| Warning | `#FAEEDA` | `#BA7517` | `#412402` | Visa expiring soon |
| Error / urgent | `#FCEBEB` | `#E24B4A` | `#501313` | Action overdue |
| Info | `#E6F1FB` | `#378ADD` | `#042C53` | New message from advisor |

### Full semantic ramps

**Success (Green)**

| 50 | 100 | 200 | 400 | 600 | 800 | 900 |
|----|-----|-----|-----|-----|-----|-----|
| `#EAF3DE` | `#C0DD97` | `#97C459` | `#639922` | `#3B6D11` | `#27500A` | `#173404` |

**Warning (Amber)**

| 50 | 100 | 200 | 400 | 600 | 800 | 900 |
|----|-----|-----|-----|-----|-----|-----|
| `#FAEEDA` | `#FAC775` | `#EF9F27` | `#BA7517` | `#854F0B` | `#633806` | `#412402` |

**Error (Red)**

| 50 | 100 | 200 | 400 | 600 | 800 | 900 |
|----|-----|-----|-----|-----|-----|-----|
| `#FCEBEB` | `#F7C1C1` | `#F09595` | `#E24B4A` | `#A32D2D` | `#791F1F` | `#501313` |

**Info** reuses the Trust Blue primary ramp above.

## Neutrals (warm gray)

A warm gray ramp for text and surfaces. Warmer than a pure cool gray, which keeps the interface feeling human rather than clinical.

| Role | Hex | Usage |
|------|-----|-------|
| Surface | `#F1EFE8` | Page and card background surfaces |
| Border | `#D3D1C7` | Dividers, input borders |
| Muted | `#888780` | Hint text, disabled states, captions |
| Body | `#444441` | Body copy |
| Heading | `#2C2C2A` | Headings, high-emphasis text |

Additional ramp stops, lightest to darkest: `#F1EFE8` · `#D3D1C7` · `#B4B2A9` · `#888780` · `#5F5E5A` · `#444441` · `#2C2C2A`

## Usage rules

- **Text on colored fills** uses the 800 or 900 stop from the same ramp, never black or gray.
- **Primary actions** use Blue 600 (`#185FA5`) with white text.
- **Secondary actions** use a transparent background with a Blue 200 (`#85B7EB`) border and Blue 600 text.
- **Progress** uses Teal 400 (`#1D9E75`) on a Teal 50 (`#E1F5EE`) track.
- **Two brand colors maximum** in any single view, plus neutrals and whatever status color the context requires.
- Reserve red, amber, and green strictly for their semantic meanings. Do not use them decoratively.
