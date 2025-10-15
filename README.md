# KYC Frontend Application

A modern Know Your Customer (KYC) verification frontend application built with React, TypeScript, and Vite. This application provides a multi-step form for collecting and verifying user identity information with real-time face detection capabilities.

## Features

- Multi-step KYC verification form
- Real-time face detection during selfie capture
- Address validation and proof upload
- Identity document verification
- Responsive design with dark/light theme support
- Form validation with React Hook Form and Zod
- Modern UI components using Radix UI and Tailwind CSS

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **TanStack Query** - Data fetching and caching
- **React Webcam** - Camera integration
- **@vladmandic/human** - AI-powered face detection
- **Framer Motion** - Animations
- **date-fns** - Date utilities
- **Sonner** - Toast notifications

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** or **pnpm** package manager
- A modern web browser with webcam access (for selfie verification)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd woovi-test-kyc-frontent
```

### 2. Install dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

Using pnpm:
```bash
pnpm install
```

### 3. Start the development server

```bash
npm run dev
```

The application will start on `http://localhost:5173` (or another port if 5173 is busy).

## Available Scripts

- `npm run dev` - Start the development server with hot module replacement
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
src/
├── components/
│   ├── kyc/              # KYC form step components
│   │   ├── PersonalInfoStep.tsx
│   │   ├── AddressStep.tsx
│   │   ├── IdentityStep.tsx
│   │   ├── SelfieStep.tsx
│   │   └── ReviewStep.tsx
│   ├── ui/               # Reusable UI components
│   └── ...
├── hooks/                # Custom React hooks
│   └── useFaceDetection.ts
├── lib/                  # Utility functions
├── pages/                # Page components
└── App.tsx               # Main application component
```

## KYC Verification Steps

The application guides users through a 5-step verification process:

1. **Personal Information** - Name, email, phone, date of birth, country
2. **Address** - Street address, city, state, postal code, and address proof upload
3. **Identity** - Document type selection, ID number, and document photo uploads (front/back)
4. **Selfie** - Real-time face detection and selfie capture using webcam
5. **Review** - Review all information before final submission

## Browser Compatibility

- Chrome/Edge (recommended) - Full support
- Firefox - Full support
- Safari - Full support (requires HTTPS for webcam access)

**Note:** Webcam features require HTTPS in production environments and user permission.

## Development Notes

### Face Detection

The selfie step uses `@vladmandic/human` for real-time face detection. The face detection:
- Initializes automatically when the camera is activated
- Requires minimum 60% confidence level for capture
- Provides real-time feedback on face detection status

### Form Validation

All forms use React Hook Form with Zod schema validation for:
- Type-safe form data
- Real-time validation feedback
- Consistent error handling

### Styling

The project uses Tailwind CSS 4 with:
- Custom design tokens
- Dark/light theme support
- Responsive breakpoints
- Custom animations via `tw-animate-css`

## Building for Production

1. Build the application:
```bash
npm run build
```

2. The production-ready files will be in the `dist/` directory

3. Preview the production build:
```bash
npm run preview
```

## Troubleshooting

### Port already in use
If port 5173 is already in use, Vite will automatically use the next available port. Check the terminal output for the actual URL.

### Webcam not working
- Ensure your browser has permission to access the webcam
- Use HTTPS in production (required by most browsers)
- Check that no other application is using the webcam

### Build errors
If you encounter TypeScript errors during build:
```bash
npm run build
```
Check the error messages and ensure all dependencies are properly installed.

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team.
