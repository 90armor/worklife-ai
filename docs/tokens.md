# Design Tokens

Ready-to-use tokens for the Next.js frontend. Copy the CSS variables into a global stylesheet, or use the Tailwind config to expose them as utility classes.

## CSS variables

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
  --color-error-400: #E24B4A;  /* status banner border */
  --color-error-600: #A32D2D;  /* destructive button background */
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

## Tailwind config

For Tailwind, extend `tailwind.config.js`:

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

## Usage examples

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
