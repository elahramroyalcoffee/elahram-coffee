# Dashboard Components

This directory contains the main dashboard components for the admin panel.

## Components

### DashboardStats.tsx

- Displays real-time statistics cards
- Fetches data from Supabase (orders, products, revenue)
- Clickable cards that navigate to respective pages
- Uses shadcn/ui Card components with hover effects

### MonthlyChart.tsx

- Shows monthly orders and revenue charts
- Uses Recharts library for visualization
- Displays data for the last 12 months
- Includes both bar charts (orders) and line charts (revenue)

### QuickLinks.tsx

- Navigation cards for quick access to different admin sections
- Links to Products, Orders, Categories, and Reports
- Hover effects and color-coded design

## Features

- Real-time data fetching
- Responsive design
- Arabic RTL support
- Interactive charts and statistics
- Modern UI with shadcn/ui components
