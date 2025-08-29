export interface FinishedProjectVisual {
    type: 'image' | 'video' | 'gif';
    src: string;
    alt?: string;
}

export interface FinishedProject {
    id: string;
    title: string;
    subtitle: string;
    month: number; // 1-12
    year: number;
    link?: string;
    visuals?: FinishedProjectVisual[]; // 0-3 items
}