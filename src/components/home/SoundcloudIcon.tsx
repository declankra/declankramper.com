'use client'

export default function SoundcloudIcon() {
  return (
    <div className="soundcloud-icon-container inline-block">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="soundcloud-icon"
      >
        {/* Waveform bars (soundcloud's signature left-side wave) */}
        <line className="sc-bar sc-bar-1" x1="2" y1="9" x2="2" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line className="sc-bar sc-bar-2" x1="4.5" y1="7.5" x2="4.5" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line className="sc-bar sc-bar-3" x1="7" y1="6" x2="7" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

        {/* Cloud shelf */}
        <path
          className="sc-cloud"
          d="M9.5 12H12.5C13.6046 12 14.5 11.1046 14.5 10C14.5 8.89543 13.6046 8 12.5 8C12.4 8 12.3 8.007 12.2 8.02C11.9 6.85 10.85 6 9.6 6C9.566 6 9.533 6.0007 9.5 6.002V12Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      <style jsx global>{`
        .soundcloud-link:hover .sc-bar-1,
        .soundcloud-link:active .sc-bar-1 {
          animation: sc-equalize 0.7s ease-in-out infinite;
          transform-origin: 2px 12px;
        }

        .soundcloud-link:hover .sc-bar-2,
        .soundcloud-link:active .sc-bar-2 {
          animation: sc-equalize 0.7s ease-in-out 0.12s infinite;
          transform-origin: 4.5px 12px;
        }

        .soundcloud-link:hover .sc-bar-3,
        .soundcloud-link:active .sc-bar-3 {
          animation: sc-equalize 0.7s ease-in-out 0.24s infinite;
          transform-origin: 7px 12px;
        }

        .soundcloud-link:hover .sc-cloud,
        .soundcloud-link:active .sc-cloud {
          animation: sc-drift 0.7s ease-in-out;
        }

        @keyframes sc-equalize {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.55); }
        }

        @keyframes sc-drift {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(0.8px); }
        }
      `}</style>
    </div>
  )
}
