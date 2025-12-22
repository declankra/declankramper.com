import React from 'react';

export default function WriteIcon() {
  return (
    <div className="write-icon-container inline-block mr-2">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        className="write-icon"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Pencil body - simple thick line */}
        <path
          d="M15 8L21 2"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="pencil-body"
        />
        
        {/* Pencil tip */}
        <circle
          cx="21"
          cy="2"
          r="1.5"
          fill="currentColor"
          className="pencil-tip"
        />
        
        {/* Eraser - simple circle at the other end */}
        <circle
          cx="15"
          cy="8"
          r="1.5"
          fill="#ff6b6b"
          className="pencil-eraser"
        />
        
        {/* Scribble line that appears on hover */}
        <path
          d="M4 15C6 14 8 16 10 15C12 14 14 16 16 15"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="scribble-line"
          strokeDasharray="15"
          strokeDashoffset="15"
        />
      </svg>

      <style jsx global>{`
        .write-icon {
          transform: translateY(5px);
        }

        .write-link:hover .pencil-body,
        .write-link:hover .pencil-tip,
        .write-link:hover .pencil-eraser {
          animation: pencil-wobble 600ms ease-in-out;
        }
        
        .write-link:hover .scribble-line {
          animation: scribble-draw 800ms ease-out;
        }

        @keyframes pencil-wobble {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-0.5px, 0.5px) rotate(-2deg); }
          50% { transform: translate(0.5px, -0.5px) rotate(2deg); }
          75% { transform: translate(-0.3px, 0.3px) rotate(-1deg); }
        }

        @keyframes scribble-draw {
          0% { stroke-dashoffset: 15; opacity: 0; }
          10% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }

        /* Mobile touch support */
        @media (hover: none) {
          .write-link:active .pencil-body,
          .write-link:active .pencil-tip,
          .write-link:active .pencil-eraser {
            animation: pencil-wobble 600ms ease-in-out;
          }
          
          .write-link:active .scribble-line {
            animation: scribble-draw 800ms ease-out;
          }
        }
      `}</style>
    </div>
  );
} 
