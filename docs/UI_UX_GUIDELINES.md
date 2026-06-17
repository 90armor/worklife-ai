# UI/UX Guidelines

Design system for WorkLife AI — an AI-powered support platform for foreign workers in Japan. The audience is multilingual and mobile-first; every decision in this document reflects those constraints.

---

## Color System

The palette is organized into four groups: brand primary, brand secondary, semantic status, and neutrals. Each color ramp runs from a light fill (50) to a dark text shade (800/900). When placing text on a colored background, always use the dark end of that same ramp — never plain black or generic gray.

### Brand — primary (Trust Blue)

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

### Brand — secondary (Growth Teal)

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

### Semantic — status

Status colors are load-bearing. Always pair with an icon and text label — never rely on color alone. Each banner uses a light fill with a colored left border and dark text from the same ramp.

| State | Fill | Border / accent | Text |
|-------|------|-----------------|------|
| Success | `#EAF3DE` | `#639922` | `#173404` |
| Warning | `#FAEEDA` | `#BA7517` | `#412402` |
| Error / urgent | `#FCEBEB` | `#E24B4A` | `#501313` |
| Info | `#E6F1FB` | `#378ADD` | `#042C53` |

**Full semantic ramps**

Success (Green): `#EAF3DE` · `#C0DD97` · `#97C459` · `#639922` · `#3B6D11` · `#27500A` · `#173404`

Warning (Amber): `#FAEEDA` · `#FAC775` · `#EF9F27` · `#BA7517` · `#854F0B` · `#633806` · `#412402`

Error (Red): `#FCEBEB` · `#F7C1C1` · `#F09595` · `#E24B4A` · `#A32D2D` · `#791F1F` · `#501313`

Info reuses the Trust Blue primary ramp.

### Neutrals (warm gray)

A warm gray ramp for text and surfaces. Warmer than pure cool gray, which keeps the interface feeling human rather than clinical.

| Role | Hex | Usage |
|------|-----|-------|
| Surface | `#F1EFE8` | Page and card background surfaces |
| Border | `#D3D1C7` | Dividers, input borders |
| Muted | `#888780` | Hint text, disabled states, captions |
| Body | `#444441` | Body copy |
| Heading | `#2C2C2A` | Headings, high-emphasis text |

Additional ramp stops, lightest to darkest: `#F1EFE8` · `#D3D1C7` · `#B4B2A9` · `#888780` · `#5F5E5A` · `#444441` · `#2C2C2A`

### Color usage rules

- Text on colored fills uses the 800 or 900 stop from the same ramp, never black or gray.
- Primary actions use Blue 600 (`#185FA5`) with white text.
- Secondary actions use a transparent background with a Blue 200 (`#85B7EB`) border and Blue 600 text.
- Progress uses Teal 400 (`#1D9E75`) on a Teal 50 (`#E1F5EE`) track.
- Two brand colors maximum in any single view, plus neutrals and whatever status color the context requires.
- Reserve red, amber, and green strictly for their semantic meanings — never decoratively.

---

## Typography

Typography matters more than usual here because of multilingual rendering. The type system must handle Latin, Vietnamese diacritics, Cyrillic, and CJK scripts without breaking layouts or clipping stacked marks.

### Typeface

- **Latin, Vietnamese, Cyrillic:** Inter or Noto Sans
- **CJK extension:** Noto Sans CJK (SC / TC / JP / KR)
- **Monospace** (codes, reference numbers, document IDs): JetBrains Mono or Roboto Mono

Avoid condensed faces and low-x-height fonts. Vietnamese stacks diacritics above and below letters and needs vertical room to render cleanly.

### Type scale

| Token | Size | Weight | Line height | Usage |
|-------|------|--------|-------------|-------|
| Display | 28px | 500 | 1.3 | Page titles, onboarding headers |
| Heading 1 | 22px | 500 | 1.35 | Section titles |
| Heading 2 | 18px | 500 | 1.4 | Subsection titles |
| Heading 3 | 16px | 500 | 1.45 | Card titles, group labels |
| Body | 16px | 400 | 1.7 | Default body copy |
| Body small | 14px | 400 | 1.6 | Secondary text, captions |
| Caption | 13px | 400 | 1.5 | Hints, metadata, timestamps |

