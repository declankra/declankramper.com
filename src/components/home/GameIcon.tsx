'use client'

export default function GameIcon() {
  return (
    <div className="game-icon-container inline-block mr-2">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="game-icon"
      >
        {/* Controller outline */}
        <path
          className="controller-outline"
          d="M3 7.1C3 5.2 4.9 4.1 8 4.1C11.1 4.1 13 5.2 13 7.1C13 8.2 12.5 9 11.7 9.5C11.3 9.8 11.1 10.2 11 10.7C10.7 12.4 9.6 13.8 8.3 14C8.1 14 7.9 14 7.7 14C6.4 13.8 5.3 12.4 5 10.7C4.9 10.2 4.7 9.8 4.3 9.5C3.5 9 3 8.2 3 7.1Z"
          stroke="currentColor"
          strokeWidth="1.1"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Grip fills to emphasize hand holds */}
        <ellipse
          className="controller-grip"
          cx="4.6"
          cy="11.7"
          rx="2.0"
          ry="2.8"
          fill="#000"
          fillOpacity="0.35"
        />
        <ellipse
          className="controller-grip"
          cx="11.4"
          cy="11.7"
          rx="2.0"
          ry="2.8"
          fill="#000"
          fillOpacity="0.35"
        />
        {/* Inner cut between grips */}
        <path
          className="controller-detail"
          d="M6.5 10.6C7 11.2 7.5 11.4 8 11.4C8.5 11.4 9 11.2 9.5 10.6"
          stroke="currentColor"
          strokeWidth="0.9"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* D-pad */}
        <line
          x1="5.1"
          y1="6.6"
          x2="5.1"
          y2="8.1"
          stroke="#000"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <line
          x1="4.3"
          y1="7.35"
          x2="5.9"
          y2="7.35"
          stroke="#000"
          strokeWidth="0.9"
          strokeLinecap="round"
        />

        {/* Face buttons */}
        <circle className="controller-button" cx="10.8" cy="6.7" r="0.62" fill="#000" />
        <circle className="controller-button" cx="12.0" cy="7.6" r="0.62" fill="#000" />
      </svg>

      <style jsx global>{`
        .game-link:hover .game-icon,
        .game-link:active .game-icon {
          animation: button-press 0.15s ease-out forwards;
        }

        .game-link:hover .controller-outline,
        .game-link:active .controller-outline {
          stroke-width: 1.4;
        }

        @keyframes button-press {
          0% { transform: scale(1); }
          50% { transform: scale(0.85); }
          100% { transform: scale(0.92); }
        }
      `}</style>
    </div>
  )
}
