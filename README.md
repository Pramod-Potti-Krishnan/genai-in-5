# GenAI Micro-Learning Audible PWA

A mobile-first Progressive Web App designed for microlearning, featuring immersive audio content, interactive quizzes, and comprehensive progress tracking.

## Key Features

- **Mobile-first responsive design** - Optimized for all screen sizes with a focus on mobile experience
- **Audio-based microlearning** - Short, focused audio lectures for efficient learning on the go
- **Interactive quizzes and flashcards** - Reinforce learning with engaging revision tools
- **Progress tracking** - Comprehensive analytics to monitor your learning journey
- **User authentication** - Secure email/password login with JWT authentication

## Tech Stack

- **Frontend**: React with TypeScript, TailwindCSS, Shadcn UI components
- **Backend**: Express.js REST API
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: JWT-based authentication
- **State Management**: React Context + TanStack Query
- **Styling**: TailwindCSS with dynamic theming

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm/yarn
- PostgreSQL database (or Supabase account)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/genai-microlearning-app.git
   cd genai-microlearning-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in the required variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SESSION_SECRET`: Secret for session management
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon key

4. Start the development server:
   ```
   npm run dev
   ```

## Database Migration

If you're migrating from a direct PostgreSQL database to Supabase:

1. Create the necessary tables in Supabase using SQL scripts
2. Configure your `.env` file with Supabase credentials
3. Run the data migration tool: `node migrate-data-only.js`
4. Update db.ts to use the Supabase client

## Project Structure

```
├── client/              # Frontend code
│   ├── src/             
│   │   ├── components/  # UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility functions
│   │   ├── pages/       # Page components
│   │   └── styles/      # CSS styles
├── server/              # Backend code
│   ├── db.ts            # Database connection
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Data access layer
│   └── auth.ts          # Authentication logic
├── shared/              # Shared code
│   └── schema.ts        # Database schema definitions
└── types/               # TypeScript type definitions
```

## Deployment

This application can be deployed on any Node.js hosting platform:

1. Build the frontend: `npm run build`
2. Start the production server: `npm start`

## License

MIT