# Satellite Tracking Interface - Digantara

A modern React/TypeScript application for tracking and managing satellite data with advanced filtering, search, and selection capabilities.

## 📋 Features

### Core Features
- **Real-time Satellite Data**: Fetches live satellite data from Digantara's API
- **Advanced Search**: Search satellites by name or NORAD ID with debounced input
- **Multi-level Filtering**: Filter by object types (Payload, Rocket Body, Debris, Unknown) and orbit codes
- **Virtualized Table**: High-performance rendering of large datasets (60k+ satellites)
- **Sorting**: Sort by NORAD ID, Name
- **Row Selection**: Select up to 10 satellites with visual feedback

### Bonus Features
- **Persistent Selection**: Selected satellites are saved to localStorage
- **Bulk Selection**: Select all visible satellites with a single click
- **Asset Management**: Dedicated page to view and manage selected satellites
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Loading States**: Smooth loading indicators and error handling
- **Real-time Counts**: Live count updates for different satellite types

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd satellite-tracker
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Start the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

\`\`\`
satellite-tracker/
├── app/
│   ├── api/satellites/route.ts    # API proxy for CORS handling
│   ├── selected/page.tsx          # Selected satellites page
│   ├── page.tsx                   # Main application
│   └── layout.tsx                 # Root layout
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── selected-assets.tsx        # Selected satellites sidebar
│   └── virtualized-table.tsx      # High-performance table component
├── hooks/
│   ├── use-debounce.ts           # Debounced input hook
│   ├── use-local-storage.ts      # localStorage persistence hook
│   └── use-satellite-data.ts     # Data fetching hook
└── README.md
\`\`\`

## 🔧 Technical Implementation

### Data Fetching
- **API Proxy**: Next.js API route handles CORS issues with the external API
- **Custom Hook**: `useSatelliteData` manages data fetching, loading states, and error handling
- **Debounced Search**: 300ms debounce prevents excessive API calls

### Performance Optimizations
- **React Window**: Virtualizes large datasets for smooth scrolling
- **Memoization**: Strategic use of `useMemo` and `useCallback` to prevent unnecessary re-renders
- **Efficient Filtering**: Client-side filtering for orbit codes and search terms

### State Management
- **Local State**: React hooks for component-level state
- **Persistence**: localStorage for selected satellites across sessions
- **URL State**: Query parameters for shareable filter states

## 🎯 Usage Guide

### Basic Operations

1. **Search Satellites**
   - Type in the search box and press Enter
   - Search works on satellite names and NORAD IDs

2. **Filter by Type**
   - Click on object type badges to filter
   - Multiple types can be selected simultaneously

3. **Filter by Orbit**
   - Use the "Orbit Code" dropdown to select specific orbits
   - Supports multiple orbit code selection

4. **Select Satellites**
   - Click individual checkboxes to select satellites
   - Use "Select all" to select all visible satellites
   - Maximum 10 satellites can be selected

5. **Manage Selection**
   - View selected satellites in the right sidebar
   - Remove individual selections or clear all
   - Click "PROCEED" to view detailed selection page

### Advanced Features

- **Sorting**: Click column headers to sort data
- **Persistence**: Your selections are automatically saved
- **Bulk Operations**: Select all visible satellites at once
- **Real-time Updates**: Counts update as you filter and select

## 🛠️ API Integration

The application integrates with Digantara's satellite API:

\`\`\`typescript
// API Endpoint
GET https://backend.digantara.dev/v1/satellites

// Supported Parameters
- objectTypes: Filter by satellite types
- attributes: Specify which data fields to return
\`\`\`

### CORS Handling
A Next.js API route (`/api/satellites`) acts as a proxy to handle CORS restrictions:

\`\`\`typescript
// Usage
const response = await fetch('/api/satellites?objectTypes=PAYLOAD,DEBRIS')
\`\`\`

## 🎨 Design System

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom dark theme
- **Components**: shadcn/ui component library
- **Icons**: Lucide React icons
- **Typography**: System fonts with monospace for data

### Color Scheme
- **Background**: Slate-900 (Dark space theme)
- **Cards**: Slate-800 with slate-700 borders
- **Accent**: Blue-600 for primary actions
- **Text**: White primary, slate-400 secondary

## 📱 Responsive Design

- **Desktop**: Full sidebar layout with detailed table
- **Tablet**: Stacked layout with collapsible sidebar
- **Mobile**: Single column with touch-optimized controls

## 🔍 Testing

### Performance Testing

- [ ] Table scrolls smoothly with 60k+ items
- [ ] Search debouncing prevents excessive API calls
- [ ] Filtering doesn't cause UI freezing
- [ ] Memory usage remains stable during long sessions

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   \`\`\`bash
   vercel --prod
   \`\`\`

2. **Environment Variables**
   No environment variables required for basic functionality.

### Other Platforms

The application can be deployed to any platform supporting Next.js:
- Netlify

## 📄 License

This project is part of the Digantara frontend assignment.

## 🙏 Acknowledgments

- **Digantara** for providing the satellite data API
- **shadcn/ui** for the beautiful component library
- **Vercel** for the deployment platform
- **React Window** for virtualization capabilities

---
