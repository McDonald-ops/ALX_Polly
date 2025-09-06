# SnapAPI Polling App

A modern, full-stack polling application built with Next.js 15, React 19, and Supabase. Create interactive polls, collect votes in real-time, and visualize results with a beautiful, responsive interface.

## 🚀 Features

- ✅ **Dynamic Poll Creation** - Create polls with 2-10 customizable options
- ✅ **Real-time Voting** - Vote on polls and see live results with progress bars
- ✅ **Modern UI/UX** - Built with shadcn/ui components and Tailwind CSS
- ✅ **Comprehensive Validation** - Client and server-side validation with Zod
- ✅ **Database Integration** - Full Supabase integration with PostgreSQL
- ✅ **Type Safety** - Complete TypeScript support throughout
- ✅ **Responsive Design** - Optimized for desktop, tablet, and mobile
- ✅ **Accessibility** - WCAG compliant with proper ARIA labels
- ✅ **Testing Ready** - Jest and React Testing Library setup included

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **API**: Next.js API Routes
- **Authentication**: Supabase Auth (ready for implementation)
- **Real-time**: Supabase Realtime (ready for implementation)

### Development Tools
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript strict mode
- **Package Manager**: npm

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- A Supabase account (free tier available)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd polling-app
npm install
```

### 2. Database Setup

#### Create Supabase Project
1. Visit [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (usually 2-3 minutes)
3. Note your project URL and anon key from Settings > API

#### Set Up Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `supabase-schema.sql`
3. Paste and run the SQL script
4. Verify tables were created in the **Table Editor**

#### Configure Environment Variables
1. Create `.env.local` in the project root:
```bash
cp .env.example .env.local  # If example exists
```

2. Add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app! 🎉

## 📖 Usage Examples

### Creating a Poll
1. Click "Create New Poll" on the home page
2. Enter a title (required) and optional description
3. Add 2-10 poll options using the dynamic form
4. Click "Create Poll" to save

### Voting on Polls
1. Browse polls on the home page or visit a direct poll link
2. Select your preferred option using the radio buttons
3. Click "Submit Vote" to record your choice
4. View real-time results with progress bars

### Managing Polls
- **View All Polls**: Home page shows recent polls
- **Delete Polls**: Use the "Remove" button on poll cards
- **Share Polls**: Copy the poll URL to share with others

## 🗄 Database Schema

The application uses a well-structured PostgreSQL schema with three main tables:

### Core Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| **`polls`** | Poll metadata | `id`, `title`, `description`, `created_at` |
| **`poll_options`** | Poll choices | `id`, `poll_id`, `text`, `votes` |
| **`votes`** | Individual votes | `id`, `poll_id`, `option_id`, `created_at` |

### Schema Features

- **🔄 Automatic Vote Counting**: Database triggers update vote counts in real-time
- **🔒 Row Level Security**: Configurable access policies (currently public for demo)
- **🗑️ Cascading Deletes**: Removing a poll automatically cleans up related data
- **⚡ Performance Optimized**: Strategic indexes for fast queries
- **🔗 Foreign Key Constraints**: Ensures data integrity across tables

### Database Functions

- **`update_poll_option_votes()`**: Trigger function that maintains vote counts
- **`poll_results`**: View for easy analytics and reporting

## 🔌 API Reference

The application provides a RESTful API built with Next.js API routes:

### Poll Management

#### Create Poll
```http
POST /api/polls
Content-Type: application/json

{
  "title": "Favorite Programming Language",
  "description": "What's your go-to language?",
  "options": ["JavaScript", "Python", "TypeScript", "Rust"]
}
```

**Response**: `201 Created` with complete poll data including generated IDs

#### Get All Polls
```http
GET /api/polls
```

**Response**: Array of polls with options and vote counts, sorted by creation date

#### Get Single Poll
```http
GET /api/polls/{id}
```

**Response**: Complete poll data with options and current vote counts

#### Delete Poll
```http
DELETE /api/polls/{id}
```

**Response**: `200 OK` with success confirmation

### Voting

#### Submit Vote
```http
POST /api/polls/{id}/vote
Content-Type: application/json

