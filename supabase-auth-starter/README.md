# Supabase Auth Starter

A complete authentication solution built with Next.js 15, Supabase, and shadcn/ui. This project provides a production-ready authentication system with user registration, login, protected routes, and a user dashboard.

## Features

- 🔐 **Secure Authentication** - Built with Supabase Auth
- ⚡ **Modern Stack** - Next.js 15, TypeScript, Tailwind CSS
- 🎨 **Beautiful UI** - shadcn/ui components
- 📱 **Responsive Design** - Works on all devices
- 🔒 **Protected Routes** - Automatic authentication checks
- 📊 **User Dashboard** - Personal account management
- 🚀 **Production Ready** - Error handling, loading states, validation

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- A Supabase account

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd supabase-auth-starter
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to Settings > API
3. Copy your Project URL and anon/public key

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: For server-side operations
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   └── register/
│   │       └── page.tsx          # Registration page
│   ├── dashboard/
│   │   └── page.tsx              # Protected dashboard
│   ├── layout.tsx                # Root layout with AuthProvider
│   └── page.tsx                  # Home page
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── LoginForm.tsx             # Login form component
│   ├── RegisterForm.tsx          # Registration form component
│   └── ProtectedRoute.tsx        # Route protection component
├── contexts/
│   └── AuthContext.tsx           # Authentication context
└── lib/
    ├── supabase.ts               # Supabase client configuration
    └── utils.ts                  # Utility functions
```

## Authentication Flow

1. **Home Page** (`/`) - Landing page with navigation to auth
2. **Login** (`/auth/login`) - User sign-in form
3. **Register** (`/auth/register`) - User registration form
4. **Dashboard** (`/dashboard`) - Protected user dashboard

### Features

- **User Registration**: Email/password registration with validation
- **User Login**: Secure authentication with error handling
- **Protected Routes**: Automatic redirection for unauthenticated users
- **User Dashboard**: Account information and management
- **Session Management**: Persistent authentication state
- **Error Handling**: Comprehensive error messages and validation

## Customization

### Styling

The project uses Tailwind CSS with shadcn/ui components. You can customize the design by:

1. Modifying the `tailwind.config.js` file
2. Updating component styles in the UI components
3. Adding custom CSS in `globals.css`

### Adding New Features

1. **New Protected Pages**: Wrap with `ProtectedRoute` component
2. **Additional Auth Methods**: Extend the `AuthContext`
3. **Database Operations**: Use the Supabase client in `lib/supabase.ts`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The project can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | No |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you have any questions or need help:

1. Check the [Supabase documentation](https://supabase.com/docs)
2. Review the [Next.js documentation](https://nextjs.org/docs)
3. Open an issue in this repository

## Acknowledgments

- [Supabase](https://supabase.com) for the authentication service
- [shadcn/ui](https://ui.shadcn.com) for the beautiful components
- [Next.js](https://nextjs.org) for the amazing framework
