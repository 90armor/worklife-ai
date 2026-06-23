import { CitySkyline } from "./CitySkyline";

// ── Inline icons ──────────────────────────────────────────────────────────────

function CompassIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function IdCardIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <circle cx="8" cy="12" r="2.5" />
      <path d="M14 9h4M14 12h4M14 15h2" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="3" y1="22" x2="21" y2="22" />
      <line x1="6" y1="18" x2="6" y2="11" />
      <line x1="10" y1="18" x2="10" y2="11" />
      <line x1="14" y1="18" x2="14" y2="11" />
      <line x1="18" y1="18" x2="18" y2="11" />
      <polygon points="12 2 20 7 4 7" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

// ── Three floating document cards ─────────────────────────────────────────────

// Card A — Residence Card (leftmost, front layer)
function CardA() {
  return (
    <div className="w-56 rounded-2xl bg-white p-5 shadow-2xl rotate-[-7deg] relative z-30">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-primary-500"><IdCardIcon /></span>
        <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-primary-500">
          Residence Card
        </span>
      </div>
      <p className="text-xs text-neutral-400 leading-none mb-1">Name</p>
      <p className="text-base font-semibold text-neutral-800 leading-tight mb-4">XXX</p>
      <p className="text-xs text-neutral-400 leading-tight">Status of residence · SSW</p>
    </div>
  );
}

// Card B — City Hall Notice (middle layer)
function CardB() {
  return (
    <div className="w-56 rounded-2xl bg-primary-600 p-5 shadow-2xl rotate-[4deg] relative z-20">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-primary-300"><BankIcon /></span>
        <span className="text-xs text-primary-300 leading-none">City hall notice</span>
      </div>
      <p className="text-base font-semibold text-white mb-4">Resident tax</p>
      <p className="text-xs text-primary-300 leading-none mb-1">Amount due</p>
      <p className="font-mono text-xl font-bold text-white leading-tight mb-4">¥ 48,200</p>
      <span className="inline-flex items-center rounded-full bg-secondary-100 px-3 py-1 text-xs font-semibold text-secondary-900">
        AI explained
      </span>
    </div>
  );
}

// Card C — Pension Notice (rightmost, back layer, partially clipped)
function CardC() {
  return (
    <div className="w-56 rounded-2xl bg-secondary-600 p-5 shadow-2xl rotate-[-5deg] relative z-10">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-secondary-200"><ShieldIcon /></span>
        <span className="text-xs text-secondary-200 leading-none">Pension notice</span>
      </div>
      <p className="text-base font-semibold text-white mb-4">Japan Pension Service</p>
      <p className="text-xs text-secondary-200 leading-none mb-1">Contribution due</p>
      <p className="font-mono text-xl font-bold text-white leading-tight">¥ 16,520</p>
    </div>
  );
}

// ── Brand panel ───────────────────────────────────────────────────────────────

export function BrandPanel() {
  return (
    <div className="relative flex w-full flex-col overflow-hidden min-h-screen bg-[linear-gradient(160deg,#185FA5_0%,#0C447C_55%,#062645_100%)]">

      {/* All content at z-10, above the skyline base layer */}
      <div className="relative z-10 flex flex-1 flex-col px-10 pt-8 pb-0">

        {/* Logo — top left */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-white/20 text-white shrink-0">
            <CompassIcon />
          </div>
          <span className="text-base font-semibold text-white">WorkLife AI</span>
        </div>

        {/*
          Cards sweep right → left:
          Card C (right, clipped) · Card B (middle) · Card A (left, front).
          The container is wider than the panel so the right portion is cut
          by overflow-hidden, giving the "sliding in from the right" effect.
        */}
        <div className="flex flex-1 items-center justify-start">
          <div className="relative w-[580px] h-[300px]" aria-hidden="true">
            {/* Card A — front, leftmost */}
            <div className="absolute top-12 left-0">
              <CardA />
            </div>
            {/* Card B — middle */}
            <div className="absolute top-4 left-[170px]">
              <CardB />
            </div>
            {/* Card C — back, rightmost, partially clipped by panel edge */}
            <div className="absolute top-16 left-[340px]">
              <CardC />
            </div>
          </div>
        </div>

        {/* Headline + subtext — bottom left, above the skyline spacer */}
        <div className="shrink-0 mb-6">
          <p className="text-[1.6rem] font-semibold leading-tight text-white">
            Understand every<br />document
          </p>
          <p className="mt-3 text-sm leading-relaxed text-primary-200 max-w-[280px]">
            Tax notices, residence cards, and city hall letters — explained in your language.
          </p>
        </div>

        {/* Reserve space for the absolute skyline */}
        <div className="h-56 shrink-0" aria-hidden="true" />
      </div>

      {/* City skyline — flush at the very bottom, full width */}
      <div className="absolute bottom-0 left-0 right-0">
        <CitySkyline />
      </div>
    </div>
  );
}
