import React from 'react';

export default function RunIcon() {
  return (
    <div className="run-icon-container inline-block mr-2">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        className="run-icon"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Runner body */}
        <circle cx="12" cy="5" r="2" fill="currentColor" className="runner-head" />
        
        {/* Body */}
        <path
          d="M12 7V14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="runner-body"
        />
        
        {/* Arms */}
        <path
          d="M10 9L8 11M14 9L16 11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="runner-arms"
        />
        
        {/* Left leg */}
        <path
          d="M11 14L9 18L7 20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="runner-leg-left"
        />
        
        {/* Right leg */}
        <path
          d="M13 14L15 18L17 20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="runner-leg-right"
        />
        
        {/* Dust particles */}
        <circle cx="6" cy="19" r="0.5" fill="currentColor" className="dust-1" opacity="0" />
        <circle cx="4" cy="18" r="0.3" fill="currentColor" className="dust-2" opacity="0" />
        <circle cx="5" cy="20" r="0.4" fill="currentColor" className="dust-3" opacity="0" />
        <circle cx="3" cy="19" r="0.2" fill="currentColor" className="dust-4" opacity="0" />
      </svg>

      <style jsx global>{`
        .run-link:hover .runner-leg-left {
          animation: leg-run-left 600ms ease-in-out;
        }
        
        .run-link:hover .runner-leg-right {
          animation: leg-run-right 600ms ease-in-out;
        }
        
        .run-link:hover .runner-arms {
          animation: arms-swing 600ms ease-in-out;
        }
        
        .run-link:hover .dust-1 {
          animation: dust-appear 800ms ease-out 100ms;
        }
        
        .run-link:hover .dust-2 {
          animation: dust-appear 800ms ease-out 200ms;
        }
        
        .run-link:hover .dust-3 {
          animation: dust-appear 800ms ease-out 150ms;
        }
        
        .run-link:hover .dust-4 {
          animation: dust-appear 800ms ease-out 250ms;
        }

        @keyframes leg-run-left {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-15deg); }
          75% { transform: rotate(10deg); }
        }

        @keyframes leg-run-right {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(10deg); }
          75% { transform: rotate(-15deg); }
        }

        @keyframes arms-swing {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(5deg); }
        }

        @keyframes dust-appear {
          0% { opacity: 0; transform: translate(0, 0) scale(1); }
          30% { opacity: 0.7; transform: translate(-2px, -1px) scale(1.2); }
          100% { opacity: 0; transform: translate(-6px, -2px) scale(0.5); }
        }

        /* Mobile touch support */
        @media (hover: none) {
          .run-link:active .runner-leg-left {
            animation: leg-run-left 600ms ease-in-out;
          }
          
          .run-link:active .runner-leg-right {
            animation: leg-run-right 600ms ease-in-out;
          }
          
          .run-link:active .runner-arms {
            animation: arms-swing 600ms ease-in-out;
          }
          
          .run-link:active .dust-1,
          .run-link:active .dust-2,
          .run-link:active .dust-3,
          .run-link:active .dust-4 {
            animation: dust-appear 800ms ease-out;
          }
        }
      `}</style>
    </div>
  );
} 