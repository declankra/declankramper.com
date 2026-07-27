'use client'

export default function ReadmeIcon() {
  return (
    <div className="readme-icon-container inline-block">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="readme-icon"
      >
        {/* Terminal window */}
        <rect
          className="term-window"
          x="1.5"
          y="2.5"
          width="13"
          height="11"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.4"
          fill="none"
        />

        {/* Prompt chevron */}
        <path
          className="term-prompt"
          d="M4.5 6.5L7 8.5L4.5 10.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Cursor */}
        <line
          className="term-cursor"
          x1="9"
          y1="10.5"
          x2="11.5"
          y2="10.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>

      <style jsx global>{`
        .readme-link:hover .readme-icon,
        .readme-link:active .readme-icon {
          animation: term-pop 0.4s ease-in-out;
          transform-origin: center;
        }

        .readme-link:hover .term-prompt,
        .readme-link:active .term-prompt {
          animation: term-nudge 0.4s ease-out;
        }

        .readme-link:hover .term-cursor,
        .readme-link:active .term-cursor {
          animation: term-blink 0.9s steps(1) infinite;
        }

        @keyframes term-pop {
          0%, 100% { transform: scale(1); }
          40% { transform: scale(1.08); }
        }

        @keyframes term-nudge {
          0% { transform: translateX(-1.5px); opacity: 0.5; }
          100% { transform: translateX(0); opacity: 1; }
        }

        @keyframes term-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
