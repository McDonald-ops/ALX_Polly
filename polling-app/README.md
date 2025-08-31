# SnapAPI Polling App

A modern polling application built with Next.js, React Hook Form, Zod validation, and Supabase for real-time data storage.

## Features

- ✅ **Create Polls** - Dynamic form with 2-10 options
- ✅ **Real-time Voting** - Vote on polls and see live results
- ✅ **Modern UI** - Built with shadcn/ui components
- ✅ **Form Validation** - Client and server-side validation with Zod
- ✅ **Database Integration** - Full Supabase integration with PostgreSQL
- ✅ **Responsive Design** - Works on all devices
- ✅ **Type Safety** - Full TypeScript support

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Forms**: React Hook Form, Zod validation
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd polling-app
npm install
```

### 2. Set Up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

2. **Set Up Database Schema**
   - In your Supabase dashboard, go to the SQL Editor
   - Copy and paste the contents of `supabase-schema.sql`
   - Run the SQL to create the database tables and functions

3. **Configure Environment Variables**
   - Copy `env.example` to `.env.local`
   - Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Database Schema

The app uses three main tables:

- **`polls`** - Stores poll information (title, description, timestamps)
- **`poll_options`** - Stores poll options with vote counts
- **`votes`** - Tracks individual votes (for analytics)

### Key Features of the Schema

- **Automatic Vote Counting** - Triggers automatically update vote counts
- **Row Level Security** - Public read/write access for demo purposes
- **Cascading Deletes** - Deleting a poll removes all related data
- **Indexes** - Optimized for performance

## API Endpoints

### Create Poll
```
POST /api/polls
Body: { title: string, description?: string, options: string[] }
```

### Get All Polls
```
GET /api/polls
```

### Get Single Poll
```
GET /api/polls/[id]
```

### Vote on Poll
```
POST /api/polls/[id]/vote
Body: { optionId: string }
```

## Project Structure

```
src/
├── app/
│   ├── api/polls/          # API routes
│   ├── polls/              # Poll pages
│   └── page.tsx            # Home page
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── PollForm.tsx        # Poll creation form
└── lib/
    ├── supabase.ts         # Supabase client
    └── utils.ts            # Utility functions
```

## Development

### Adding New Features

1. **Database Changes**: Update `supabase-schema.sql` and run in Supabase
2. **API Routes**: Add new routes in `src/app/api/`
3. **Components**: Create reusable components in `src/components/`
4. **Pages**: Add new pages in `src/app/`

### Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - feel free to use this project for your own applications!
