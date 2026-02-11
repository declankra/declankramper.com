export interface FinishedProjectVisual {
    type: 'image' | 'video' | 'gif' | 'pdf';
    src: string;
    alt?: string;
    pdfSrc?: string; // For images that should open PDFs in popup
    autoplay?: boolean; // For inline video previews that should autoplay and loop
}

export interface FinishedProject {
    id: string;
    title: string;
    subtitle: string;
    month: number; // 1-12
    year: number;
    link?: string;
    learnMoreUrl?: string;
    visuals?: FinishedProjectVisual[]; // 0-3 items
}

export interface CurrentlyBuildingProject {
    id: string;
    title: string;
    subtitle: string;
    link?: string;
    visuals?: FinishedProjectVisual[];
}

export interface Testimonial {
    id: string;
    title: string; // e.g., "EVP, Product Management" or "Director of PM, Client"
    text: string;
    month: number; // 1-12
    year: number;
}
