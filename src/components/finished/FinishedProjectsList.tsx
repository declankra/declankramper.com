'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, FileText } from 'lucide-react';
import { FinishedProject, CurrentlyBuildingProject } from '@/types/finished';
import { finishedProjects, currentlyBuildingProjects } from './FinishedProjectsData';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import './scrollbar.css';

export function FinishedProjectsList() {
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

                {/* Currently Building Section */}
                {currentlyBuildingProjects.length > 0 && (
                    <div className="mb-12">
                        {currentlyBuildingProjects.map((project) => (
                            <div key={project.id} className="flex gap-12 mb-8">
                                {/* Blinking red dot column */}
                                <div className="w-16 flex-shrink-0 flex justify-end items-start pt-1">
                                    <div className="relative">
                                        <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                                        <div className="absolute inset-0 w-3 h-3 bg-red-600 rounded-full animate-ping"></div>
                                    </div>
                                </div>

                                {/* Project content */}
                                <div className="flex-1 max-w-2xl">
                                    {/* Currently building label */}
                                    <div className="text-xs font-medium text-red-600 uppercase tracking-wider mb-2">
                                        Currently Building
                                    </div>
                                    
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
                        
                        {/* Divider line */}
                        <div className="ml-28 mt-12 mb-12 border-t border-gray-200"></div>
                    </div>
                )}

                {/* Projects by year */}
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
            </div>
        </div>
    );
}