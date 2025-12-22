'use client'

export default function RandomIcon() {
  return (
    <div className="random-icon-container inline-block mr-2">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="random-icon"
      >
        {/* Shuffle arrows - two crossing paths */}
        {/* Top arrow going right */}
        <path
          className="shuffle-arrow arrow-top"
          d="M2 5H10L8 3M10 5L8 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Bottom arrow going left */}
        <path
          className="shuffle-arrow arrow-bottom"
          d="M14 11H6L8 9M6 11L8 13"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Crossing lines */}
        <path
          className="shuffle-cross"
          d="M3 11L13 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.4"
        />
      </svg>

      <style jsx global>{`
        .random-link:hover .arrow-top,
        .random-link:active .arrow-top {
          animation: slide-right 0.4s ease-in-out;
        }

        .random-link:hover .arrow-bottom,
        .random-link:active .arrow-bottom {
          animation: slide-left 0.4s ease-in-out;
        }

        .random-link:hover .shuffle-cross,
        .random-link:active .shuffle-cross {
          animation: cross-pulse 0.4s ease-in-out;
        }

        @keyframes slide-right {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(3px); }
        }

        @keyframes slide-left {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-3px); }
        }

        @keyframes cross-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}
