'use client'

export default function ReadmeIcon() {
  return (
    <div className="readme-icon-container inline-block mr-2">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="readme-icon"
      >
        {/* Document body */}
        <path
          className="doc-body"
          d="M3 2C3 1.44772 3.44772 1 4 1H10L13 4V14C13 14.5523 12.5523 15 12 15H4C3.44772 15 3 14.5523 3 14V2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Corner fold */}
        <path
          className="doc-fold"
          d="M10 1V4H13"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Text lines */}
        <line className="doc-line line-1" x1="5" y1="7" x2="11" y2="7" stroke="currentColor" strokeWidth="1" />
        <line className="doc-line line-2" x1="5" y1="9.5" x2="11" y2="9.5" stroke="currentColor" strokeWidth="1" />
        <line className="doc-line line-3" x1="5" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1" />
      </svg>

      <style jsx global>{`
        .readme-link:hover .doc-body,
        .readme-link:active .doc-body {
          animation: doc-wiggle 0.5s ease-in-out;
          transform-origin: center;
        }

        .readme-link:hover .doc-line,
        .readme-link:active .doc-line {
          animation: line-reveal 0.6s ease-out forwards;
        }

        .readme-link:hover .line-2,
        .readme-link:active .line-2 {
          animation-delay: 0.1s;
        }

        .readme-link:hover .line-3,
        .readme-link:active .line-3 {
          animation-delay: 0.2s;
        }

        @keyframes doc-wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }

        @keyframes line-reveal {
          0% { stroke-dasharray: 0 10; stroke-dashoffset: 0; }
          100% { stroke-dasharray: 10 0; stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  )
}
