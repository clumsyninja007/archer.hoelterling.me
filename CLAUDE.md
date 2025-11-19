# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website built with Vue 3, Vite, and TypeScript. The site displays work experience, education, skills, and contact information. It uses PrimeVue for UI components, Tailwind CSS v4 for styling, and TanStack Query for data fetching from a remote API.

## Development Commands

### Essential Commands
- **Install dependencies**: `npm install`
- **Start dev server**: `npm run dev` - Runs Vite dev server with hot-reload
- **Build for production**: `npm run build` - Runs type-check and build in parallel
- **Type-check only**: `npm run type-check` - Runs Vue TypeScript compiler
- **Build only (skip type-check)**: `npm run build-only` - Builds without type-checking
- **Preview production build**: `npm run preview` - Preview production build locally
- **Lint and fix**: `npm run lint` - Run ESLint with auto-fix

### Node Version
This project requires Node.js `^20.19.0 || >=22.12.0` as specified in package.json engines.

## Code Quality Requirements

Before considering any feature or change complete, the following checks must pass:
1. **Type-check**: Run `npm run type-check` to ensure TypeScript types are correct
2. **Lint**: Run `npm run lint` to ensure code follows linting rules

Both commands must complete without errors. Fix any issues before marking work as complete.

## Architecture Overview

### Application Structure
- **Entry Point**: `src/main.ts` - Initializes Vue app with PrimeVue (Aura theme with dark mode support) and VueQuery plugins
- **Root Component**: `src/App.vue` - Two-column layout with resume-style sections
- **API Client**: `src/api/http.ts` - Axios instance configured with base URL from environment variable
- **Constants**: `src/constants.ts` - Exports `PERSON_ID` from environment variable

### Component Organization
Components are organized by feature/section:
- **WorkExperience/** - Experience data fetching and display
  - `WorkExperienceSection.vue` - Container that fetches data from API using TanStack Query
  - `WorkExperience.vue` - Presentation component for individual experience entries
  - `WorkExperienceSkeleton.vue` - Loading state skeleton
- **Education/** - Static education section
- **Skills/** - Static skills list
- **Contact/** - Contact information display
- **LinkCard.vue** - Reusable link component
- **PageHeader.vue** - Header component

### Data Flow Pattern
The application follows a container/presentation pattern:
1. **Section containers** (e.g., `WorkExperienceSection.vue`) use TanStack Query's `useQuery` to fetch data from the API
2. **Presentation components** (e.g., `WorkExperience.vue`) receive props and handle display logic
3. API calls use the shared `apiClient` from `src/api/http.ts`
4. Query keys follow the pattern: `['personal', 'experience']`

### Type Definitions
Types are defined within component files using TypeScript interfaces:
- `WorkExperienceProps` interface defined in `WorkExperience.vue` and exported for reuse
- Components use `defineProps<T>()` for type-safe props

### Styling
- Uses **Tailwind CSS v4** (via `@tailwindcss/vite` plugin)
- PrimeVue components styled with Aura theme preset
- Dark mode support via `.dark` class selector
- Custom PrimeVue pass-through (pt) props for component customization

### Accessibility Guidelines
All components and features must follow basic accessibility best practices:
- **Semantic HTML**: Use appropriate HTML elements (e.g., `<nav>`, `<main>`, `<article>`, `<button>` instead of `<div>` with click handlers)
- **ARIA labels**: Provide descriptive `aria-label` or `aria-labelledby` attributes where needed, especially for icon-only buttons and interactive elements
- **Keyboard navigation**: Ensure all interactive elements are keyboard accessible and have visible focus states
- **Color contrast**: Maintain WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text) in both light and dark modes
- **Alt text**: Include descriptive `alt` attributes for all images and meaningful icons
- **Focus management**: Manage focus appropriately for dynamic content and navigation
- **Screen reader support**: Test with screen readers to ensure content is properly announced
- **Form accessibility**: Use proper `<label>` elements, fieldsets, and error messages associated with form controls

### Path Aliases
- `@/` maps to `src/` directory (configured in vite.config.ts)

## Environment Variables

Required environment variables (set in `.env` files):
- `VITE_API_BASE_URL` - Base URL for the API backend
- `VITE_PERSON_ID` - Person ID used in API requests

## Deployment

The project uses GitHub Actions for automated deployment:
- Workflow file: `.github/workflows/deploy.yml`
- Triggers on push to `main` branch
- Builds the project and deploys via SCP to `/srv/www/archer.hoelterling.me`
- Requires GitHub secrets: `HOST`, `USERNAME`, `PORT`, `SSHKEY`

## Vue & Vite Specifics

- Uses Vue 3 Composition API with `<script setup>` syntax
- Vite configuration includes Vue, Tailwind, and Vue DevTools plugins
- TypeScript type-checking uses `vue-tsc` instead of `tsc` for `.vue` file support