{
  "optionId": "option-uuid-here"
}
```

**Response**: Updated poll data with new vote counts

### Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional context",
  "code": "ERROR_CODE"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## 📁 Project Structure

```
polling-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── polls/         # Poll management endpoints
│   │   │   │   ├── [id]/      # Individual poll operations
│   │   │   │   │   └── vote/  # Voting endpoint
│   │   │   │   └── route.ts   # Poll CRUD operations
│   │   │   └── test-connection/ # Database health check
│   │   ├── polls/             # Poll pages
│   │   │   ├── [id]/          # Individual poll view
│   │   │   └── new/           # Poll creation page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui base components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── radio-group.tsx
│   │   │   └── textarea.tsx
│   │   ├── DateDisplay.tsx    # Date formatting component
│   │   ├── PollForm.tsx       # Poll creation form
│   │   ├── PollList.tsx       # Poll listing component
│   │   └── PollVotingForm.tsx # Voting interface
│   └── lib/                   # Utility libraries
│       ├── mockData.ts        # Mock data for development
│       ├── supabase.ts        # Supabase client & types
│       └── utils.ts           # Helper functions
├── public/                    # Static assets
├── supabase-schema.sql        # Database schema
├── jest.config.js            # Jest configuration
├── jest.setup.js             # Jest setup file
├── next.config.ts            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS config
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies & scripts
```

## 🧪 Testing

The project includes comprehensive testing setup with Jest and React Testing Library:

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions and API calls
- **Accessibility Tests**: Ensure components meet WCAG standards

### Example Test

```typescript
// PollForm.test.tsx
it('should validate required fields', async () => {
  render(<PollForm onSubmit={mockOnSubmit} />);
  
  await user.click(screen.getByRole('button', { name: /create poll/i }));
  
  expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
});
```

## 🔧 Development

### Adding New Features

1. **Database Changes**: Update `supabase-schema.sql` and run in Supabase
2. **API Routes**: Add new routes in `src/app/api/`
3. **Components**: Create reusable components in `src/components/`
4. **Pages**: Add new pages in `src/app/`
5. **Tests**: Add corresponding tests for new functionality

### Code Style Guidelines

- Use TypeScript strict mode
- Follow React Hook Form patterns for forms
- Use Zod for validation schemas
- Write comprehensive docstrings for functions
- Include inline comments for complex logic
- Follow shadcn/ui component patterns

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Push your code to GitHub/GitLab
   - Connect your repository to Vercel
   - Vercel will auto-detect Next.js

2. **Configure Environment Variables**
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Deploy!

3. **Custom Domain** (Optional)
   - Add your custom domain in Vercel dashboard
   - Configure DNS settings

### Other Platforms

The app can be deployed to any platform supporting Next.js:

| Platform | Difficulty | Features |
|----------|------------|----------|
| **Vercel** | ⭐ Easy | Auto-deploy, edge functions, analytics |
| **Netlify** | ⭐ Easy | Form handling, edge functions |
| **Railway** | ⭐⭐ Medium | Database included, full-stack |
| **DigitalOcean** | ⭐⭐⭐ Hard | Full control, custom setup |
| **AWS Amplify** | ⭐⭐⭐ Hard | Enterprise features, scaling |

### Production Checklist

- [ ] Set up production Supabase project
- [ ] Configure environment variables
- [ ] Set up custom domain (optional)
- [ ] Enable HTTPS
- [ ] Configure CORS if needed
- [ ] Set up monitoring/analytics

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following the code style guidelines
4. **Add tests** for new functionality
5. **Update documentation** if needed
6. **Submit a pull request**

### Pull Request Guidelines

- Include a clear description of changes
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Supabase](https://supabase.com/) - The backend platform
- [shadcn/ui](https://ui.shadcn.com/) - The component library
- [React Hook Form](https://react-hook-form.com/) - Form management
- [Zod](https://zod.dev/) - Schema validation

---

**Happy Polling!** 🗳️ If you find this project helpful, please give it a ⭐!