### Typography rules

- Minimum body size is 16px. Never set body text below 14px anywhere in the product.
- Two weights only: 400 regular and 500 medium. Heavier weights read as aggressive against a calm, institutional layout.
- Sentence case for all headings, labels, and buttons. No Title Case, no ALL CAPS.
- Line height of 1.7 for body text gives diacritics and CJK glyphs room to breathe.
- Left-align body text. Avoid justified text — uneven spacing hampers reading for non-native readers.
- Limit line length to roughly 60–75 characters.

### Multilingual considerations

- Test every layout with the longest expected translation. German and Vietnamese strings often run 30–40% longer than English; avoid fixed-width text containers.
- Never embed text in images — it cannot be translated or read by assistive technology.
- Use logical CSS properties (`margin-inline-start` rather than `margin-left`) so RTL mirroring is automatic if Arabic, Urdu, or Farsi are added in scope.

---

## Spacing, Radius, and Touch Targets

### Spacing scale

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight internal gaps |
| sm | 8px | Gaps between related elements |
| md | 12px | Component-internal padding |
| lg | 16px | Card padding, section gaps |
| xl | 24px | Between major sections |
| 2xl | 32px | Page-level vertical rhythm |

### Corner radius

| Token | Value | Usage |
|-------|-------|-------|
| md | 8px | Buttons, inputs, badges |
| lg | 12px | Cards, modals |
| pill | 999px | Progress tracks, tags |

### Touch targets

- Minimum 44×44px for every interactive element.
- Keep at least 8px of spacing between adjacent tap targets.
- Prefer large, full-width buttons on mobile over compact desktop-style controls.

---

## Components

### Sidebar

A collapsible navigation panel for the chat interface. Implemented in `frontend/src/components/Sidebar.tsx`.

**Layout**

| State | Width | Breakpoint |
|-------|-------|-----------|
| Expanded | 260px | md+ (desktop) |
| Collapsed (icon rail) | 60px | md+ (desktop) |
| Mobile overlay | 260px, slides in from left | below md |

The sidebar is `position: fixed`, full viewport height. Main content shifts right with `margin-left` equal to the sidebar width; both values animate together via `transition-[width,transform]` and `transition-[margin]` at `300ms ease-in-out`.

**Sections**

1. **Header** — Logo mark (32×32px, Blue 600, rounded-md) + brand name + desktop toggle chevron + mobile close chevron.
2. **New Chat button** — Full-width primary button (Blue 600) when expanded; square icon-only (`w-9 h-9`) when collapsed. Links to `/chat`.
3. **Search** — Hidden (opacity-0, max-height 0) in collapsed state. Filters the conversation list client-side.
4. **Conversation list** — Scrollable, grouped into "Today", "Yesterday", and "Previous 7 days" labels (11px, uppercase, tracked). Each item is a full-width link with truncated title. Active item gets `bg-primary-50` fill and `text-primary-800`. In collapsed state the list is replaced by two icon buttons (chat bubble + search) that expand the sidebar on click.
5. **User profile** — Avatar (32px circle, Blue 50 background, initials in Blue 600) + name + caption. Clicking opens a dropdown with Settings (links to `/profile`) and Sign out. In collapsed state the name is hidden; the dropdown anchors from the avatar.

**Context API** — `SidebarProvider` wraps the chat layout. Any child component can call `useSidebar()` to read `isCollapsed`, `isMobileOpen`, or call `toggleCollapsed`, `openMobile`, `closeMobile`.

**Mobile** — A `SidebarMobileToggle` button (hamburger icon) is rendered in the mobile top bar inside the chat layout header. Tapping opens the sidebar overlay; a dark backdrop (`bg-black/40`, `backdrop-blur-[2px]`) closes it on click.

**Usage**

```tsx
// Chat layout wraps the page with sidebar context
import { Sidebar, SidebarProvider, SidebarMobileToggle, useSidebar } from "@/components/Sidebar";

// Access state anywhere inside SidebarProvider
const { isCollapsed, toggleCollapsed } = useSidebar();
```

