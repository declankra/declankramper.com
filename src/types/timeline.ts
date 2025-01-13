// src/types/timeline.ts
export interface WorkTile {
    type: 'work';
    id: string;
    title: string;
    date: string;
    year: number;
    media: string;
    preview: string; // Can contain markdown
    description: string; // Can contain markdown
    link?: string;
}

export interface FeedbackTile {
    id: string;
    type: 'feedback';
    date: string;
    year: number;
    text?: string;
    image?: string;
}

export type TimelineItem = WorkTile | FeedbackTile;