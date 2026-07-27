'use client'

export default function ResumeIcon() {
  return (
    <div className="resume-icon-container inline-block">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="resume-icon"
      >
        {/* ID card body (landscape — distinct from ReadmeIcon's portrait doc) */}
        <rect
          className="card-body"
          x="1.5"
          y="3"
          width="13"
          height="10"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Portrait */}
        <circle className="card-photo" cx="5" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2" fill="none" />

        {/* Detail lines */}
        <line className="card-line card-line-1" x1="8.5" y1="6" x2="12.5" y2="6" stroke="currentColor" strokeWidth="1" />
        <line className="card-line card-line-2" x1="8.5" y1="8" x2="12.5" y2="8" stroke="currentColor" strokeWidth="1" />
        <line className="card-line card-line-3" x1="3.5" y1="10.75" x2="12.5" y2="10.75" stroke="currentColor" strokeWidth="1" />
      </svg>

      <style jsx global>{`
        .resume-link:hover .resume-icon,
        .resume-link:active .resume-icon {
          animation: card-present 0.5s ease-in-out;
          transform-origin: center bottom;
        }

        .resume-link:hover .card-photo,
        .resume-link:active .card-photo {
          animation: photo-pop 0.5s ease-in-out 0.1s;
          transform-origin: 5px 7px;
        }

        .resume-link:hover .card-line,
        .resume-link:active .card-line {
          animation: card-line-reveal 0.5s ease-out forwards;
        }

        .resume-link:hover .card-line-2,
        .resume-link:active .card-line-2 {
          animation-delay: 0.1s;
        }

        .resume-link:hover .card-line-3,
        .resume-link:active .card-line-3 {
          animation-delay: 0.2s;
        }

        @keyframes card-present {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          30% { transform: rotate(-4deg) translateY(-1.5px); }
          70% { transform: rotate(2deg) translateY(0); }
        }

        @keyframes photo-pop {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }

        @keyframes card-line-reveal {
          0% { stroke-dasharray: 0 12; }
          100% { stroke-dasharray: 12 0; }
        }
      `}</style>
    </div>
  )
}
