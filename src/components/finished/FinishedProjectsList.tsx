'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, FileText, ChevronDown, Users, TrendingUp } from 'lucide-react';
import { FinishedProject, CurrentlyBuildingProject } from '@/types/finished';
import { finishedProjects, currentlyBuildingProjects } from './FinishedProjectsData';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import './scrollbar.css';

export function FinishedProjectsList() {
    const [isCurrentlyBuildingExpanded, setIsCurrentlyBuildingExpanded] = useState(true);
    const [isShippedExpanded, setIsShippedExpanded] = useState(true);
    
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const formatCurrency = (num: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(num);
    };
    
    // Sort projects by date (newest first)
    const sortedProjects = [...finishedProjects].sort((a, b) => {
        if (a.year !== b.year) {
            return b.year - a.year;
        }
        return b.month - a.month;
    });

    // Group projects by year
    const projectsByYear = sortedProjects.reduce((acc, project) => {
        if (!acc[project.year]) {
            acc[project.year] = [];
        }
        acc[project.year].push(project);
        return acc;
    }, {} as Record<number, FinishedProject[]>);

    const renderVisuals = (visuals: FinishedProject['visuals'] | CurrentlyBuildingProject['visuals']) => {
        if (!visuals || visuals.length === 0) return null;

        const needsScroll = visuals.length > 3;

        return (
            <div 
                className={`flex gap-4 mt-3 ${needsScroll ? 'overflow-x-auto pb-1 thin-scrollbar' : ''}`}>
                {visuals.map((visual, index) => (
                    <div key={index} className="flex-shrink-0">
                        {visual.type === 'video' ? (
                            <video
                                src={visual.src}
                                className="w-32 h-20 object-cover rounded border border-gray-200 cursor-pointer"
                                preload="metadata"
                                muted
                                onMouseEnter={(e) => {
                                    const video = e.target as HTMLVideoElement;
                                    video.controls = true;
                                }}
                                onMouseLeave={(e) => {
                                    const video = e.target as HTMLVideoElement;
                                    if (video.paused) {
                                        video.controls = false;
                                    }
                                }}
                                onClick={(e) => {
                                    const video = e.target as HTMLVideoElement;
                                    if (video.paused) {
                                        video.play();
                                    }
                                }}
                            />
                        ) : visual.type === 'pdf' ? (
                            <div
                                className="w-32 h-20 bg-gray-50 border border-gray-200 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => window.open(visual.src, '_blank')}
                            >
                                <FileText className="w-6 h-6 text-gray-600 mb-1" />
                                <span className="text-xs text-gray-500">PDF</span>
                            </div>
                        ) : visual.type === 'gif' ? (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <div className="cursor-pointer">
                                        <Image
                                            src={visual.src}
                                            alt={visual.alt || `Visual ${index + 1}`}
                                            width={128}
                                            height={80}
                                            className="w-32 h-20 object-cover rounded border border-gray-200 hover:opacity-90 transition-opacity"
                                            loading="lazy"
                                            unoptimized
                                        />
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] p-2">
                                    <Image
                                        src={visual.src}
                                        alt={visual.alt || 'GIF'}
                                        width={800}
                                        height={600}
                                        className="w-full h-auto max-h-[80vh] object-contain"
                                        unoptimized
                                    />
                                </DialogContent>
                            </Dialog>
                        ) : visual.pdfSrc ? (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <div className="relative cursor-pointer">
                                        <Image
                                            src={visual.src}
                                            alt={visual.alt || `Visual ${index + 1}`}
                                            width={128}
                                            height={80}
                                            className="w-32 h-20 object-cover rounded border border-gray-200 hover:opacity-90 transition-opacity"
                                            loading="lazy"
                                            placeholder="blur"
                                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                                        />
                                        {/* PDF indicator overlay */}
                                        <div className="absolute top-1 right-1 bg-white/90 rounded-full p-1">
                                            <FileText className="w-3 h-3 text-gray-600" />
                                        </div>
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                                    <iframe
                                        src={visual.pdfSrc}
                                        className="w-full h-[80vh] border-0"
                                        title={visual.alt || 'PDF Document'}
                                    />
                                </DialogContent>
                            </Dialog>
                        ) : (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <div className="cursor-pointer">
                                        <Image
                                            src={visual.src}
                                            alt={visual.alt || `Visual ${index + 1}`}
                                            width={128}
                                            height={80}
                                            className="w-32 h-20 object-cover rounded border border-gray-200 hover:opacity-90 transition-opacity"
                                            loading="lazy"
                                            placeholder="blur"
                                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                                        />
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] p-2">
                                    <Image
                                        src={visual.src}
                                        alt={visual.alt || 'Image'}
                                        width={800}
                                        height={600}
                                        className="w-full h-auto max-h-[80vh] object-contain"
                                        placeholder="blur"
                                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                                    />
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white py-12 ml-32">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-16 ml-28">
                    <div className="flex items-end gap-4 mb-6">
                        <h1 className="text-4xl font-light text-black">
                            Everything i built
                        </h1>
                        <p className="text-xs text-gray-500 pb-1">
                            - <a href="https://declankramper.com" className="hover:underline hover:text-gray-700 transition-colors">declan kramper</a>
                        </p>
                    </div>
                    <h2 className="text-lg font-light text-gray-700">
                        because finishing is hard.
                    </h2>
                </div>

                {/* Impact Metrics */}
                {/* <div className="ml-28 mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-lg">
                        {/* Total Users */}
                        {/* <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-400" />
                                <p className="text-xs font-light text-gray-600 uppercase tracking-wider">
                                    Total Users
                                </p>
                            </div>
                            <p className="text-3xl font-light text-black">
                                {formatNumber(3235)}
                            </p>
                        </div> */}

                        {/* Value Created */}
                        {/* <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-gray-400" />
                                <p className="text-xs font-light text-gray-600 uppercase tracking-wider">
                                    Value Created (revenue)
                                </p>
                            </div>
                            <p className="text-3xl font-light text-black">
                                {formatCurrency(50061)}
                            </p>
                        </div>
                    </div>
                </div> */}

                {/* Currently Building Section */}
                {currentlyBuildingProjects.length > 0 && (
                    <div className="mb-12">
                        {/* Section header with toggle */}
                        <div className="flex gap-12 mb-6">
                            {/* Blinking red dot column */}
                            <div className="w-16 flex-shrink-0 flex justify-end items-start pt-1">
                                <div className="relative">
                                    <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                                    <div className="absolute inset-0 w-3 h-3 bg-red-600 rounded-full animate-ping"></div>
                                </div>
                            </div>

                            {/* Content with chevron and title */}
                            <div className="flex-1 max-w-2xl flex items-center gap-2">
                                {/* Chevron toggle button */}
                                <button
                                    onClick={() => setIsCurrentlyBuildingExpanded(!isCurrentlyBuildingExpanded)}
                                    className="p-0.5 hover:bg-red-50 rounded transition-colors"
                                    aria-label={isCurrentlyBuildingExpanded ? "Collapse section" : "Expand section"}
                                >
                                    <ChevronDown 
                                        className={`w-3 h-3 text-red-600 transition-transform ${
                                            isCurrentlyBuildingExpanded ? '' : '-rotate-90'
                                        }`}
                                    />
                                </button>
                                
                                {/* Currently Building label */}
                                <button
                                    onClick={() => setIsCurrentlyBuildingExpanded(!isCurrentlyBuildingExpanded)}
                                    className="text-xs font-medium text-red-600 uppercase tracking-wider hover:text-red-700 transition-colors"
                                >
                                    Currently Building
                                </button>
                            </div>
                        </div>

                        {/* Collapsible content */}
                        {isCurrentlyBuildingExpanded && (
                            <>
                                {currentlyBuildingProjects.map((project, index) => (
                                    <div key={project.id} className="flex gap-12 mb-8">
                                        {/* Empty column for alignment (no dot for individual items) */}
                                        <div className="w-16 flex-shrink-0">
                                        </div>

                                        {/* Project content */}
                                        <div className="flex-1 max-w-2xl">
                                            {/* Title with optional link */}
                                            <div className="flex items-center gap-2 mb-1">
                                                {project.link ? (
                                                    <a
                                                        href={project.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-lg font-normal text-black hover:text-gray-600 transition-colors flex items-center gap-1"
                                                    >
                                                        {project.title}
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    </a>
                                                ) : (
                                                    <h3 className="text-lg font-normal text-black">
                                                        {project.title}
                                                    </h3>
                                                )}
                                            </div>

                                            {/* Subtitle */}
                                            <p className="text-base font-light text-gray-600 mb-2">
                                                {project.subtitle}
                                            </p>

                                            {/* Visuals */}
                                            {renderVisuals(project.visuals)}
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                        
                        {/* Divider line */}
                        <div className="ml-28 mt-12 mb-12 border-t border-gray-200"></div>
                    </div>
                )}

                {/* Shipped Section */}
                <div className="mb-12">
                    {/* Section header with toggle */}
                    <div className="flex gap-12 mb-6">
                        {/* Green dot column */}
                        <div className="w-16 flex-shrink-0 flex justify-end items-start pt-1">
                            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        </div>

                        {/* Content with chevron and title */}
                        <div className="flex-1 max-w-2xl flex items-center gap-2">
                            {/* Chevron toggle button */}
                            <button
                                onClick={() => setIsShippedExpanded(!isShippedExpanded)}
                                className="p-0.5 hover:bg-green-50 rounded transition-colors"
                                aria-label={isShippedExpanded ? "Collapse section" : "Expand section"}
                            >
                                <ChevronDown 
                                    className={`w-3 h-3 text-green-600 transition-transform ${
                                        isShippedExpanded ? '' : '-rotate-90'
                                    }`}
                                />
                            </button>
                            
                            {/* Shipped label */}
                            <button
                                onClick={() => setIsShippedExpanded(!isShippedExpanded)}
                                className="text-xs font-medium text-green-600 uppercase tracking-wider hover:text-green-700 transition-colors"
                            >
                                Shipped
                            </button>
                            
                            {/* Impact numbers */}
                            <span className="text-xs text-gray-500 font-light">
                                <span className="px-2">|</span>
                                Total Users: <span className="font-semibold">{formatNumber(3235)}</span>
                                <span className="px-2">|</span>
                                Value Created: <span className="font-semibold">{formatCurrency(50061)}</span>
                            </span>
                        </div>
                    </div>

                    {/* Collapsible content - Projects by year */}
                    {isShippedExpanded && (
                        <>
                            {Object.entries(projectsByYear)
                                .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
                                .map(([year, projects]) => (
                                    <div key={year} className="mb-12">
                                        {projects.map((project, index) => (
                                            <div key={project.id} className="flex gap-12 mb-8">
                                                {/* Year column (only show for first project of the year) */}
                                                <div className="w-16 flex-shrink-0 text-right">
                                                    {index === 0 && (
                                                        <span className="text-lg font-normal text-gray-400">
                                                            {year}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Project content */}
                                                <div className="flex-1 max-w-2xl">
                                                    {/* Title with optional link */}
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {project.link ? (
                                                            <a
                                                                href={project.link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-lg font-normal text-black hover:text-gray-600 transition-colors flex items-center gap-1"
                                                            >
                                                                {project.title}
                                                                <ArrowUpRight className="w-4 h-4" />
                                                            </a>
                                                        ) : (
                                                            <h3 className="text-lg font-normal text-black">
                                                                {project.title}
                                                            </h3>
                                                        )}
                                                    </div>

                                                    {/* Subtitle */}
                                                    <p className="text-base font-light text-gray-600 mb-2">
                                                        {project.subtitle}
                                                    </p>

                                                    {/* Visuals */}
                                                    {renderVisuals(project.visuals)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}