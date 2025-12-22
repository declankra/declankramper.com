'use client'

export default function ContactIcon() {
  return (
    <div className="contact-icon-container inline-block mr-2">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="contact-icon"
      >
        {/* Envelope body */}
        <rect
          className="envelope-body"
          x="3"
          y="6"
          width="18"
          height="12"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.8"
          fill="none"
        />

        {/* Envelope flap */}
        <path
          className="envelope-flap"
          d="M4 7L12 13L20 7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Paper airplane */}
        <path
          className="paper-plane"
          d="M3.5 11.5L20.5 3.5L13.5 20.5L11 13L3.5 11.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Wind lines */}
        <path
          className="wind-line wind-line-1"
          d="M2.5 13.5H7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          className="wind-line wind-line-2"
          d="M3.5 16.5H7.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>

      <style jsx global>{`
        .envelope-flap {
          transform-box: fill-box;
          transform-origin: 50% 100%;
          transition: transform 220ms cubic-bezier(0.2, 0.7, 0.2, 1);
        }

        .envelope-body {
          transition: transform 220ms cubic-bezier(0.2, 0.7, 0.2, 1);
        }

        .paper-plane {
          opacity: 0;
          transform: translateX(-2px) translateY(2px) scale(0.9);
          transform-origin: 50% 50%;
          transition:
            opacity 180ms ease,
            transform 220ms cubic-bezier(0.2, 0.7, 0.2, 1);
        }

        .wind-line {
          opacity: 0;
          transform: translateX(-3px);
          transition:
            opacity 160ms ease,
            transform 220ms cubic-bezier(0.2, 0.7, 0.2, 1);
        }

        .wind-line-2 {
          transition-delay: 40ms;
        }

        .contact-link:hover .envelope-flap,
        .contact-link:active .envelope-flap {
          opacity: 0;
          transform: translateY(2px) rotate(-6deg);
        }

        .contact-link:hover .envelope-body,
        .contact-link:active .envelope-body {
          opacity: 0;
          transform: translateY(2px) scale(0.98);
        }

        .contact-link:hover .paper-plane,
        .contact-link:active .paper-plane {
          opacity: 1;
          transform: translateX(1px) translateY(-1px) scale(1);
        }

        .contact-link:hover .wind-line,
        .contact-link:active .wind-line {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>
    </div>
  )
}
