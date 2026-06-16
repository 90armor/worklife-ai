# Typography

Typography matters more than usual here because of multilingual rendering. The type system must handle Latin, Vietnamese diacritics, Cyrillic, and CJK scripts without breaking layouts or clipping stacked marks.

## Typeface

Use a typeface with broad script coverage and a generous x-height.

- **Recommended:** Inter or Noto Sans for Latin, Vietnamese, and Cyrillic.
- **CJK extension:** Noto Sans CJK (SC / TC / JP / KR) for Chinese, Japanese, and Korean.
- **Monospace:** for codes, reference numbers, and document IDs, use a monospace face (e.g. JetBrains Mono, Roboto Mono).

Avoid condensed faces and low-x-height fonts. Vietnamese in particular stacks diacritics above and below letters and needs vertical room to render cleanly.

## Type scale

| Token | Size | Weight | Line height | Usage |
|-------|------|--------|-------------|-------|
| Display | 28px | 500 | 1.3 | Page titles, onboarding headers |
| Heading 1 | 22px | 500 | 1.35 | Section titles |
| Heading 2 | 18px | 500 | 1.4 | Subsection titles |
| Heading 3 | 16px | 500 | 1.45 | Card titles, group labels |
| Body | 16px | 400 | 1.7 | Default body copy |
| Body small | 14px | 400 | 1.6 | Secondary text, captions |
| Caption | 13px | 400 | 1.5 | Hints, metadata, timestamps |

## Rules

- **Minimum body size is 16px.** Never set body text below 14px anywhere in the product.
- **Two weights only:** 400 regular and 500 medium. Heavier weights read as aggressive against a calm, institutional layout.
- **Sentence case** for all headings, labels, and buttons. No Title Case, no ALL CAPS — capitals reduce legibility for non-native readers and break some scripts entirely.
- **Line height of 1.7** for body text gives diacritics and CJK glyphs room to breathe.
- **Left-align** body text. Avoid justified text, which creates uneven spacing that hampers reading.
- **Limit line length** to roughly 60–75 characters for comfortable reading.

## Multilingual considerations

- Test every layout with the longest expected translation. German and Vietnamese strings often run 30–40% longer than English; leave room and avoid fixed-width text containers.
- Never embed text in images — it can't be translated or read by assistive technology.
- Support right-to-left (RTL) layouts if Arabic, Urdu, or Farsi are in scope. Use logical CSS properties (`margin-inline-start` rather than `margin-left`) so mirroring is automatic.
