'use client'

export default function CoffeeIcon() {
  return (
    <div className="coffee-icon-container inline-block">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="coffee-icon"
      >
        {/* Espresso cup */}
        <path
          className="coffee-cup"
          d="M3 7H11V10.5C11 12.1569 9.65685 13.5 8 13.5H6C4.34315 13.5 3 12.1569 3 10.5V7Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Handle */}
        <path
          className="coffee-handle"
          d="M11 8H12C13.1046 8 14 8.89543 14 10C14 11.1046 13.1046 12 12 12H10.8"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Saucer */}
        <line className="coffee-saucer" x1="2" y1="15" x2="12" y2="15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />

        {/* Steam wisps */}
        <path className="coffee-steam steam-1" d="M5.5 4.5C5.5 3.5 6.5 3.5 6.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path className="coffee-steam steam-2" d="M8.5 4.5C8.5 3.5 9.5 3.5 9.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      </svg>

      <style jsx global>{`
        .coffee-steam {
          opacity: 0.5;
        }

        .coffee-link:hover .coffee-icon,
        .coffee-link:active .coffee-icon {
          animation: coffee-sip 0.5s ease-in-out;
          transform-origin: center bottom;
        }

        .coffee-link:hover .steam-1,
        .coffee-link:active .steam-1 {
          animation: steam-rise 1s ease-in-out infinite;
        }

        .coffee-link:hover .steam-2,
        .coffee-link:active .steam-2 {
          animation: steam-rise 1s ease-in-out 0.3s infinite;
        }

        @keyframes coffee-sip {
          0%, 100% { transform: rotate(0deg); }
          35% { transform: rotate(-8deg); }
          70% { transform: rotate(3deg); }
        }

        @keyframes steam-rise {
          0% { opacity: 0.2; transform: translateY(1px); }
          50% { opacity: 1; transform: translateY(-1px); }
          100% { opacity: 0.2; transform: translateY(-2.5px); }
        }
      `}</style>
    </div>
  )
}