**Accessibility**
- `<aside aria-label="Chat navigation">` wraps the panel.
- `<nav aria-label="Recent conversations">` wraps the conversation list.
- All interactive elements have visible focus rings (`ring-2 ring-primary-400`).
- Backdrop has `aria-hidden="true"`.
- User menu button has `aria-haspopup` and `aria-expanded`.
- `prefers-reduced-motion` handled globally via the existing CSS rule in `globals.css`.

---

### Buttons

**Primary** — main action on a screen (one per screen maximum).
- Background: Blue 600 `#185FA5`, text: white, weight 500, 13–15px
- Padding: 9–12px vertical, full width on mobile, radius 8px

**Secondary** — alternative or lower-emphasis action.
- Background: transparent, border: 0.5px Blue 200 `#85B7EB`, text: Blue 600 `#185FA5`

**Destructive** — only for irreversible actions.
- Background: Red 600 `#A32D2D`, text: white

### Cards

- Background: white `#FFFFFF`
- Border: 0.5px neutral border `#D3D1C7`
- Radius: 12px, padding: 16–20px

Use cards for bounded objects: a worker profile, a document record, an onboarding step.

### Status banners

Each status uses a light fill, a 3px colored left border, an icon, and a text label. The icon and label ensure meaning survives when color cannot be perceived.

| State | Fill | Border | Icon | Text color |
|-------|------|--------|------|-----------|
| Success | `#EAF3DE` | `#639922` | check-circle | `#173404` |
| Warning | `#FAEEDA` | `#BA7517` | alert-triangle | `#412402` |
| Error | `#FCEBEB` | `#E24B4A` | alert-circle | `#501313` |
| Info | `#E6F1FB` | `#378ADD` | info-circle | `#042C53` |

### Progress indicator

For multi-step onboarding flows:
- Track: Teal 50 `#E1F5EE`, 6px tall, pill radius
- Fill: Teal 400 `#1D9E75`
- Pair with a text label: "Step 3 of 5"

### Avatars

- Circular, 40px diameter
- Background: Blue 50 `#E6F1FB`
- Initials: Blue 600 `#185FA5`, weight 500, 14px

### Forms

- Input height: minimum 44px
- Border: 0.5px neutral border; Blue 400 on focus with a 2px focus ring
- Label above the field, 14px, body color
- Helper and error text below the field, 13px
- Always show clear, specific error messages in the user's language — never rely on a red border alone

---

## Design Tokens

### CSS variables

Add to `frontend/src/app/globals.css`:

