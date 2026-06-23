export function CitySkyline() {
  return (
    <svg
      viewBox="0 0 1200 200"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="w-full h-56 fill-primary-800 opacity-50 block"
    >
      {/* Left cluster */}
      <rect x="0" y="140" width="75" height="60" />
      <polygon points="0,140 75,140 37.5,113" />        {/* peak 1 */}

      <rect x="80" y="85" width="50" height="115" />
      <rect x="101" y="60" width="8" height="25" />
      <rect x="140" y="105" width="90" height="95" />
      <polygon points="140,105 230,105 185,73" />        {/* peak 2 */}

      {/* Left-center cluster */}
      <rect x="240" y="65" width="60" height="135" />
      <rect x="268" y="40" width="6" height="25" />
      <rect x="310" y="135" width="55" height="65" />
      <polygon points="310,135 365,135 337.5,108" />     {/* peak 3 */}

      <rect x="375" y="115" width="65" height="85" />

      {/* Central tower — flat top + antenna */}
      <rect x="455" y="45" width="55" height="155" />
      <rect x="477" y="15" width="9" height="30" />

      {/* Central-right cluster */}
      <rect x="525" y="100" width="50" height="100" />
      <rect x="585" y="125" width="70" height="75" />
      <polygon points="585,125 655,125 620,95" />        {/* peak 4 */}

      <rect x="665" y="80" width="60" height="120" />

      {/* Right-center cluster */}
      <rect x="735" y="120" width="95" height="80" />
      <polygon points="735,120 830,120 782.5,88" />      {/* peak 5 */}

      <rect x="845" y="70" width="50" height="130" />
      <rect x="867" y="48" width="6" height="22" />

      {/* Right cluster */}
      <rect x="908" y="115" width="65" height="85" />
      <rect x="985" y="135" width="55" height="65" />
      <rect x="1055" y="95" width="65" height="105" />
      <rect x="1130" y="120" width="70" height="80" />
      <polygon points="1130,120 1200,120 1165,90" />     {/* peak 6 */}
    </svg>
  );
}
