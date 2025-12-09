# WenquChat Web Dependencies

This document lists all the dependencies used in the WenquChat Web application and their purposes.

## Core Dependencies

### UI Framework & Styling
- **react** (^19.2.0) - Core React library for building user interfaces
- **react-dom** (^19.2.0) - React DOM renderer for web applications
- **tailwindcss** (^4.1.17) - Utility-first CSS framework for styling
- **autoprefixer** (^10.4.22) - PostCSS plugin to add vendor prefixes
- **clsx** (^2.1.1) - Utility for constructing className strings conditionally
- **tailwind-merge** (^3.4.0) - Merges Tailwind CSS classes without style conflicts
- **class-variance-authority** (^0.7.1) - Type-safe component variants for React

### Icons & UI Components
- **lucide-react** (^0.556.0) - Beautiful & consistent icon pack for React
- **@radix-ui/react-slot** (^1.2.4) - Radix UI slot component for composition

### Media Handling
- **react-pdf** (^10.2.0) - PDF viewer component for React applications
- **react-player** (^3.4.0) - Video player component with wide format support
- **react-doc-viewer** (^0.1.15) - Document viewer for various file formats
- **react-medium-image-zoom** (^5.4.0) - Medium-style image zoom component
- **react-zoom-pan-pinch** (^3.7.0) - Zoom, pan, and pinch gestures for React
- **ag-psd** (^29.0.0) - PSD (Photoshop) file format support

### Content Rendering
- **react-markdown** (^10.1.0) - React component for rendering Markdown
- **remark-gfm** (^4.0.1) - GitHub Flavored Markdown plugin for remark

### Layout & Panels
- **react-resizable-panels** (^3.0.6) - Resizable panel groups for React

### State Management
- **zustand** (^5.0.9) - Lightweight state management for React

### Network & Data Fetching
- **@microsoft/fetch-event-source** (^2.0.1) - Server-sent events fetch implementation

## Development Dependencies

### Build Tools
- **vite** (^7.2.4) - Fast build tool and development server
- **@vitejs/plugin-react** (^5.1.1) - React plugin for Vite

### TypeScript
- **typescript** (~5.9.3) - TypeScript language support
- **@types/react** (^19.2.5) - TypeScript definitions for React
- **@types/react-dom** (^19.2.3) - TypeScript definitions for React DOM
- **@types/node** (^24.10.2) - TypeScript definitions for Node.js

### Code Quality
- **eslint** (^9.39.1) - JavaScript/TypeScript linter
- **typescript-eslint** (^8.46.4) - ESLint plugin for TypeScript
- **eslint-plugin-react-hooks** (^7.0.1) - ESLint rules for React hooks
- **eslint-plugin-react-refresh** (^0.4.24) - ESLint plugin for React Refresh
- **@eslint/js** (^9.39.1) - ESLint's recommended JavaScript configs
- **globals** (^16.5.0) - Global variables for ESLint

### PostCSS & Tailwind
- **@tailwindcss/postcss** (^4.1.17) - PostCSS plugin for Tailwind CSS

## File Type Support

The application supports the following file types through various dependencies:

- **Images**: JPG, PNG, GIF, WebP, SVG (with zoom and pan capabilities)
- **PDFs**: Full PDF viewing with navigation and zoom
- **Videos**: MP4, AVI, MOV, WMV, FLV, MKV (and more via react-player)
- **Documents**: DOC, DOCX, XLS, XLSX, PPT, PPTX (via react-doc-viewer)
- **PSD**: Adobe Photoshop files (via ag-psd)

## Installation

To install all dependencies:

```bash
npm install
```

To install a specific dependency:

```bash
npm install [package-name]
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking