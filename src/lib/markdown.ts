// src/lib/markdown.ts
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm'; // For GitHub-flavored markdown (tables, etc)

export async function markdownToHtml(markdown: string): Promise<string> {
    const result = await remark()
        .use(remarkGfm)
        .use(html, {
            sanitize: false, // Allow raw HTML if needed
            allowDangerousHtml: true
        })
        .process(markdown);
    return result.toString();
}