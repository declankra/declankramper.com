'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ClickPromptProps {
  onDismiss?: () => void
  topOffset?: number
}

export default function ClickPrompt({ onDismiss, topOffset }: ClickPromptProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  // Show prompt immediately
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true)
    }, 0)

    return () => clearTimeout(showTimer)
  }, [])

  // Auto-dismiss after 5 seconds of being visible
  useEffect(() => {
    if (!isVisible || isDismissed) return

    const dismissTimer = setTimeout(() => {
      setIsDismissed(true)
      onDismiss?.()
    }, 5000)

    return () => clearTimeout(dismissTimer)
  }, [isVisible, isDismissed, onDismiss])

  // Dismiss on any click
  useEffect(() => {
    const handleClick = () => {
      if (isVisible && !isDismissed) {
        setIsDismissed(true)
        onDismiss?.()
      }
    }

    document.addEventListener('click', handleClick, { once: true })
    return () => document.removeEventListener('click', handleClick)
  }, [isVisible, isDismissed, onDismiss])

  return (
    <AnimatePresence>
      {isVisible && !isDismissed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed left-0 z-40 w-full text-center"
          style={{ top: topOffset ?? 0 }}
        >
          <p className="text-xs text-[#999] tracking-wider">
            <span className="inline md:hidden">tap anywhere to listen</span>
            <span className="hidden md:inline">click anywhere to listen</span>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
