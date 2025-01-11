"use client"

import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"

import { cn } from "@/lib/utils"

const HoverCard = HoverCardPrimitive.Root

const HoverCardTrigger = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <HoverCardPrimitive.Trigger
    ref={ref}
    className={cn("touch-manipulation", className)} // Added touch-manipulation
    data-touch-trigger // Add data attribute for touch detection
    {...props}
  />
))
HoverCardTrigger.displayName = HoverCardPrimitive.Trigger.displayName

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

// Add client-side event handler initialization
if (typeof window !== 'undefined') {
  // Initialize touch handling
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const trigger = target.closest('[data-touch-trigger]')
    
    if (trigger) {
      e.preventDefault()
      const currentState = trigger.getAttribute('data-state')
      // Toggle open state
      if (currentState === 'closed') {
        ;(trigger as any)?._hoverCardTriggerImpl?.props?.onOpenChange?.(true)
      }
    } else {
      // Close all hover cards when clicking outside
      document.querySelectorAll('[data-touch-trigger][data-state="open"]').forEach((trigger) => {
        ;(trigger as any)?._hoverCardTriggerImpl?.props?.onOpenChange?.(false)
      })
    }
  })
}

export { HoverCard, HoverCardTrigger, HoverCardContent }