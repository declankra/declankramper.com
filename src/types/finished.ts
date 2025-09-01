export interface FinishedProjectVisual {
    type: 'image' | 'video' | 'gif' | 'pdf';
    src: string;
    alt?: string;
    pdfSrc?: string; // For images that should open PDFs in popup
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

export interface CurrentlyBuildingProject {
    id: string;
    title: string;
    subtitle: string;
    link?: string;
    visuals?: FinishedProjectVisual[];
}