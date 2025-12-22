'use client'

export default function BizIcon() {
  return (
    <div className="biz-icon-container inline-block mr-2">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="biz-icon"
      >
        {/* Monitor frame */}
        <rect
          className="monitor-frame"
          x="3.5"
          y="4.5"
          width="17"
          height="11"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.8"
          fill="none"
        />

        {/* Screen */}
        <rect className="screen" x="5.5" y="6.5" width="13" height="7" rx="1" fill="transparent" />

        {/* Stand */}
        <rect className="stand" x="11" y="15.8" width="2" height="3" rx="0.8" fill="currentColor" />
        <rect className="base" x="8" y="19.2" width="8" height="1.8" rx="0.9" fill="currentColor" />

        {/* Power LED */}
        <circle className="power-led" cx="18" cy="14.6" r="0.8" fill="transparent" />
      </svg>

      <style jsx global>{`
        .screen {
          stroke: currentColor;
          stroke-width: 1.2;
          opacity: 0.25;
          transition: fill 180ms ease, opacity 180ms ease;
        }

        .power-led {
          opacity: 0.25;
          transition: fill 180ms ease, opacity 180ms ease;
        }

        .biz-link:hover .screen,
        .biz-link:active .screen {
          fill: currentColor;
          opacity: 0.8;
        }

        .biz-link:hover .power-led,
        .biz-link:active .power-led {
          fill: #22c55e;
          opacity: 1;
        }
      `}</style>
    </div>
  )
}
