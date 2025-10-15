# archer.hoelterling.me

Personal portfolio website showcasing work experience, education, skills, and contact information. Built with modern web technologies and designed with a clean, resume-style layout.

## Tech Stack

- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **PrimeVue** - UI component library (Aura theme)
- **TanStack Query** - Data fetching and state management
- **Axios** - HTTP client for API requests

## Prerequisites

- Node.js `^20.19.0` or `>=22.12.0`
- npm

## Getting Started

### Installation

```sh
npm install
```

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_BASE_URL=your_api_base_url
VITE_PERSON_ID=your_person_id
```

### Development

Start the dev server with hot-reload:

```sh
npm run dev
```

The site will be available at `http://localhost:5173`

### Building for Production

Run type-checking and build:

```sh
npm run build
```

Or build without type-checking:

```sh
npm run build-only
```

### Preview Production Build

```sh
npm run preview
```

### Linting

Run ESLint with auto-fix:

```sh
npm run lint
```

## Project Structure

```
src/
├── api/              # API client configuration
├── components/       # Vue components organized by feature
│   ├── Contact/
│   ├── Education/
│   ├── Skills/
│   └── WorkExperience/
├── App.vue          # Root component with layout
├── main.ts          # Application entry point
├── main.css         # Global styles and Tailwind config
└── constants.ts     # App constants
```

## Key Features

- **Dark Mode Support** - Seamless theme switching with smooth transitions
- **Responsive Design** - Mobile-first approach with adaptive layouts
- **API-Driven Content** - Dynamic work experience data from remote API
- **Type Safety** - Full TypeScript coverage for components and API calls
- **Skeleton Loading** - Polished loading states for better UX

## Deployment

Automated deployment via GitHub Actions:
- Triggers on push to `main` branch
- Builds and deploys to `/srv/www/archer.hoelterling.me` via SCP
- See `.github/workflows/deploy.yml` for configuration

## Development Notes

- Uses Vue 3 `<script setup>` syntax
- Path alias `@/` maps to `src/` directory
- PrimeVue components use Aura theme with custom pass-through props
- Container/presentation pattern for data-fetching components

## IDE Setup

Recommended: [VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

For enhanced development experience:
- [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) browser extension
- Enable Custom Object Formatters in DevTools
