// src/components/readme/ReadmeDialog.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { ContactPopover } from "./ContactPopover";

interface ReadmeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    origin: { x: number; y: number };
}

export function ReadmeDialog({ open, onOpenChange, origin }: ReadmeDialogProps) {
    const [contentVisible, setContentVisible] = useState(false);
    const [headerTypingComplete, setHeaderTypingComplete] = useState(false);
    const [contactPopoverOpen, setContactPopoverOpen] = useState(false);
    const contactLinkRef = useRef<HTMLAnchorElement>(null);
    const [contactLinkPosition, setContactLinkPosition] = useState({ x: 0, y: 0 });

    // Reset states when dialog closes
    useEffect(() => {
        if (!open) {
            setContentVisible(false);
            setHeaderTypingComplete(false);
            setContactPopoverOpen(false);
        }
    }, [open]);

    // Calculate when header typing should be complete
    const headerText = "I'm figuring it out.";
    const headerTypingDuration = headerText.length * 30 + 500; // 30ms per character + buffer

    // Set header typing complete after estimated duration
    useEffect(() => {
        if (contentVisible) {
            const timer = setTimeout(() => {
                setHeaderTypingComplete(true);
            }, headerTypingDuration);

            return () => clearTimeout(timer);
        }
    }, [contentVisible, headerTypingDuration]);

    // Handle opening the contact popover
    const handleOpenContactPopover = (e: React.MouseEvent) => {
        e.preventDefault();

        if (contactLinkRef.current) {
            const rect = contactLinkRef.current.getBoundingClientRect();
            
            // Calculate a position that works better for both mobile and desktop
            // For mobile, we want to position it higher up from the link to ensure visibility
            const isMobile = window.innerWidth < 768;
            
            setContactLinkPosition({
                x: isMobile ? window.innerWidth / 9 : rect.right,
                y: rect.top - 300,
            });
        }

        setContactPopoverOpen(true);
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50"
                        onClick={() => onOpenChange(false)}
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{
                            opacity: 0,
                            position: "fixed",
                            left: origin.x,
                            top: origin.y,
                            width: 0,
                            height: 0,
                            scale: 0.1,
                            transform: "translate(-50%, -50%)" // Center at origin point
                        }}
                        animate={{
                            opacity: 1,
                            position: "fixed",
                            left: "50%",
                            top: "50%",
                            width: "90vw",
                            height: "auto",
                            maxWidth: "800px",
                            maxHeight: "80vh",
                            scale: 1,
                            transform: "translate(-50%, -50%)"
                        }}
                        exit={{
                            opacity: 0,
                            position: "fixed",
                            left: origin.x,
                            top: origin.y,
                            width: 0,
                            height: 0,
                            scale: 0.1,
                            transform: "translate(-50%, -50%)" // Center at origin point
                        }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 120,
                            mass: 1
                        }}
                        onAnimationComplete={() => setContentVisible(true)}
                        className="fixed z-50 rounded overflow-hidden border-2 border-muted bg-card"
                    >
                        {/* Terminal/computer-style header */}
                        <div className="h-8 bg-muted flex items-center justify-between px-4">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => onOpenChange(false)}
                                    className="w-3 h-3 rounded-full bg-destructive hover:bg-destructive/100 opacity-70 hover:opacity-100 transition-opacity"
                                    aria-label="Close dialog"
                                ></button>
                                <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-70"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500 opacity-70"></div>
                            </div>
                            <div className="text-xs text-muted-foreground">README.md - Declan Kramper</div>
                            <div className="w-4"></div> {/* Empty div for balanced spacing */}
                        </div>

                        {/* Content area with scroll */}
                        <div className="p-6 overflow-y-auto max-h-[calc(80vh-2rem)]">
                            <AnimatePresence>
                                {contentVisible && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-6"
                                    >
                                        {/* Header with typing animation */}
                                        <div className="mb-6">
                                            <TypingAnimation
                                                text={headerText}
                                                duration={30}
                                                className="text-lg font-medium leading-relaxed"
                                            />
                                        </div>

                                        {/* Contact link - show after header typing completes */}
                                        <AnimatePresence>
                                            {headerTypingComplete && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.3 }}
                                                    className="mt-6 font-sans"
                                                >
                                                    <a
                                                        ref={contactLinkRef}
                                                        href="#"
                                                        className="text-primary underline-offset-4 hover:underline text-sm inline-block"
                                                        onClick={handleOpenContactPopover}
                                                    >
                                                        message me
                                                    </a>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Contact Popover */}
                    <ContactPopover
                        isOpen={contactPopoverOpen}
                        onClose={() => setContactPopoverOpen(false)}
                        origin={contactLinkPosition}
                    />
                </>
            )}
        </AnimatePresence>
    );
}