# Repository Guidelines

## Project Structure & Module Organization
- `src/app/` holds the Next.js App Router pages, layouts, and route handlers (API routes live under `src/app/api/`).
- `src/components/` contains shared UI and feature components; `src/components/ui/` is shadcn/ui.
- `src/lib/`, `src/hooks/`, and `src/types/` hold utilities, custom hooks, and TypeScript types.
- `content/posts/` stores markdown blog posts with frontmatter.
- `public/` contains static assets (images, icons, OG image).
- `supabase/` is reserved for Supabase config/migrations.

## Build, Test, and Development Commands
- `npm install` installs dependencies.
- `npm run dev` starts the local dev server.
- `npm run build` creates a production build.
- `npm start` runs the production server from the build output.
- `npm run lint` runs Next.js ESLint rules.

## Coding Style & Naming Conventions
- Use TypeScript for all new code. Follow existing patterns in `src/app/` and `src/components/`.
- Indentation is 2 spaces; keep imports ordered and grouped (external, internal, relative).
- Components use PascalCase (e.g., `ProjectCard.tsx`), hooks use `useX` naming, and route folders in `src/app/` are kebab-case.
- Styling is Tailwind-first; prefer `cn()` class merging in shared components.

## Testing Guidelines
- No automated test framework is configured yet, and there are no existing tests.
- If you add tests, co-locate them near source and use `*.test.ts` or `*.test.tsx` naming, then add a test runner command to `package.json`.

## Commit & Pull Request Guidelines
- Recent commit messages use short, imperative, sentence-case summaries (e.g., “Fix PostHog client init and rewrites”).
- Keep commits focused and include a brief “why” in the PR description.
- For UI changes, include screenshots or short clips and note any manual testing (e.g., “Checked `/` and `/writes` on desktop + mobile”).

## Security & Configuration
- Store secrets in `.env.local` (Supabase, Resend, analytics keys). Never commit secrets.
- When updating integrations, document required env vars in the PR description.
