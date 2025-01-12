// Timeline component code stays the same as before
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@/components/ui/dialog';
import { ArrowUpRight } from 'lucide-react';
import { timelineItems } from './TimelineItems';

// Types for our timeline items
interface WorkTile {
    type: 'work';
    id: string;
    title: string;
    date: string;
    year: number;
    media: string;
    preview: string;
    description: string;
    link?: string;
}

interface FeedbackTile {
    type: 'feedback';
    id: string;
    date: string;
    year: number;
    text?: string;
    image?: string;
}

type TimelineItem = WorkTile | FeedbackTile;


function BuildsTimeline() {
    const [selectedWork, setSelectedWork] = useState<WorkTile | null>(null);

    // Group items by year
    const itemsByYear = timelineItems.reduce((acc, item) => {
        const year = item.year;
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(item);
        return acc;
    }, {} as Record<number, TimelineItem[]>);

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* Timeline container */}
                <div className="relative">
                    {/* Center line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-muted" />

                    {/* Timeline content */}
                    <div className="relative">
                        {Object.entries(itemsByYear).map(([year, items]) => (
                            <div key={year} className="mb-16">
                                {/* Year marker */}
                                <div className="flex justify-center mb-8">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className="text-2xl font-medium text-foreground"
                                    >
                                        {year}
                                    </motion.div>
                                </div>

                                {/* Items for this year */}
                                {items.map((item, index) => (
                                    <TimelineItem
                                        key={item.id}
                                        item={item}
                                        index={index}
                                        onSelect={item.type === 'work' ? setSelectedWork : undefined}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Work detail modal */}
                <AnimatePresence>
                    {selectedWork && (
                        <Dialog open={!!selectedWork} onOpenChange={() => setSelectedWork(null)}>
                            <div className="fixed inset-0 z-50 flex items-center justify-center">
                                {/* Backdrop - clicking this will close the modal */}
                                <div
                                    className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                                    onClick={() => setSelectedWork(null)}
                                />

                                {/* Modal content */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="relative z-50 max-w-2xl w-full mx-4 bg-card rounded-lg shadow-lg overflow-hidden"
                                    onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
                                >
                                    {/* Media section */}
                                    <div className="aspect-video w-full bg-muted relative">
                                        <img
                                            src={selectedWork.media}
                                            alt={selectedWork.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Content section */}
                                    <div className="p-6 space-y-4">
                                        <button
                                            onClick={() => setSelectedWork(null)}
                                            className="absolute top-4 right-4 p-2 rounded-full bg-background/20 hover:bg-background/30 transition-colors"
                                        >
                                            <span className="text-white text-lg">×</span>
                                        </button>

                                        <div className="space-y-4">
                                            <h2 className="text-xl font-bold">{selectedWork.title}</h2>
                                            <p className="text-sm text-muted-foreground">{selectedWork.description}</p>

                                            {selectedWork.link && (
                                                <a
                                                    href={selectedWork.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-sm text-foreground hover:opacity-80"
                                                >
                                                    View Project <ArrowUpRight className="ml-1 w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </Dialog>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// Individual timeline item component
function TimelineItem({
    item,
    index,
    onSelect
}: {
    item: TimelineItem;
    index: number;
    onSelect?: (work: WorkTile) => void;
}) {
    const isEven = index % 2 === 0;

    if (item.type === 'feedback') {
        return (
          <motion.div
            initial={{ opacity: 0, x: isEven ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`flex items-center mb-12 ${isEven ? 'justify-end pr-1/2' : 'justify-start pl-1/2'}`}
          >
            <div className="max-w-sm"> {/* Increased from max-w-xs */}
              {item.text && (
                <p className="text-sm text-muted-foreground italic"> {/* Added italic, removed bg-muted/30 and p-4 */}
                  {item.text}
                </p>
              )}
              {item.image && (
                <img src={item.image} alt="" className="w-full h-auto rounded" />
              )}
            </div>
          </motion.div>
        );
      }

    return (
        <motion.div
            initial={{ opacity: 0, x: isEven ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, rotate: isEven ? -1 : 1 }}
            className={`flex items-center mb-16 ${isEven ? 'justify-end pr-1/2' : 'justify-start pl-1/2'}`}
        >
            <motion.div
                onClick={() => onSelect?.(item)}
                className="relative max-w-md cursor-pointer group"
            >
                {/* Content */}
                <div className="bg-card rounded-lg shadow-sm overflow-hidden">
                    {/* Media */}
                    <div className="aspect-video bg-muted relative">
                        <img
                            src={item.media}
                            alt={item.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Info */}
                    <div className="p-4 space-y-2">
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.preview}
                        </p>
                    </div>
                </div>

                {/* Date marker */}
                <div
                    className={`absolute top-1/2 ${isEven ? '-right-8' : '-left-8'} 
            transform -translate-y-1/2 w-4 h-4 rounded-full bg-background 
            border-2 border-muted flex items-center justify-center`}
                >
                    <div className="w-2 h-2 rounded-full bg-muted" />
                </div>
            </motion.div>
        </motion.div>
    );
}

export { BuildsTimeline, type WorkTile, type FeedbackTile, type TimelineItem };