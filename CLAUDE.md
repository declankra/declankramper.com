# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Run development server
npm run dev

# Build the project  
npm run build

# Run linter
npm run lint

# Start production server
npm start
```

## Architecture

This is a Next.js 14+ portfolio website with the following structure:

### Core Technologies
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Forms**: React Hook Form with Zod validation
- **Analytics**: OpenPanel
- **Database**: Supabase (for contact form and analytics)
- **Email**: Resend API for contact form
- **Content**: Markdown files in `content/posts/` processed with gray-matter and remark
- **Deployment**: Vercel (with Git LFS support for media assets)

### Directory Structure
- `src/app/` - Next.js App Router pages and API routes
  - `api/contact/` - Contact form API endpoint using Resend
  - Individual project pages (builds, runs, writes, etc.)
- `src/components/` - React components organized by feature
  - `ui/` - shadcn/ui components
  - `home/`, `blog/`, `finished/`, etc. - Feature-specific components
- `src/lib/` - Utility functions and configurations
  - `blog.ts` - Blog post processing from markdown files
  - `supabase.ts` - Supabase client configuration
  - `actions/` - Server actions
- `src/types/` - TypeScript type definitions
- `content/posts/` - Markdown blog posts with frontmatter

### Key Patterns
- Blog posts are stored as markdown files in `content/posts/` with frontmatter containing title, date, categories, and preview
- Components use Tailwind CSS for styling with the `cn()` utility for class merging
- Form validation uses Zod schemas with React Hook Form
- API routes use Next.js Route Handlers in `src/app/api/`