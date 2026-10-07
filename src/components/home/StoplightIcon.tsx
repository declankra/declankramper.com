'use client'

// On hover the signal changes: red goes dark and green lights up — go see.
export default function StoplightIcon() {
  return (
    <div className="stoplight-icon-container inline-block">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="stoplight-icon"
      >
        {/* Housing */}
        <rect
          x="4.75"
          y="1"
          width="6.5"
          height="14"
          rx="2.25"
          stroke="currentColor"
          strokeWidth="1.4"
        />

        {/* Lenses, top to bottom: stop, wait, go */}
        <circle className="stoplight-lens lens-stop" cx="8" cy="4.6" r="1.35" fill="currentColor" />
        <circle className="stoplight-lens lens-wait" cx="8" cy="8" r="1.35" fill="currentColor" />
        <circle className="stoplight-lens lens-go" cx="8" cy="11.4" r="1.35" fill="currentColor" />
      </svg>

      <style jsx global>{`
        .stoplight-lens {
          opacity: 0.3;
          transition:
            opacity 150ms ease,
            fill 150ms ease;
        }

        .stoplight-lens.lens-stop {
          opacity: 1;
        }

        .stoplights-link:hover .lens-stop,
        .stoplights-link:active .lens-stop {
          opacity: 0.3;
        }

        .stoplights-link:hover .lens-go,
        .stoplights-link:active .lens-go {
          opacity: 1;
          fill: #30d158;
          transition-delay: 120ms;
        }
      `}</style>
    </div>
  )
}
