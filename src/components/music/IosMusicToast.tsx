'use client'

import type { CSSProperties } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'

const DEFAULT_MESSAGE = 'This is Lane 8, my favorite artist.'

const IOS_MUSIC_TOAST_STYLE: CSSProperties = {
  background: 'rgba(255, 255, 255, 0.92)',
  backdropFilter: 'blur(18px)',
  border: '1px solid rgba(0, 0, 0, 0.06)',
  borderRadius: '16px',
  padding: '8px 12px',
  boxShadow: '0 10px 28px rgba(0, 0, 0, 0.14)',
  minWidth: '280px',
  maxWidth: '360px'
}

type IosMusicToastProps = {
  title?: string
  message?: string
}

export function showIosMusicToast({
  title = 'Now Playing',
  message = DEFAULT_MESSAGE
}: IosMusicToastProps = {}) {
  toast(<IosMusicToast title={title} message={message} />, {
    duration: 4000,
    position: 'top-center',
    className: 'ios-notification-toast',
    style: IOS_MUSIC_TOAST_STYLE
  })
}

function IosMusicToast({ title, message }: Required<IosMusicToastProps>) {
  return (
    <div className="flex w-full items-center gap-3">
      <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-[10px] shadow-[0_0_0_1px_rgba(0,0,0,0.08)_inset]">
        <Image
          src="/images/Apple_Music_icon.png"
          alt="Apple Music"
          width={36}
          height={36}
          sizes="36px"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1 text-left">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
          {title}
        </p>
        <p className="truncate text-sm font-medium leading-snug text-gray-900">
          {message}
        </p>
      </div>
    </div>
  )
}