```css
:root {
  /* Brand — Trust Blue */
  --color-primary-50: #E6F1FB;
  --color-primary-100: #B5D4F4;
  --color-primary-200: #85B7EB;
  --color-primary-400: #378ADD;
  --color-primary-600: #185FA5;
  --color-primary-800: #0C447C;
  --color-primary-900: #042C53;

  /* Brand — Growth Teal */
  --color-secondary-50: #E1F5EE;
  --color-secondary-100: #9FE1CB;
  --color-secondary-200: #5DCAA5;
  --color-secondary-400: #1D9E75;
  --color-secondary-600: #0F6E56;
  --color-secondary-800: #085041;
  --color-secondary-900: #04342C;

  /* Semantic — Success */
  --color-success-50: #EAF3DE;
  --color-success-600: #639922;
  --color-success-900: #173404;

  /* Semantic — Warning */
  --color-warning-50: #FAEEDA;
  --color-warning-600: #BA7517;
  --color-warning-900: #412402;

  /* Semantic — Error */
  --color-error-50: #FCEBEB;
  --color-error-400: #E24B4A;
  --color-error-600: #A32D2D;
  --color-error-900: #501313;

  /* Semantic — Info (reuses primary) */
  --color-info-50: #E6F1FB;
  --color-info-600: #378ADD;
  --color-info-900: #042C53;

  /* Neutrals — warm gray */
  --color-surface: #F1EFE8;
  --color-border: #D3D1C7;
  --color-muted: #888780;
  --color-body: #444441;
  --color-heading: #2C2C2A;
  --color-white: #FFFFFF;

  /* Radius */
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-pill: 999px;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 24px;
  --space-2xl: 32px;

  /* Typography */
  --font-sans: 'Inter', 'Noto Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

### Tailwind config

Extend `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F1FB', 100: '#B5D4F4', 200: '#85B7EB',
          400: '#378ADD', 600: '#185FA5', 800: '#0C447C', 900: '#042C53',
        },
        secondary: {
          50: '#E1F5EE', 100: '#9FE1CB', 200: '#5DCAA5',
          400: '#1D9E75', 600: '#0F6E56', 800: '#085041', 900: '#04342C',
        },
        success: { 50: '#EAF3DE', 600: '#639922', 900: '#173404' },
        warning: { 50: '#FAEEDA', 600: '#BA7517', 900: '#412402' },
        error:   { 50: '#FCEBEB', 400: '#E24B4A', 600: '#A32D2D', 900: '#501313' },
        info:    { 50: '#E6F1FB', 600: '#378ADD', 900: '#042C53' },
        surface: '#F1EFE8',
        'neutral-border': '#D3D1C7',
        muted: '#888780',
        body: '#444441',
        heading: '#2C2C2A',
      },
      borderRadius: { md: '8px', lg: '12px', pill: '999px' },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
};
```

### Usage examples

```jsx
// Primary button
<button className="bg-primary-600 text-white rounded-md px-4 py-3 font-medium">
  Continue
</button>

// Status banner — warning
<div className="bg-warning-50 border-l-4 border-warning-600 text-warning-900 p-3 rounded-md flex items-center gap-2">
  <AlertTriangleIcon />
  <span>Visa expiring soon</span>
</div>

// Progress bar
<div className="h-1.5 bg-secondary-50 rounded-pill overflow-hidden">
  <div className="h-full bg-secondary-400" style={{ width: '60%' }} />
</div>
```

---

## Theme Modes

Three modes are supported:

- **System** (default) — follows the OS `prefers-color-scheme` setting automatically.
- **Light** — always light, regardless of OS setting.
- **Dark** — always dark, regardless of OS setting.

The user's choice is persisted in `localStorage` under the key `theme` (`"light"` | `"dark"` | `"system"`). The resolved value is applied as a `data-theme` attribute on `<html>`.

### Dark mode palette

Dark surfaces use warm dark grays, not cold blue-blacks. This keeps the interface feeling human and consistent with the warm neutral ramp used in light mode.

**Surfaces and text**

| Role | Light | Dark |
|------|-------|------|
| Page background | `#F1EFE8` | `#1C1B18` |
| Card / raised surface | `#FFFFFF` | `#272520` |
| Border | `#D3D1C7` | `#3A3837` |
| Muted text | `#888780` | `#6B6A64` |
| Body text | `#444441` | `#C8C6BE` |
| Heading text | `#2C2C2A` | `#F1EFE8` |

**Brand on dark**

Primary buttons stay Blue 600 `#185FA5` — white text on that background clears AA (5.3:1) in both modes. Links and active icons shift to Blue 400 `#378ADD` for better visibility against dark surfaces.

**Status banners on dark**

Dark fills with the same border accent; text uses the light end of each ramp.

| State | Fill | Border | Text |
|-------|------|--------|------|
| Success | `#0D2B05` | `#639922` | `#C0DD97` |
| Warning | `#2B1600` | `#EF9F27` | `#FAC775` |
| Error | `#2B0808` | `#E24B4A` | `#F7C1C1` |
| Info | `#062645` | `#378ADD` | `#B5D4F4` |

### Updated CSS variables

Replace the neutral and semantic surface tokens in `globals.css` with mode-aware overrides. Raw palette stops (primary-50 through primary-900, etc.) stay in `:root` unchanged.

