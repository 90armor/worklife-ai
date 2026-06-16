# Components

Component patterns built on the color and type systems. All examples assume a mobile-first layout with generous spacing and large touch targets.

## Spacing scale

A consistent spacing scale keeps rhythm predictable. Use these steps for margins, padding, and gaps.

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight internal gaps |
| sm | 8px | Gaps between related elements |
| md | 12px | Component-internal padding |
| lg | 16px | Card padding, section gaps |
| xl | 24px | Between major sections |
| 2xl | 32px | Page-level vertical rhythm |

## Touch targets

- **Minimum 44×44px** for every interactive element. Many users are mobile-first with imprecise input.
- Keep at least 8px of spacing between adjacent tap targets.
- Prefer large, full-width buttons on mobile over compact desktop-style controls.

## Corner radius

| Token | Value | Usage |
|-------|-------|-------|
| md | 8px | Buttons, inputs, badges |
| lg | 12px | Cards, modals |
| pill | 999px | Progress tracks, tags |

## Buttons

**Primary** — main action on a screen.
- Background: Blue 600 `#185FA5`
- Text: white, 500 weight, 13–15px
- Padding: 9–12px vertical, full width on mobile
- Radius: 8px

**Secondary** — alternative or lower-emphasis action.
- Background: transparent
- Border: 0.5px Blue 200 `#85B7EB`
- Text: Blue 600 `#185FA5`

**Destructive** — only for irreversible actions.
- Background: Red 600 `#A32D2D`
- Text: white

One primary button per screen. Everything else is secondary or a plain link.

## Cards

- Background: white `#FFFFFF`
- Border: 0.5px neutral border `#D3D1C7`
- Radius: 12px
- Padding: 16–20px

Use cards for bounded objects: a worker profile, a document record, an onboarding step.

## Status banners

Each status uses a light fill, a 3px colored left border, an icon, and a text label. The icon and label ensure the meaning survives even when color can't be perceived.

| State | Fill | Border | Icon | Text color |
|-------|------|--------|------|-----------|
| Success | `#EAF3DE` | `#639922` | check-circle | `#173404` |
| Warning | `#FAEEDA` | `#BA7517` | alert-triangle | `#412402` |
| Error | `#FCEBEB` | `#E24B4A` | alert-circle | `#501313` |
| Info | `#E6F1FB` | `#378ADD` | info-circle | `#042C53` |

## Progress indicator

For multi-step onboarding flows:
- Track: Teal 50 `#E1F5EE`, 6px tall, pill radius
- Fill: Teal 400 `#1D9E75`
- Pair with a text label: "Step 3 of 5"

## Avatars

- Circular, 40px diameter
- Background: Blue 50 `#E6F1FB`
- Initials: Blue 600 `#185FA5`, 500 weight, 14px

## Forms

- Input height: minimum 44px
- Border: 0.5px neutral border, Blue 400 on focus with a 2px focus ring
- Label above the field, 14px, body color
- Helper and error text below, 13px
- Always show clear, specific error messages in the user's language — never rely on a red border alone
