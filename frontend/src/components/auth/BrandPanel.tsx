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
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <circle cx="8" cy="12" r="2.5" />
      <path d="M14 9h4M14 12h4M14 15h2" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

// ── Book-style document cards ─────────────────────────────────────────────────
//
// Each card has three layers that give a bound-book / official-document feel:
//   1. Spine  — a narrow dark strip on the left edge (binding)
//   2. Cover  — a coloured letterhead area at the top
//   3. Pages  — a white ruled-paper body below
//
// rounded-lg (8px) keeps the document feel; rounded-2xl would look like plastic.

// Card A — Residence Card (leftmost, front)
function CardA() {
  return (
    <div className="flex w-44 overflow-hidden rounded-lg shadow-2xl rotate-[-7deg] relative z-30">
      {/* Spine */}
      <div className="w-2 shrink-0 bg-primary-900" />
      <div className="flex flex-1 flex-col">
        {/* Cover / letterhead */}
        <div className="bg-primary-800 px-3 pt-3 pb-2.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-primary-300"><IdCardIcon /></span>
            <span className="text-[8px] font-bold tracking-widest uppercase text-primary-300">
              Residence Card
            </span>
          </div>
          <p className="text-[11px] font-semibold text-white leading-tight">
            Ministry of Justice
          </p>
        </div>
        {/* Pages */}
        <div className="bg-white px-3 py-3 flex flex-col gap-2.5">
          <div>
            <p className="text-[8px] uppercase tracking-widest text-neutral-400 mb-0.5">Name</p>
            <p className="text-sm font-bold text-neutral-800">XXX</p>
          </div>
          <div className="h-px bg-neutral-100" />
          <div>
            <p className="text-[8px] uppercase tracking-widest text-neutral-400 mb-0.5">Status</p>
            <p className="text-xs text-neutral-600 leading-snug">SSW · Skilled Worker</p>
          </div>
          <div className="h-px bg-neutral-100" />
          <p className="text-[8px] text-neutral-400">Valid · 令和7年3月31日</p>
        </div>
      </div>
    </div>
  );
}

// Card B — City Hall Tax Notice (middle)
function CardB() {
  return (
    <div className="flex w-44 overflow-hidden rounded-lg shadow-2xl rotate-[4deg] relative z-20">
      {/* Spine */}
      <div className="w-2 shrink-0 bg-primary-800" />
      <div className="flex flex-1 flex-col">
        {/* Cover */}
        <div className="bg-primary-600 px-3 pt-3 pb-2.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-primary-200"><BankIcon /></span>
            <span className="text-[8px] font-bold tracking-widest uppercase text-primary-200">
              City Hall Notice
            </span>
          </div>
          <p className="text-[11px] font-semibold text-white leading-tight">
            Resident Tax · 住民税
          </p>
        </div>
        {/* Pages */}
        <div className="bg-white px-3 py-3 flex flex-col gap-2.5">
          <div>
            <p className="text-[8px] uppercase tracking-widest text-neutral-400 mb-0.5">Amount due</p>
            <p className="font-mono text-base font-bold text-neutral-800 leading-tight">¥ 48,200</p>
          </div>
          <div className="h-px bg-neutral-100" />
          <div>
            <p className="text-[8px] uppercase tracking-widest text-neutral-400 mb-1">Due date</p>
            <p className="text-xs text-neutral-600">2025年 6月 30日</p>
          </div>
          <span className="self-start inline-flex items-center rounded-full bg-secondary-100 px-2 py-0.5 text-[8px] font-semibold text-secondary-900">
            AI explained
          </span>
        </div>
      </div>
    </div>
  );
}

// Card C — Pension Notice (rightmost, partially clipped)
function CardC() {
  return (
    <div className="flex w-44 overflow-hidden rounded-lg shadow-2xl rotate-[-5deg] relative z-10">
      {/* Spine */}
      <div className="w-2 shrink-0 bg-secondary-800" />
      <div className="flex flex-1 flex-col">
        {/* Cover */}
        <div className="bg-secondary-600 px-3 pt-3 pb-2.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-secondary-200"><ShieldIcon /></span>
            <span className="text-[8px] font-bold tracking-widest uppercase text-secondary-200">
              Pension Notice
            </span>
          </div>
          <p className="text-[11px] font-semibold text-white leading-tight">
            Japan Pension Service
          </p>
        </div>
        {/* Pages */}
        <div className="bg-white px-3 py-3 flex flex-col gap-2.5">
          <div>
            <p className="text-[8px] uppercase tracking-widest text-neutral-400 mb-0.5">Contribution due</p>
            <p className="font-mono text-base font-bold text-neutral-800 leading-tight">¥ 16,520</p>
          </div>
          <div className="h-px bg-neutral-100" />
          <div>
            <p className="text-[8px] uppercase tracking-widest text-neutral-400 mb-1">Period</p>
            <p className="text-xs text-neutral-600">April · 2025</p>
          </div>
        </div>
      </div>
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
          Book cards sweep right → left across the panel.
          Container is wider than the panel so Card C's right edge is clipped
          by overflow-hidden, giving the "sliding in from the right" effect.
        */}
        <div className="flex flex-1 items-center justify-start">
          <div className="relative w-[540px] h-[310px]" aria-hidden="true">
            <div className="absolute top-10 left-0">
              <CardA />
            </div>
            <div className="absolute top-2 left-[155px]">
              <CardB />
            </div>
            <div className="absolute top-14 left-[310px]">
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

        {/* Reserve height for the absolutely-positioned skyline */}
        <div className="h-56 shrink-0" aria-hidden="true" />
      </div>

      {/* City skyline — flush at the very bottom, full width */}
      <div className="absolute bottom-0 left-0 right-0">
        <CitySkyline />
      </div>
    </div>
  );
}
