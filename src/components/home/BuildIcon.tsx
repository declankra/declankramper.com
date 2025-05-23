import React from 'react';

export default function BuildIcon() {
  return (
    <div className="build-icon-container inline-block mr-2">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        className="build-icon"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Center big block */}
        <rect
          x="10"
          y="14"
          width="4"
          height="4"
          rx="0.5"
          fill="currentColor"
          className="center-block"
        />
        
        {/* Left side blocks */}
        <rect
          x="4"
          y="16"
          width="3"
          height="3"
          rx="0.3"
          fill="currentColor"
          className="left-block-1"
        />
        <rect
          x="6"
          y="13"
          width="3"
          height="3"
          rx="0.3"
          fill="currentColor"
          className="left-block-2"
        />
        
        {/* Right side blocks */}
        <rect
          x="17"
          y="16"
          width="3"
          height="3"
          rx="0.3"
          fill="currentColor"
          className="right-block-1"
        />
        <rect
          x="15"
          y="13"
          width="3"
          height="3"
          rx="0.3"
          fill="currentColor"
          className="right-block-2"
        />
      </svg>

      <style jsx global>{`
        .build-link:hover .left-block-1 {
          animation: stack-left-1 2s ease-in-out;
        }
        
        .build-link:hover .left-block-2 {
          animation: stack-left-2 2s ease-in-out 0.2s;
        }
        
        .build-link:hover .right-block-1 {
          animation: stack-right-1 2s ease-in-out 0.4s;
        }
        
        .build-link:hover .right-block-2 {
          animation: stack-right-2 2s ease-in-out 0.6s;
        }
        
        .build-link:hover .center-block {
          animation: center-wobble 2s ease-in-out 0.8s;
        }

        @keyframes stack-left-1 {
          0% { transform: translate(0, 0); }
          20% { transform: translate(6px, -4px); }
          40% { transform: translate(6px, -4px); }
          60% { transform: translate(8px, -2px) rotate(15deg); }
          80% { transform: translate(10px, 0px) rotate(45deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }

        @keyframes stack-left-2 {
          0% { transform: translate(0, 0); }
          20% { transform: translate(4px, -7px); }
          40% { transform: translate(4px, -7px); }
          60% { transform: translate(6px, -5px) rotate(-10deg); }
          80% { transform: translate(8px, -3px) rotate(-30deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }

        @keyframes stack-right-1 {
          0% { transform: translate(0, 0); }
          20% { transform: translate(-6px, -4px); }
          40% { transform: translate(-6px, -4px); }
          60% { transform: translate(-8px, -2px) rotate(-15deg); }
          80% { transform: translate(-10px, 0px) rotate(-45deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }

        @keyframes stack-right-2 {
          0% { transform: translate(0, 0); }
          20% { transform: translate(-4px, -7px); }
          40% { transform: translate(-4px, -7px); }
          60% { transform: translate(-6px, -5px) rotate(10deg); }
          80% { transform: translate(-8px, -3px) rotate(30deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }

        @keyframes center-wobble {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          30% { transform: translate(0, -1px) rotate(-5deg); }
          60% { transform: translate(0, -1px) rotate(5deg); }
          80% { transform: translate(0, 0) rotate(-2deg); }
        }

        /* Mobile touch support */
        @media (hover: none) {
          .build-link:active .left-block-1 {
            animation: stack-left-1 2s ease-in-out;
          }
          
          .build-link:active .left-block-2 {
            animation: stack-left-2 2s ease-in-out 0.2s;
          }
          
          .build-link:active .right-block-1 {
            animation: stack-right-1 2s ease-in-out 0.4s;
          }
          
          .build-link:active .right-block-2 {
            animation: stack-right-2 2s ease-in-out 0.6s;
          }
          
          .build-link:active .center-block {
            animation: center-wobble 2s ease-in-out 0.8s;
          }
        }
      `}</style>
    </div>
  );
} 