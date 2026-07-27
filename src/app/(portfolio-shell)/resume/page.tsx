'use client';

import { useEffect, useState } from 'react';
import { Mail, Download, Share } from 'lucide-react';
import { toast } from 'sonner';

const RESUME_PDF_PATH = '/resume.pdf';

// One screen, no scroll (desktop): the PDF viewer is height-constrained and
// keeps the page's 8.5x11 aspect so a full page is always in view.
export default function ResumePage() {
  const [pdfExists, setPdfExists] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(RESUME_PDF_PATH)
      .then((response) => {
        setPdfExists(response.ok);
      })
      .catch(() => {
        setPdfExists(false);
      });
  }, []);

  const handleEmailClick = () => {
    window.location.href = 'mailto:declankramper@gmail.com';
  };

  const handleDownload = () => {
    if (pdfExists) {
      const link = document.createElement('a');
      link.href = RESUME_PDF_PATH;
      link.download = 'DeclanKramper_Resume.pdf';
      link.click();
      toast.success('Resume download started!');
    } else {
      toast.error('Resume PDF not found. Please add resume.pdf to the public folder.');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Declan Kramper - Resume',
          text: "Check out Declan Kramper's resume",
          url: window.location.href,
        });
      } catch {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        toast.success('Link copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy link');
      });
  };

  const actionClass =
    'flex items-center gap-1.5 text-[12.5px] text-[#999] transition-colors hover:text-[#0A0A0B]';

  return (
    <div className="flex flex-col gap-4 md:h-[calc(100svh-135px)]">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <button type="button" onClick={handleDownload} className={actionClass}>
          <Download className="h-3.5 w-3.5" />
          download
        </button>
        <button type="button" onClick={handleEmailClick} className={actionClass}>
          <Mail className="h-3.5 w-3.5" />
          email me
        </button>
        <button type="button" onClick={handleShare} className={actionClass}>
          <Share className="h-3.5 w-3.5" />
          share
        </button>
      </div>

      <div className="min-h-0 flex-1">
        <div className="mx-auto aspect-[8.5/11] w-full overflow-hidden rounded-[10px] border border-[#eee] bg-white md:h-full md:w-auto">
          {pdfExists === true ? (
            <iframe
              src={`${RESUME_PDF_PATH}#toolbar=0&navpanes=0&view=Fit`}
              className="block h-full w-full border-0"
              title="Resume Preview"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#999]">
              <div className="p-8 text-center">
                <p className="mb-2 text-sm font-medium text-[#666]">resume preview</p>
                <p className="text-xs">
                  {pdfExists === null
                    ? 'loading…'
                    : 'add resume.pdf to the public folder to display it here'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
