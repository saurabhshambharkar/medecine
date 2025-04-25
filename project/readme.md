# Online Pharmacy Application

A modern, responsive online pharmacy platform built with React and TypeScript. This application provides a seamless experience for users to browse medicines, manage prescriptions, and track orders.

## Features

- 🔍 Advanced medicine search with filters
- 🛒 Interactive shopping cart
- 📱 Fully responsive design
- 📋 Prescription upload and management
- 📦 Order tracking system
- 👤 User authentication and profiles
- 💊 Detailed product information
- 🏷️ Dynamic pricing and discounts

## Tech Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- React Hook Form for form handling
- Lucide React for icons
- Vite for build tooling

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/      # React Context providers
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── services/      # API and service functions
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Key Components

- **Cart System**: Real-time cart management with persistent storage
- **Search**: Advanced search functionality with debounced queries
- **Authentication**: User authentication with protected routes
- **Order Management**: Complete order lifecycle tracking
- **Prescription Handling**: Secure prescription upload and management

## Development

- Run development server: `npm run dev`
- Build for production: `npm run build`
- Preview production build: `npm run preview`
- Lint code: `npm run lint`

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.