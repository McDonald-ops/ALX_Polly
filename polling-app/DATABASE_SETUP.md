# Database Setup Guide

## 🚨 **IMPORTANT: Database Tables Not Found**

The error "Could not find the table 'public.polls' in the schema cache" indicates that the database tables haven't been created yet.

## 📋 **Step-by-Step Setup**

### 1. **Access Your Supabase Dashboard**
- Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
- Sign in and select your project

### 2. **Open SQL Editor**
- In your Supabase dashboard, click on "SQL Editor" in the left sidebar
- Click "New query"

### 3. **Run the Database Schema**
- Copy the entire content from `supabase-schema.sql` file
- Paste it into the SQL editor
- Click "Run" to execute the SQL

### 4. **Verify Tables Created**
- Go to "Table Editor" in the left sidebar
- You should see three tables:
  - `polls`
  - `poll_options` 
  - `votes`

### 5. **Test the Connection**
- Visit: http://localhost:3001/api/test-connection
- You should see: `{"status":"success","message":"Database connection successful"}`

## 🔧 **Alternative: Quick Setup Script**

If you prefer, you can run this SQL directly in your Supabase SQL Editor:

```sql
-- Create polls table
CREATE TABLE polls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create poll_options table
CREATE TABLE poll_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and create policies
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Public read/insert policies
CREATE POLICY "Allow public read access to polls" ON polls FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to polls" ON polls FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access to poll options" ON poll_options FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to poll options" ON poll_options FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access to votes" ON votes FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to votes" ON votes FOR INSERT WITH CHECK (true);
```

## ✅ **After Setup**

Once the tables are created:
1. **Create a poll**: Go to http://localhost:3001/polls/new
2. **Test voting**: Use the mock polls at http://localhost:3001
3. **Check database**: View created polls in Supabase Table Editor

## 🆘 **Need Help?**

If you're still having issues:
1. Check that your `.env.local` file has the correct Supabase credentials
2. Verify the project URL and anon key match your Supabase project
3. Make sure you're using the correct database (not a different project)

## 📞 **Support**

The application will work with mock data even without the database setup, but for full functionality, the database tables must be created.
