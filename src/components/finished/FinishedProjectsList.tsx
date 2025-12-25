'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ArrowUpRight, FileText, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FinishedProject, CurrentlyBuildingProject, Testimonial, FinishedProjectVisual } from '@/types/finished';
import { finishedProjects, currentlyBuildingProjects, testimonials } from './FinishedProjectsData';
import { Dialog, DialogOverlay, DialogPortal } from '@/components/ui/dialog';
import { MobileWarningModal } from '@/components/ui/mobile-warning-modal';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import BreadcrumbNav from '@/components/layout/BreadcrumbNav';
import ReadingProgress from '@/components/blog/ReadingProgress';
import './scrollbar.css';

// Snappy ease-out for collapsible animations (per Emil Kowalski)
const snappyEaseOut = [0.22, 1, 0.36, 1] as const;

export function FinishedProjectsList() {
    const [isCurrentlyBuildingExpanded, setIsCurrentlyBuildingExpanded] = useState(true);
    const [isShippedExpanded, setIsShippedExpanded] = useState(true);
    const { isMobile, isLoaded } = useMobileDetection();
    const [showMobileWarning, setShowMobileWarning] = useState(false);
    const [activeVisuals, setActiveVisuals] = useState<FinishedProjectVisual[] | null>(null);
    const [activeVisualIndex, setActiveVisualIndex] = useState(0);

    // Show mobile warning modal when mobile is detected
    // React.useEffect(() => {
    //     if (isLoaded && isMobile) {
    //         setShowMobileWarning(true);
    //     }
    // }, [isLoaded, isMobile]);
    
    // Create a union type for timeline items
    type TimelineItem = 
        | (FinishedProject & { type: 'project' })
        | (Testimonial & { type: 'testimonial' });

    // Combine projects and testimonials with type discriminator
    const allTimelineItems: TimelineItem[] = [
        ...finishedProjects.map(p => ({ ...p, type: 'project' as const })),
        ...testimonials.map(t => ({ ...t, type: 'testimonial' as const }))
    ];

    // Sort all items by date (newest first)
    const sortedItems = allTimelineItems.sort((a, b) => {
        if (a.year !== b.year) {
            return b.year - a.year;
        }
        return b.month - a.month;
    });

    // Group items by year
    const itemsByYear = sortedItems.reduce((acc, item) => {
        if (!acc[item.year]) {
            acc[item.year] = [];
        }
        acc[item.year].push(item);
        return acc;
    }, {} as Record<number, TimelineItem[]>);

    const activeVisual = activeVisuals?.[activeVisualIndex] ?? activeVisuals?.[0] ?? null;

    const hasMultipleVisuals = (activeVisuals?.length ?? 0) > 1;

    const openVisualModal = (visuals: FinishedProjectVisual[], index: number) => {
        setActiveVisuals(visuals);
        setActiveVisualIndex(index);
    };

    const closeVisualModal = () => {
        setActiveVisuals(null);
    };

    const goToPreviousVisual = () => {
        setActiveVisualIndex((current) => Math.max(current - 1, 0));
    };

    const goToNextVisual = () => {
        if (!activeVisuals) return;
        setActiveVisualIndex((current) => Math.min(current + 1, activeVisuals.length - 1));
    };

    useEffect(() => {
        if (!activeVisuals) return;

        const handleKeydown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setActiveVisuals(null);
                return;
            }

            if (event.key === 'ArrowLeft') {
                setActiveVisualIndex((current) => Math.max(current - 1, 0));
                return;
            }

            if (event.key === 'ArrowRight') {
                setActiveVisualIndex((current) => Math.min(current + 1, activeVisuals.length - 1));
            }
        };

        document.addEventListener('keydown', handleKeydown);
        return () => document.removeEventListener('keydown', handleKeydown);
    }, [activeVisuals]);

    // Touch/swipe handling for mobile
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);
    const SWIPE_THRESHOLD = 50;

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        if (touchStartX.current === null || touchStartY.current === null || !activeVisuals) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX.current;
        const deltaY = touchEndY - touchStartY.current;

        // Only trigger swipe if horizontal movement is greater than vertical (prevents scroll interference)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_THRESHOLD) {
            if (deltaX > 0) {
                // Swipe right -> previous
                setActiveVisualIndex((current) => Math.max(current - 1, 0));
            } else {
                // Swipe left -> next
                setActiveVisualIndex((current) => Math.min(current + 1, activeVisuals.length - 1));
            }
        }

        touchStartX.current = null;
        touchStartY.current = null;
    }, [activeVisuals]);

    const renderVisuals = (visuals: FinishedProject['visuals'] | CurrentlyBuildingProject['visuals']) => {
        if (!visuals || visuals.length === 0) return null;

        const needsScroll = visuals.length > 3;

        return (
            <div 
                className={`flex gap-1.5 sm:gap-3 mt-2 ${needsScroll ? 'overflow-x-auto pb-0.5 thin-scrollbar' : ''}`}>
                {visuals.map((visual, index) => (
                    <div key={index} className="flex-shrink-0">
                        {visual.type === 'video' ? (
                            <div 
                                className="relative group cursor-pointer"
                                onClick={() => openVisualModal(visuals, index)}
                            >
                                <video
                                    src={visual.src}
                                    className="w-24 h-16 sm:w-32 sm:h-20 object-cover rounded border border-gray-200"
                                    preload="metadata"
                                    muted
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity rounded flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ) : visual.type === 'pdf' ? (
                            <div
                                className="w-24 h-16 sm:w-32 sm:h-20 bg-gray-50 border border-gray-200 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => openVisualModal(visuals, index)}
                            >
                                <FileText className="w-6 h-6 text-gray-600 mb-1" />
                                <span className="text-xs text-gray-500">PDF</span>
                            </div>
                        ) : visual.type === 'gif' ? (
                            <div className="cursor-pointer" onClick={() => openVisualModal(visuals, index)}>
                                <Image
                                    src={visual.src}
                                    alt={visual.alt || `Visual ${index + 1}`}
                                    width={128}
                                    height={80}
                                    className="w-24 h-16 sm:w-32 sm:h-20 object-cover rounded border border-gray-200 hover:opacity-90 transition-opacity"
                                    loading="lazy"
                                    unoptimized
                                />
                            </div>
                        ) : visual.pdfSrc ? (
                            <div className="relative cursor-pointer" onClick={() => openVisualModal(visuals, index)}>
                                <Image
                                    src={visual.src}
                                    alt={visual.alt || `Visual ${index + 1}`}
                                    width={128}
                                    height={80}
                                    className="w-24 h-16 sm:w-32 sm:h-20 object-cover rounded border border-gray-200 hover:opacity-90 transition-opacity"
                                    loading="lazy"
                                    placeholder="blur"
                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                                />
                                {/* PDF indicator overlay */}
                                <div className="absolute top-1 right-1 bg-white/90 rounded-full p-1">
                                    <FileText className="w-3 h-3 text-gray-600" />
                                </div>
                            </div>
                        ) : (
                            <div className="cursor-pointer" onClick={() => openVisualModal(visuals, index)}>
                                <Image
                                    src={visual.src}
                                    alt={visual.alt || `Visual ${index + 1}`}
                                    width={128}
                                    height={80}
                                    className="w-24 h-16 sm:w-32 sm:h-20 object-cover rounded border border-gray-200 hover:opacity-90 transition-opacity"
                                    loading="lazy"
                                    placeholder="blur"
                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="relative min-h-screen bg-white pt-16 ml-1 md:ml-22">
            {/* Reading Progress Bar */}
            <ReadingProgress />

            {/* Breadcrumb - absolute positioned like writes page */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full max-w-6xl px-4">
                <BreadcrumbNav
                    items={[
                        { href: "/", label: "home" },
                        { href: "/builds", label: "builds", current: true }
                    ]}
                />
            </div>

            <div className="max-w-3xl mx-auto px-3">
                {/* Header */}
                <div className="mb-6 sm:mb-11 ml-1 md:ml-20">
                    <h1 className="text-xl sm:text-3xl font-light text-black mb-4">
                        Everything i've built
                    </h1>
                    <h2 className="text-sm sm:text-base font-light text-gray-700">
                        because ideas are meant to be built and finishing matters
                    </h2>
                </div>

                {/* Currently Building Section */}
                {currentlyBuildingProjects.length > 0 && (
                    <div className="mb-8">
                        {/* Section header with toggle */}
                        <div className="flex gap-3 sm:gap-8 mb-4">
                            {/* Blinking red dot column */}
                            <div className="w-8 sm:w-11 flex-shrink-0 flex justify-end items-start pt-0.5">
                                <div className="relative">
                                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                                    <div className="absolute inset-0 w-2 h-2 bg-red-600 rounded-full animate-ping"></div>
                                </div>
                            </div>

                            {/* Content with chevron and title */}
                            <div className="flex-1 max-w-xl flex items-center gap-1.5">
                                {/* Chevron toggle button */}
                                <button
                                    onClick={() => setIsCurrentlyBuildingExpanded(!isCurrentlyBuildingExpanded)}
                                    className="p-0.5 hover:bg-red-50 rounded transition-colors"
                                    aria-label={isCurrentlyBuildingExpanded ? "Collapse section" : "Expand section"}
                                >
                                    <ChevronDown 
                                        className={`w-2.5 h-2.5 text-red-600 transition-transform duration-200 ease-snappy ${
                                            isCurrentlyBuildingExpanded ? '' : '-rotate-90'
                                        }`}
                                    />
                                </button>
                                
                                {/* Currently Building label */}
                                <button
                                    onClick={() => setIsCurrentlyBuildingExpanded(!isCurrentlyBuildingExpanded)}
                                    className="text-[10px] font-medium text-red-600 uppercase tracking-wider hover:text-red-700 transition-colors"
                                >
                                    Currently Building
                                </button>
                            </div>
                        </div>

                        {/* Collapsible content with animation */}
                        <AnimatePresence initial={false}>
                            {isCurrentlyBuildingExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25, ease: snappyEaseOut }}
                                    style={{ overflow: 'hidden' }}
                                >
                                    {currentlyBuildingProjects.map((project) => (
                                        <div key={project.id} className="flex gap-3 sm:gap-8 mb-6">
                                            {/* Empty column for alignment (no dot for individual items) */}
                                            <div className="w-8 sm:w-11 flex-shrink-0">
                                            </div>

                                            {/* Project content */}
                                            <div className="flex-1 max-w-xl">
                                                {/* Title with optional link */}
                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                    {project.link ? (
                                                        <a
                                                            href={project.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm sm:text-base font-normal text-black hover:text-gray-600 transition-colors flex items-center gap-0.5"
                                                        >
                                                            {project.title}
                                                            <ArrowUpRight className="w-3 h-3" />
                                                        </a>
                                                    ) : (
                                                        <h3 className="text-sm sm:text-base font-normal text-black">
                                                            {project.title}
                                                        </h3>
                                                    )}
                                                </div>

                                                {/* Subtitle */}
                                                <p className="text-xs sm:text-sm font-light text-gray-600 mb-1.5">
                                                    {project.subtitle}
                                                </p>

                                                {/* Visuals */}
                                                {renderVisuals(project.visuals)}
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        {/* Divider line */}
                        <div className="ml-1 md:ml-20 mt-8 mb-8 border-t border-gray-200"></div>
                    </div>
                )}

                {/* Shipped Section */}
                <div className="mb-8">
                    {/* Section header with toggle */}
                    <div className="flex gap-3 sm:gap-8 mb-4">
                        {/* Green dot column */}
                        <div className="w-8 sm:w-11 flex-shrink-0 flex justify-end items-start pt-0.5">
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        </div>

                        {/* Content with chevron and title */}
                        <div className="flex-1 max-w-xl flex items-center gap-1.5">
                            {/* Chevron toggle button */}
                            <button
                                onClick={() => setIsShippedExpanded(!isShippedExpanded)}
                                className="p-0.5 hover:bg-green-50 rounded transition-colors"
                                aria-label={isShippedExpanded ? "Collapse section" : "Expand section"}
                            >
                                    <ChevronDown 
                                        className={`w-2.5 h-2.5 text-green-600 transition-transform duration-200 ease-snappy ${
                                            isShippedExpanded ? '' : '-rotate-90'
                                        }`}
                                    />
                            </button>
                            
                            {/* Shipped label */}
                            <button
                                onClick={() => setIsShippedExpanded(!isShippedExpanded)}
                                className="text-[10px] font-medium text-green-600 uppercase tracking-wider hover:text-green-700 transition-colors"
                            >
                                Shipped
                            </button>
                        </div>
                    </div>

                    {/* Collapsible content - Projects and testimonials by year */}
                    <AnimatePresence initial={false}>
                        {isShippedExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: snappyEaseOut }}
                                style={{ overflow: 'hidden' }}
                            >
                                {Object.entries(itemsByYear)
                                    .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
                                    .map(([year, items]) => (
                                        <div key={year} className="mb-8">
                                            {items.map((item, index) => (
                                                <div key={item.id} className="flex gap-3 sm:gap-8 mb-6">
                                                    {/* Year column (only show for first item of the year) */}
                                                    <div className="w-8 sm:w-11 flex-shrink-0 text-right">
                                                        {index === 0 && (
                                                            <span className="text-sm sm:text-base font-normal text-gray-400">
                                                                {year}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Content - different rendering for projects vs testimonials */}
                                                    {item.type === 'testimonial' ? (
                                                        /* Testimonial content */
                                                        <div className="flex-1 max-w-xl">
                                                            <div className="border-l-2 border-gray-200 pl-3 py-1">
                                                                <p className="text-xs sm:text-sm font-light text-gray-600 italic">
                                                                    "{item.text}"
                                                                </p>
                                                                <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                                                                    — {item.title}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        /* Project content */
                                                        <div className="flex-1 max-w-xl">
                                                            {/* Title with optional link */}
                                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                                {item.link ? (
                                                                    <a
                                                                        href={item.link}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-sm sm:text-base font-normal text-black hover:text-gray-600 transition-colors flex items-center gap-0.5"
                                                                    >
                                                                        {item.title}
                                                                        <ArrowUpRight className="w-3 h-3" />
                                                                    </a>
                                                                ) : (
                                                                    <h3 className="text-sm sm:text-base font-normal text-black">
                                                                        {item.title}
                                                                    </h3>
                                                                )}
                                                            </div>

                                                            {/* Subtitle */}
                                                            <p className="text-xs sm:text-sm font-light text-gray-600 mb-1.5">
                                                                {item.subtitle}
                                                                {item.learnMoreUrl && (
                                                                    <>
                                                                        {' '}
                                                                        <a
                                                                            href={item.learnMoreUrl}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="hover:underline hover:text-gray-700 transition-colors"
                                                                        >
                                                                            (learn more)
                                                                        </a>
                                                                    </>
                                                                )}
                                                            </p>

                                                            {/* Visuals */}
                                                            {renderVisuals(item.visuals)}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            
            {/* Visual Modal */}
            <Dialog open={!!activeVisuals} onOpenChange={(open) => !open && closeVisualModal()}>
                <DialogPortal>
                    <DialogOverlay />
                    {/* Clickable backdrop layer */}
                    <div 
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        onClick={closeVisualModal}
                    >
                        {/* Close button */}
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); closeVisualModal(); }}
                            aria-label="Close"
                            className="absolute top-4 right-4 rounded-full bg-white/90 p-2 shadow hover:bg-white transition-colors z-10"
                        >
                            <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Left navigation button - hidden on mobile, outside content */}
                        {hasMultipleVisuals && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); goToPreviousVisual(); }}
                                disabled={activeVisualIndex === 0}
                                aria-label="Previous visual"
                                className={`hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow transition-opacity ${
                                    activeVisualIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white'
                                }`}
                            >
                                <ChevronLeft className="h-6 w-6 text-gray-700" />
                            </button>
                        )}

                        {/* Content + dots wrapper */}
                        <div className="flex flex-col items-center">
                            {/* Content area with swipe support */}
                            <div 
                                className="max-w-[92vw] max-h-[85vh] sm:max-h-[90vh] sm:max-w-5xl p-2 sm:p-3 bg-white rounded-lg shadow-lg cursor-default"
                                onClick={(e) => e.stopPropagation()}
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                            >
                                <div className="flex items-center justify-center">
                                    {activeVisual && (
                                        activeVisual.type === 'video' ? (
                                            <video
                                                key={activeVisual.src}
                                                src={activeVisual.src}
                                                className="max-w-full max-h-[75vh] sm:max-h-[80vh] rounded-lg"
                                                controls
                                                autoPlay
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                        ) : activeVisual.type === 'pdf' || activeVisual.pdfSrc ? (
                                            <iframe
                                                key={activeVisual.pdfSrc || activeVisual.src}
                                                src={activeVisual.pdfSrc || activeVisual.src}
                                                className="w-[88vw] sm:w-[90vw] h-[75vh] sm:h-[80vh] border-0 rounded-lg"
                                                title={activeVisual.alt || 'PDF Document'}
                                            />
                                        ) : (
                                            <Image
                                                key={activeVisual.src}
                                                src={activeVisual.src}
                                                alt={activeVisual.alt || 'Image'}
                                                width={1200}
                                                height={800}
                                                className="max-w-full max-h-[75vh] sm:max-h-[80vh] object-contain rounded-lg"
                                                placeholder="blur"
                                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                                                unoptimized={activeVisual.type === 'gif'}
                                            />
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Dot indicators for mobile - outside content */}
                            {hasMultipleVisuals && (
                                <div 
                                    className="flex sm:hidden justify-center gap-2 mt-4"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {activeVisuals?.map((_, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setActiveVisualIndex(index)}
                                            aria-label={`Go to visual ${index + 1}`}
                                            className={`w-2 h-2 rounded-full transition-colors ${
                                                index === activeVisualIndex ? 'bg-white' : 'bg-white/40'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right navigation button - hidden on mobile, outside content */}
                        {hasMultipleVisuals && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); goToNextVisual(); }}
                                disabled={activeVisuals ? activeVisualIndex === activeVisuals.length - 1 : true}
                                aria-label="Next visual"
                                className={`hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow transition-opacity ${
                                    activeVisuals && activeVisualIndex === activeVisuals.length - 1
                                        ? 'opacity-40 cursor-not-allowed'
                                        : 'hover:bg-white'
                                }`}
                            >
                                <ChevronRight className="h-6 w-6 text-gray-700" />
                            </button>
                        )}
                    </div>
                </DialogPortal>
            </Dialog>

            {/* Mobile Warning Modal */}
            <MobileWarningModal 
                isOpen={showMobileWarning}
                onClose={() => setShowMobileWarning(false)}
            />

            {/* Footnote */}
            <div className="text-center py-6 px-3">
                <p className="text-xs text-gray-500">
                    i{' '}
                    <a href="/writes" className="underline hover:text-gray-700 transition-colors">
                        write
                    </a>
                    {' '}too...
                </p>
            </div>
        </div>
    );
}
