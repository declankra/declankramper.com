'use client'

export default function MusicIcon() {
  return (
    <div className="music-icon-container inline-block mr-2">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="music-icon"
      >
        {/* Note stems */}
        <path
          className="note-stem stem-left"
          d="M8 5V15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          className="note-stem stem-right"
          d="M15 3V13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Note heads */}
        <circle className="note-head head-left" cx="6" cy="16.5" r="2.5" fill="currentColor" />
        <circle className="note-head head-right" cx="13" cy="14.5" r="2.5" fill="currentColor" />

        {/* Connecting beam */}
        <path
          className="note-beam"
          d="M8 6L15 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <style jsx global>{`
        .music-link:hover .music-icon,
        .music-link:active .music-icon {
          animation: music-bounce 0.6s ease-in-out;
          transform-origin: center;
        }

        .music-link:hover .head-left,
        .music-link:active .head-left {
          animation: note-pop 0.6s ease-in-out;
        }

        .music-link:hover .head-right,
        .music-link:active .head-right {
          animation: note-pop 0.6s ease-in-out 0.1s;
        }

        @keyframes music-bounce {
          0%, 100% { transform: translateY(0); }
          40% { transform: translateY(-2px); }
          70% { transform: translateY(1px); }
        }

        @keyframes note-pop {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
    </div>
  )
}
