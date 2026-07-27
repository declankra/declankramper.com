import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'coffee',
  description: 'Coffee shop rankings — coming soon.',
}

// Placeholder destination for the footer coffee icon; real rankings TBD.
export default function CoffeePage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-white px-6 text-center">
      <span aria-hidden="true" className="mb-4 text-2xl">
        ☕
      </span>
      <h1 className="text-[15px] font-semibold tracking-[-0.01em] text-[#0A0A0B]">
        coffee shop rankings
      </h1>
      <p className="mt-2 text-[13.5px] leading-[1.5] text-[#999]">still brewing. check back soon.</p>
      <Link
        href="/"
        className="mt-7 text-[12.5px] text-[#666] transition-colors hover:text-[#0A0A0B]"
      >
        ← back home
      </Link>
    </div>
  )
}