```css
/* Semantic tokens — light (default) */
:root,
[data-theme="light"] {
  --color-surface: #F1EFE8;
  --color-surface-raised: #FFFFFF;
  --color-border: #D3D1C7;
  --color-muted: #888780;
  --color-body: #444441;
  --color-heading: #2C2C2A;

  --color-success-fill: #EAF3DE;
  --color-success-border: #639922;
  --color-success-text: #173404;

  --color-warning-fill: #FAEEDA;
  --color-warning-border: #BA7517;
  --color-warning-text: #412402;

  --color-error-fill: #FCEBEB;
  --color-error-border: #E24B4A;
  --color-error-text: #501313;

  --color-info-fill: #E6F1FB;
  --color-info-border: #378ADD;
  --color-info-text: #042C53;

  --color-link: #185FA5;
}

/* Semantic tokens — dark */
/* System mode: apply when OS is dark and no explicit override */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-surface: #1C1B18;
    --color-surface-raised: #272520;
    --color-border: #3A3837;
    --color-muted: #6B6A64;
    --color-body: #C8C6BE;
    --color-heading: #F1EFE8;

    --color-success-fill: #0D2B05;
    --color-success-border: #639922;
    --color-success-text: #C0DD97;

    --color-warning-fill: #2B1600;
    --color-warning-border: #EF9F27;
    --color-warning-text: #FAC775;

    --color-error-fill: #2B0808;
    --color-error-border: #E24B4A;
    --color-error-text: #F7C1C1;

    --color-info-fill: #062645;
    --color-info-border: #378ADD;
    --color-info-text: #B5D4F4;

    --color-link: #378ADD;
  }
}

/* Explicit dark mode */
[data-theme="dark"] {
  --color-surface: #1C1B18;
  --color-surface-raised: #272520;
  --color-border: #3A3837;
  --color-muted: #6B6A64;
  --color-body: #C8C6BE;
  --color-heading: #F1EFE8;

  --color-success-fill: #0D2B05;
  --color-success-border: #639922;
  --color-success-text: #C0DD97;

  --color-warning-fill: #2B1600;
  --color-warning-border: #EF9F27;
  --color-warning-text: #FAC775;

  --color-error-fill: #2B0808;
  --color-error-border: #E24B4A;
  --color-error-text: #F7C1C1;

  --color-info-fill: #062645;
  --color-info-border: #378ADD;
  --color-info-text: #B5D4F4;

  --color-link: #378ADD;
}
```

### Tailwind config update

Enable class-based dark mode so Tailwind's `dark:` variants respond to the `data-theme` attribute:

```js
module.exports = {
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      // existing theme config...
      colors: {
        // Add CSS-variable-backed semantic tokens alongside the existing palette:
        surface: 'var(--color-surface)',
        'surface-raised': 'var(--color-surface-raised)',
        border: 'var(--color-border)',
        muted: 'var(--color-muted)',
        body: 'var(--color-body)',
        heading: 'var(--color-heading)',
        link: 'var(--color-link)',
      },
    },
  },
};
```

Use the semantic tokens for all surfaces and text so dark mode is applied globally without per-component `dark:` overrides:

```jsx
// Page wrapper — background adapts automatically
<main className="min-h-screen bg-surface text-body">

// Card — raised surface
<div className="bg-surface-raised border border-neutral-border rounded-lg p-4">

// Status banner using CSS-variable tokens
<div style={{
  background: 'var(--color-warning-fill)',
  borderLeft: '3px solid var(--color-warning-border)',
  color: 'var(--color-warning-text)',
}} className="p-3 rounded-md flex items-center gap-2">
  <AlertTriangleIcon />
  <span>Visa expiring soon</span>
</div>
```

### Next.js theme provider

Add to `frontend/src/app/layout.tsx` — applies the saved theme before first paint to prevent a flash of wrong theme:

```tsx
// Inline script in <head> — runs synchronously before hydration
const themeScript = `
  (function() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      document.documentElement.setAttribute('data-theme', saved);
    }
    // 'system' or unset: no attribute — CSS media query handles it
  })();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

Theme toggle hook:

```ts
// hooks/useTheme.ts
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const saved = (localStorage.getItem('theme') as Theme) ?? 'system';
    setTheme(saved);
  }, []);

  function applyTheme(next: Theme) {
    setTheme(next);
    localStorage.setItem('theme', next);
    if (next === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', next);
    }
  }

  return { theme, setTheme: applyTheme };
}
```

