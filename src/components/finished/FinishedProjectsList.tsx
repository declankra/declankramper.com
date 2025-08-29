'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { FinishedProject } from '@/types/finished';
import { finishedProjects } from './FinishedProjectsData';

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

    const renderVisuals = (visuals: FinishedProject['visuals']) => {
        if (!visuals || visuals.length === 0) return null;

        return (
            <div className="flex gap-4 mt-3">
                {visuals.slice(0, 3).map((visual, index) => (
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
                        ) : (
                            <Image
                                src={visual.src}
                                alt={visual.alt || `Visual ${index + 1}`}
                                width={128}
                                height={80}
                                className="w-32 h-20 object-cover rounded border border-gray-200"
                                loading="lazy"
                                placeholder="blur"
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                            />
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
                            everything i finished
                        </h1>
                        <p className="text-xs text-gray-500 pb-1">
                            - <a href="https://declankramper.com" className="hover:underline hover:text-gray-700 transition-colors">declan kramper</a>
                        </p>
                    </div>
                    <h2 className="text-xl font-light text-gray-700">
                        finishing is hard.
                    </h2>
                </div>

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