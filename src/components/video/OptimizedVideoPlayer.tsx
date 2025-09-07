'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Loader2, RotateCcw } from 'lucide-react';

interface OptimizedVideoPlayerProps {
    src: string;
    title?: string;
    posterFrame?: string;
}

export function OptimizedVideoPlayer({ src, title, posterFrame }: OptimizedVideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isVideoReady, setIsVideoReady] = useState(false);
    const [showPlayButton, setShowPlayButton] = useState(true);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleLoadedMetadata = () => {
            setIsVideoReady(true);
        };

        const handleCanPlay = () => {
            setIsLoading(false);
        };

        const handlePlay = () => {
            setIsPlaying(true);
            setShowPlayButton(false);
        };

        const handlePause = () => {
            setIsPlaying(false);
            setShowPlayButton(true);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setShowPlayButton(true);
        };

        const handleError = () => {
            setHasError(true);
            setIsLoading(false);
        };

        const handleWaiting = () => {
            setIsLoading(true);
        };

        const handlePlaying = () => {
            setIsLoading(false);
            setShowPlayButton(false);
        };

        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        video.addEventListener('ended', handleEnded);
        video.addEventListener('error', handleError);
        video.addEventListener('waiting', handleWaiting);
        video.addEventListener('playing', handlePlaying);

        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
            video.removeEventListener('ended', handleEnded);
            video.removeEventListener('error', handleError);
            video.removeEventListener('waiting', handleWaiting);
            video.removeEventListener('playing', handlePlaying);
        };
    }, []);

    const handlePlayClick = () => {
        const video = videoRef.current;
        if (!video) return;

        video.play();
    };

    const handleRetry = () => {
        setHasError(false);
        setIsLoading(true);
        if (videoRef.current) {
            videoRef.current.load();
        }
    };

    return (
        <div className="relative w-full bg-white pt-12">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-black mb-6 text-center">
                    Race Time Calculator App - Demo
                </h1>
                <div 
                    ref={containerRef}
                    className="relative aspect-video bg-black rounded-lg overflow-hidden"
                >
                    <video
                        ref={videoRef}
                        className="w-full h-full object-contain"
                        src={src}
                        poster={posterFrame}
                        controls
                        playsInline
                        preload="metadata"
                    />

                    {/* Error state */}
                    {hasError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white">
                            <p className="mb-4 text-lg">Unable to load video</p>
                            <button
                                onClick={handleRetry}
                                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Loading state */}
                    {isLoading && !hasError && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Loader2 className="w-12 h-12 text-white animate-spin" />
                        </div>
                    )}

                    {/* Play button overlay (when paused and video hasn't started) */}
                    {showPlayButton && !hasError && isVideoReady && (
                        <div 
                            className="absolute inset-0 flex items-center justify-center cursor-pointer pointer-events-none"
                        >
                            <button 
                                className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors pointer-events-auto"
                                onClick={handlePlayClick}
                            >
                                <Play className="w-10 h-10 text-white ml-1" fill="white" />
                            </button>
                        </div>
                    )}
                </div>
                <p className="mt-6 text-center text-sm sm:text-base text-gray-800">
                    Thanks for visiting, LinkedIn! <em>If you're looking for{' '}
                    <Link href="/everything-i-built" className="text-blue-600 hover:underline">
                        everything else I built
                    </Link>
                    ...</em>
                </p>
            </div>
        </div>
    );
}
