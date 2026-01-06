# WenquChat Web

A modern chat application with comprehensive media gallery support, built with React, TypeScript, and Vite.

## Features

### Core Functionality
- **Chat Interface**: Modern chat interface with message history
- **Media Gallery**: Comprehensive support for various file types
- **Responsive Design**: Works seamlessly across desktop and mobile devices

### Media Support
- **Images**: JPG, PNG, GIF, WebP, SVG with zoom and pan capabilities
- **PDFs**: Full PDF viewing with navigation, zoom, and page controls
- **Videos**: MP4, AVI, MOV, WMV, FLV, MKV (and more formats)
- **Documents**: DOC, DOCX, XLS, XLSX, PPT, PPTX
- **PSD**: Adobe Photoshop file support

### Technical Features
- **TypeScript**: Full TypeScript support for type safety
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Modern utility-first CSS framework
- **Zustand**: Lightweight state management
- **ESLint**: Code quality and consistency

## Quick Start

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to the project directory
cd wenquchat-web

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
wenguichat-web/
├── src/
│   ├── components/          # React components
│   │   ├── ChatConsole.tsx  # Main chat interface
│   │   ├── MediaGallery/  # Media viewing components
│   │   │   ├── ImageViewer.tsx
│   │   │   ├── VideoPlayer.tsx
│   │   │   ├── PDFViewer.tsx
│   │   │   ├── OfficeDocumentViewer.tsx
│   │   │   └── MediaDetailModal.tsx
│   │   └── ui/             # Reusable UI components
│   ├── stores/             # Zustand stores
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── assets/             # Static assets
├── public/                 # Public assets
└── package.json            # Dependencies and scripts
```

## Dependencies

See [DEPENDENCIES.md](DEPENDENCIES.md) for a comprehensive list of all dependencies and their purposes.

### Key Dependencies
- **React 19**: Modern React with latest features
- **TypeScript**: Type safety and better developer experience
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **react-player**: Video player with wide format support
- **react-pdf**: PDF viewing capabilities
- **react-doc-viewer**: Document format support
- **zustand**: State management

## Media Gallery Components

### ImageViewer
- Supports common image formats (JPG, PNG, GIF, WebP, SVG)
- Zoom functionality with mouse wheel
- Pan capabilities when zoomed
- Full-screen viewing mode

### VideoPlayer
- Wide video format support via react-player
- Custom controls for play/pause, volume, progress, and fullscreen
- Responsive design that adapts to container size

### PDFViewer
- Full PDF document viewing
- Page navigation controls
- Zoom functionality
- Download capability

### OfficeDocumentViewer
- Support for Microsoft Office documents
- DOC, DOCX, XLS, XLSX, PPT, PPTX formats
- Renders documents in a readable format

### MediaDetailModal
- Unified modal interface for all media types
- Automatically selects appropriate viewer based on file type
- Consistent UI across different media types

## Development

### Adding New Dependencies

```bash
npm install [package-name]
```

### Type Checking

```bash
npm run type-check
```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking
5. Submit a pull request

## License

[Your License Here]

## Support

For support and questions, please [contact information or create an issue].