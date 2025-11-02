# Population Pyramids Website

Interactive population pyramids for 195 countries showing demographic data from 1970-2024.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Chart.js
- React

## Data Source

All data from UN World Population Prospects 2024 Revision

## Getting Started
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

- `/src/app` - Next.js pages
- `/src/components` - React components
- `/src/lib` - Utility functions
- `/src/types` - TypeScript interfaces
- `/src/data` - JSON data files

## Adding More Countries

1. Add country to `src/data/countries.json`
2. Create data file in `src/data/population/[country-slug].json`
3. Rebuild application

## Development

All population data is stored as static JSON files and pre-generated at build time for optimal performance.