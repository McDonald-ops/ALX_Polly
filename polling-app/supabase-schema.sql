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

-- Create votes table (for tracking individual votes)
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX idx_votes_poll_id ON votes(poll_id);
CREATE INDEX idx_votes_option_id ON votes(option_id);

-- Create a function to update the votes count
CREATE OR REPLACE FUNCTION update_poll_option_votes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE poll_options 
    SET votes = votes + 1 
    WHERE id = NEW.option_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE poll_options 
    SET votes = votes - 1 
    WHERE id = OLD.option_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update vote counts
CREATE TRIGGER trigger_update_votes
  AFTER INSERT OR DELETE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_poll_option_votes();

-- Enable Row Level Security (RLS)
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to polls" ON polls
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to poll options" ON poll_options
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to votes" ON votes
  FOR SELECT USING (true);

-- Create policies for public insert access
CREATE POLICY "Allow public insert access to polls" ON polls
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert access to poll options" ON poll_options
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert access to votes" ON votes
  FOR INSERT WITH CHECK (true);

-- Create a view for poll results
CREATE VIEW poll_results AS
SELECT 
  p.id as poll_id,
  p.title,
  p.description,
  p.created_at,
  po.id as option_id,
  po.text as option_text,
  po.votes,
  COUNT(v.id) as total_votes_for_poll
FROM polls p
LEFT JOIN poll_options po ON p.id = po.poll_id
LEFT JOIN votes v ON p.id = v.poll_id
GROUP BY p.id, p.title, p.description, p.created_at, po.id, po.text, po.votes;
