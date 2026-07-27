'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function RunsPage() {
  return (
    <div>
      <div className="mb-6 mt-1 max-w-[640px]">
        <h2 className="mb-1.5 text-[15px] font-semibold text-[#0A0A0B]">runs</h2>
        <p className="text-[13.5px] leading-[1.5] text-[#999]">
          running is a beautiful thing. i&apos;m grateful i can.
        </p>
      </div>

      <div className="max-w-[640px]">
        <motion.div
          className="max-w-[300px]"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <video
            src="/videos/halftone_indy_finish.mp4"
            className="h-auto w-full rounded-[14px] border border-[#eee] object-contain"
            playsInline
            autoPlay
            muted
            loop
          >
            Your browser does not support the video tag.
          </video>
        </motion.div>

        <motion.p
          className="mt-5 text-[13.5px] leading-[1.5] text-[#666]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          more thoughts and numbers coming soon
        </motion.p>

        <motion.p
          className="mt-1.5 text-[12.5px] text-[#999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          (currently{' '}
          <Link
            href="https://www.strava.com/athletes/98367252"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-[3px] transition-colors hover:text-[#666]"
          >
            training
          </Link>{' '}
          to qualify for Boston in Chicago on Oct 12)
        </motion.p>
      </div>
    </div>
  )
}
