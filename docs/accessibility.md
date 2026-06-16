# Accessibility

For this audience, accessibility is not a compliance checkbox — it directly affects whether someone can keep their immigration status current or miss a critical deadline. These rules are mandatory, not aspirational.

## Contrast

Target WCAG AA at minimum:

- **4.5:1** for body text and any text below 18px (or below 14px bold).
- **3:1** for large text (18px+ or 14px+ bold) and for UI components and graphical objects.

The neutral body (`#444441`) and heading (`#2C2C2A`) colors clear AA comfortably on light surfaces. On colored fills, always use the 800 or 900 stop from the same ramp to maintain contrast — never mid-tone text on a mid-tone fill.

### Verified pairings

| Foreground | Background | Ratio | Pass |
|------------|-----------|-------|------|
| `#042C53` (Blue 900) | `#E6F1FB` (Blue 50) | ~12:1 | AAA |
| `#185FA5` (Blue 600) | `#FFFFFF` | ~5.3:1 | AA |
| white | `#185FA5` (Blue 600) | ~5.3:1 | AA |
| `#173404` (Green 900) | `#EAF3DE` (Green 50) | ~11:1 | AAA |
| `#501313` (Red 900) | `#FCEBEB` (Red 50) | ~10:1 | AAA |
| `#444441` (Body) | `#FFFFFF` | ~8.9:1 | AAA |

Always re-verify pairings if you adjust any value. Use a contrast checker; do not eyeball it.

## Never rely on color alone

Roughly 1 in 12 men has some form of red–green color vision deficiency. A status that depends on hue alone — green "approved" versus red "overdue" — is invisible to them.

- Pair every status color with an **icon** and a **text label**.
- Use shape, position, and text — not just color — to distinguish states.
- Test the interface in grayscale. If meaning disappears, the design fails.

## Language and literacy

- Write in plain language. Short sentences, common words, active voice.
- Provide translations for all interface text and content, not just labels.
- Avoid idioms, jargon, and culture-specific metaphors that don't translate.
- Support text resizing up to 200% without breaking layout or clipping content.

## Keyboard and assistive technology

- Every interactive element is reachable and operable by keyboard.
- Visible focus indicators (2px focus ring) on all focusable elements.
- Semantic HTML and ARIA labels so screen readers announce controls correctly.
- Form fields have associated `<label>` elements, not just placeholder text.

## Motion and timing

- Respect `prefers-reduced-motion` — disable non-essential animation.
- Avoid time-limited interactions where possible. If a session must time out, warn early and allow extension. Users translating as they go need more time.

## Touch and motor

- 44×44px minimum touch targets with 8px spacing.
- Don't require precise gestures (pinch, drag) for essential actions; provide a simple tap alternative.
