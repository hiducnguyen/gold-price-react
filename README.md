# Gold Price Tracker - React Frontend

A React TypeScript application for tracking gold prices and investment portfolios, migrated from a Python Flask server-side application.

## Features

- **Real-time Gold Prices**: Fetch prices from PNJ, DOJI, and Mi Hong
- **Bitcoin Tracking**: Monitor Bitcoin investment with profit/loss calculations  
- **Cash Management**: Track cash holdings with comments
- **Asset Summary**: View total asset allocation and percentages
- **Data Persistence**: Automatic localStorage saving of user inputs
- **View Modes**: Switch between Gold-only, Bitcoin-only, Cash-only, or All views
- **Vietnamese Interface**: Fully localized for Vietnamese users

## Technology Stack

- **React 19** with TypeScript
- **Vite** for build tooling and development server
- **CSS Modules** for styling (maintains original gold-themed design)
- **Local Storage** for data persistence
- **Polling** for real-time price updates (60-second intervals)

## Development

### Prerequisites
- Node.js 18+ 
- npm

### Installation
```bash
cd frontend
npm install
```

### Development Server
```bash
npm run dev
```
Visit `http://localhost:5173`

### Build for Production
```bash
npm run build
```

## Input Formats

### Gold Holdings
```
seller,buy_price_in_thousands,amount_in_chi
pnj,8400,1
doji,16000,2
mih,9000,1.5
```

### Cash Entries
```
amount_in_millions optional_comment
100 Emergency fund
50 Investment savings
25
```

## Deployment

The application builds to static files and can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

### Deployment on Vercel
```
vercel
```