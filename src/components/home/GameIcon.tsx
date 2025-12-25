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
        <g className="die die-1">
          <rect
            x="1.2"
            y="6.1"
            width="7.2"
            height="7.2"
            rx="1.2"
            stroke="currentColor"
            strokeWidth="1.1"
            fill="none"
          />
          <circle cx="4.8" cy="9.7" r="0.75" fill="currentColor" />
        </g>

        <g className="die die-2">
          <rect
            x="7.1"
            y="1.1"
            width="7.2"
            height="7.2"
            rx="1.2"
            stroke="currentColor"
            strokeWidth="1.1"
            fill="none"
          />
          <circle cx="9.1" cy="3.1" r="0.7" fill="currentColor" />
          <circle cx="12.3" cy="3.1" r="0.7" fill="currentColor" />
          <circle cx="10.7" cy="4.7" r="0.7" fill="currentColor" />
          <circle cx="9.1" cy="6.3" r="0.7" fill="currentColor" />
          <circle cx="12.3" cy="6.3" r="0.7" fill="currentColor" />
        </g>
      </svg>

      <style jsx global>{`
        .game-link:hover .die,
        .game-link:active .die {
          animation: dice-roll 0.65s cubic-bezier(0.22, 0.61, 0.36, 1) both;
          transform-box: fill-box;
          transform-origin: center;
        }

        .game-link:hover .die-2,
        .game-link:active .die-2 {
          animation-delay: 0.06s;
        }

        @keyframes dice-roll {
          0% { transform: translate(0, 0) rotate(0deg); }
          35% { transform: translate(0.4px, -0.5px) rotate(140deg); }
          70% { transform: translate(-0.2px, 0.6px) rotate(280deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