### Theme toggle UI

The toggle must expose all three options: Light, Dark, System. A segmented control or dropdown works well. Always label the options with text (not just icons) so the meaning survives in all languages.

```tsx
const options: { value: Theme; label: string }[] = [
  { value: 'light',  label: 'Light'  },
  { value: 'dark',   label: 'Dark'   },
  { value: 'system', label: 'System' },
];
```

Place the toggle in the user's profile settings, not as a floating button on every page.

### Contrast in dark mode

Verify every text/background pairing in dark mode against WCAG AA. Verified dark pairings:

| Foreground | Background | Ratio | Pass |
|------------|-----------|-------|------|
| `#F1EFE8` (Heading) | `#1C1B18` (Surface) | ~14:1 | AAA |
| `#C8C6BE` (Body) | `#1C1B18` (Surface) | ~9:1 | AAA |
| white | `#185FA5` (Blue 600, button) | ~5.3:1 | AA |
| `#378ADD` (Blue 400, link) | `#1C1B18` (Surface) | ~5.1:1 | AA |
| `#C0DD97` (Success text) | `#0D2B05` (Success fill) | ~8:1 | AAA |
| `#FAC775` (Warning text) | `#2B1600` (Warning fill) | ~7:1 | AAA |
| `#F7C1C1` (Error text) | `#2B0808` (Error fill) | ~7.5:1 | AAA |

---

## Accessibility

For this audience, accessibility is not a compliance checkbox — it directly affects whether someone can keep their immigration status current or miss a critical deadline. These rules are mandatory.

### Contrast

Target WCAG AA at minimum:

- **4.5:1** for body text and any text below 18px (or below 14px bold).
- **3:1** for large text (18px+ or 14px+ bold) and for UI components and graphical objects.

The neutral body (`#444441`) and heading (`#2C2C2A`) colors clear AA comfortably on light surfaces. On colored fills, always use the 800 or 900 stop from the same ramp — never mid-tone text on a mid-tone fill.

**Verified pairings**

| Foreground | Background | Ratio | Pass |
|------------|-----------|-------|------|
| `#042C53` (Blue 900) | `#E6F1FB` (Blue 50) | ~12:1 | AAA |
| `#185FA5` (Blue 600) | `#FFFFFF` | ~5.3:1 | AA |
| white | `#185FA5` (Blue 600) | ~5.3:1 | AA |
| `#173404` (Green 900) | `#EAF3DE` (Green 50) | ~11:1 | AAA |
| `#501313` (Red 900) | `#FCEBEB` (Red 50) | ~10:1 | AAA |
| `#444441` (Body) | `#FFFFFF` | ~8.9:1 | AAA |

Always re-verify pairings if you adjust any value. Use a contrast checker; do not eyeball it.

### Never rely on color alone

Roughly 1 in 12 men has some form of red–green color vision deficiency.

- Pair every status color with an icon and a text label.
- Use shape, position, and text — not just color — to distinguish states.
- Test the interface in grayscale. If meaning disappears, the design fails.

### Language and literacy

- Write in plain language: short sentences, common words, active voice.
- Provide translations for all interface text and content, not just labels.
- Avoid idioms, jargon, and culture-specific metaphors that don't translate.
- Support text resizing up to 200% without breaking layout or clipping content.

### Keyboard and assistive technology

- Every interactive element is reachable and operable by keyboard.
- Visible focus indicators (2px focus ring) on all focusable elements.
- Semantic HTML and ARIA labels so screen readers announce controls correctly.
- Form fields have associated `<label>` elements, not just placeholder text.

### Motion and timing

- Respect `prefers-reduced-motion` — disable non-essential animation.
- Avoid time-limited interactions where possible. If a session must time out, warn early and allow extension. Users translating as they go need more time.

### Touch and motor

- 44×44px minimum touch targets with 8px spacing between targets.
- Don't require precise gestures (pinch, drag) for essential actions; always provide a simple tap alternative.
