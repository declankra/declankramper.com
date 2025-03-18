// src/components/readme/ReadmeDialog.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { HyperText } from "@/components/magicui/hyper-text";
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

    // Animation sequence states
    const [firstParagraphComplete, setFirstParagraphComplete] = useState(false);
    const [whatIWantComplete, setWhatIWantComplete] = useState(false);
    const [careerMotivationComplete, setCareerMotivationComplete] = useState(false);
    const [howToGetThereComplete, setHowToGetThereComplete] = useState(false);

    // Reset states when dialog closes
    useEffect(() => {
        if (!open) {
            setContentVisible(false);
            setHeaderTypingComplete(false);
            setFirstParagraphComplete(false);
            setWhatIWantComplete(false);
            setCareerMotivationComplete(false);
            setHowToGetThereComplete(false);
            setContactPopoverOpen(false);
        }
    }, [open]);

    // Calculate when header typing should be complete
    const headerText = "Hey there! My name is Declan. Welcome to my space on the internet. I hope you enjoy your visit.";
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

    // Modified helper function to return the actual handler function
    const createCompletionHandler = (setStateFunction: (value: boolean) => void, delay = 200) => {
        return () => {
            setTimeout(() => {
                setStateFunction(true);
                console.log('State updated!'); // Confirm the state was set
            }, delay);
        };
    };

    // Force howToGetThereComplete to be set after career motivation is done
    useEffect(() => {
        if (careerMotivationComplete) {
            const timer = setTimeout(() => {
                setHowToGetThereComplete(true);
                console.log('Forced howToGetThereComplete to true');
            }, 2000); // Allow 2 seconds for the animation

            return () => clearTimeout(timer);
        }
    }, [careerMotivationComplete]);

    // Debug effect for tracking state changes
    useEffect(() => {
        console.log('howToGetThereComplete:', howToGetThereComplete);
    }, [howToGetThereComplete]);

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

                                        {/* Body content - only show after header typing completes */}
                                        <AnimatePresence>
                                            {headerTypingComplete && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="space-y-4"
                                                >
                                                    {/* First paragraph */}
                                                    <HyperText
                                                        className="text-sm leading-relaxed"
                                                        startOnView={true}
                                                        animateOnHover={false}
                                                        duration={300} // Faster animation
                                                        onAnimationComplete={createCompletionHandler(setFirstParagraphComplete)}
                                                    >
                                                        I'm 25 years old. By some measures, I've been living on earth for 33% of my expected stay.
                                                    </HyperText>

                                                    {/* What I want section - only show after first paragraph completes */}
                                                    {firstParagraphComplete && (
                                                        <div className="mt-6 space-y-2">
                                                            <HyperText
                                                                className="text-sm leading-relaxed"
                                                                startOnView={true}
                                                                animateOnHover={false}
                                                                duration={300} // Faster animation
                                                                onAnimationComplete={createCompletionHandler(setWhatIWantComplete)}
                                                            >
                                                                What do I want to do with my life?
                                                            </HyperText>

                                                            {whatIWantComplete && (
                                                                <motion.ol
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1 }}
                                                                    className="list-decimal pl-6 space-y-1 text-sm font-sans"
                                                                >
                                                                    {/* Intro text */}
                                                                    <p className="text-sm -ml-6">
                                                                        I want to…
                                                                    </p>
                                                                    <li>Be my best self</li>
                                                                    <li>Be the best family man</li>
                                                                    <li>Build the greatest consumer products in the world</li>
                                                                </motion.ol>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Career motivation - only show after "what I want" section completes */}
                                                    {whatIWantComplete && (
                                                        <motion.p
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ duration: 0.3 }}
                                                            onAnimationComplete={createCompletionHandler(setCareerMotivationComplete)}
                                                            className="text-sm leading-relaxed mt-4"
                                                        >
                                                            To expand on the third point, about my career, the motivation is to help people. Building great consumer products means solving problems for the user. I can volunteer my time (something I certainly could do more), but a great product can scale to millions of people and therefore benefit way more than my limited time can. "One of the ways that I believe people express their appreciation to the rest of humanity is to make something wonderful and put it out there." <a href="https://book.stevejobsarchive.com/" className="hover:underline text-primary">[quote]</a>
                                                        </motion.p>
                                                    )}

                                                    {/* How will I get there section - only show after career motivation completes */}
                                                    {careerMotivationComplete && (
                                                        <div className="mt-6 space-y-2">
                                                            <HyperText
                                                                className="text-sm leading-relaxed"
                                                                startOnView={true}
                                                                animateOnHover={false}
                                                                duration={300}
                                                                onAnimationComplete={createCompletionHandler(setHowToGetThereComplete, 0)}
                                                            >
                                                                How will I get there?
                                                            </HyperText>

                                                            {howToGetThereComplete && (
                                                                <motion.ol
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1 }}
                                                                    className="list-decimal pl-6 space-y-4 text-sm font-sans"
                                                                >
                                                                    {/* Intro text */}
                                                                    <p className="text-sm -ml-6 -mb-2">
                                                                        Greatness can't be planned, but here's how it could possibly look…
                                                                    </p>

                                                                    {/* Current phase */}
                                                                    <li className="space-y-2">
                                                                        <span className="font-medium">Current phase = Exploration</span>
                                                                        <ol className="list-decimal pl-6 space-y-1">
                                                                            <li>
                                                                                Continue to follow my curiosity
                                                                                <ol className="list-decimal pl-6 space-y-1">
                                                                                    <li>Building things I find interesting and want to see in the world</li>
                                                                                    <li>Learn things that peak my interest</li>
                                                                                </ol>
                                                                            </li>
                                                                            <li>Continue to enjoy time with friends and family (especially new places and experiences)</li>
                                                                            <li>Continue to deepen my relationship</li>
                                                                        </ol>
                                                                    </li>

                                                                    {/* Next phase */}
                                                                    <li className="space-y-2">
                                                                        <span className="font-medium">Next phase = Growth</span>
                                                                        <ol className="list-decimal pl-6 space-y-1">
                                                                            <li>Still explore. But more narrow. I'll have a wife and kids. A family.</li>
                                                                            <li>I'll have a job that doesn't require me to split my time between the work I find interesting and the work I get paid to do. I can go all-in on that. Learn what it takes to be great.</li>
                                                                            <li>Finish an Ironman.</li>
                                                                        </ol>
                                                                    </li>

                                                                    {/* Last phase */}
                                                                    <li className="space-y-2">
                                                                        <span className="font-medium">Last phase = Impact</span>
                                                                        <ol className="list-decimal pl-6 space-y-1">
                                                                            <li>Apply all that I've learned to make the biggest impact that I can.</li>
                                                                            <li>This entity will be my own thing. I don't see it going any other way.</li>
                                                                            <li>See earth from space.</li>
                                                                        </ol>
                                                                    </li>
                                                                </motion.ol>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Final note - only show after "how to get there" section completes */}
                                                    {howToGetThereComplete && (
                                                        <>
                                                            <HyperText
                                                                className="text-sm leading-relaxed mt-6"
                                                                startOnView={true}
                                                                animateOnHover={false}
                                                                duration={300} // Faster animation
                                                                onAnimationComplete={() => console.log('Final section animation complete')}
                                                            >
                                                                I wrote this sleep deprived after 3 days of little sleep. Why then?
                                                            </HyperText>

                                                            {/* Contact link */}
                                                            <motion.div
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ delay: 0.5 }}
                                                                className="mt-6 font-sans"
                                                            >
                                                                <a
                                                                    ref={contactLinkRef}
                                                                    href="#"
                                                                    className="text-primary underline-offset-4 hover:underline text-sm inline-block mt-4"
                                                                    onClick={handleOpenContactPopover}
                                                                >
                                                                    what brings you here?
                                                                </a>
                                                            </motion.div>
                                                        </>
                                                    )}
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