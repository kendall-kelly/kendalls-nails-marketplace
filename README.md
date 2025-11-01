# Kendall's Nails - React App

A modern React application for Kendall's Nails custom nail design service.

## Prerequisites

Before running this project, make sure you have Node.js and npm installed:
- Download from [nodejs.org](https://nodejs.org/)
- Recommended version: Node.js 18 or higher

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build

## Project Structure

```
kendalls-nails-react/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Header.css
│   │   ├── Hero.jsx
│   │   ├── Hero.css
│   │   ├── ProcessSteps.jsx
│   │   └── ProcessSteps.css
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

## Features

- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI** - Clean and professional design matching the brand aesthetic
- **Component-Based** - Modular React components for easy maintenance and updates
- **Fast Development** - Powered by Vite for lightning-fast HMR (Hot Module Replacement)

## Customization

### Colors

The primary brand color is defined throughout the CSS files:
- Primary Pink: `#E91E8C`

### Content

Update the content in the respective component files:
- Navigation links: `src/components/Header.jsx`
- Hero section: `src/components/Hero.jsx`
- Process steps: `src/components/ProcessSteps.jsx`

### Images

Replace the placeholder image in `src/components/Hero.jsx` with your own custom nail design images.

## Building for Production

To create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist` directory, ready to deploy to any static hosting service.
