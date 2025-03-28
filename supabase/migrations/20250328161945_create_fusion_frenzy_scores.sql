-- Create dk-fusion-frenzy-scores table
CREATE TABLE public.dk_fusion_frenzy_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_name TEXT NOT NULL CHECK (char_length(player_name) > 0 AND char_length(player_name) <= 50),
    time_survived REAL NOT NULL CHECK (time_survived >= 0),
    date_achieved TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comments to the table and columns
COMMENT ON TABLE public.dk_fusion_frenzy_scores IS 'Stores scores for the Fusion Frenzy game.';
COMMENT ON COLUMN public.dk_fusion_frenzy_scores.id IS 'Unique identifier for each score entry.';
COMMENT ON COLUMN public.dk_fusion_frenzy_scores.player_name IS 'Name of the player who achieved the score.';
COMMENT ON COLUMN public.dk_fusion_frenzy_scores.time_survived IS 'Survival time in seconds.';
COMMENT ON COLUMN public.dk_fusion_frenzy_scores.date_achieved IS 'Timestamp when the score was achieved.';

-- Set up Row Level Security (RLS)
ALTER TABLE public.dk_fusion_frenzy_scores ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow public read access for the leaderboard
CREATE POLICY "Enable read access for all users" ON public.dk_fusion_frenzy_scores
    FOR SELECT USING (true);

-- Allow anonymous or authenticated users to insert scores
CREATE POLICY "Enable insert for all users" ON public.dk_fusion_frenzy_scores
    FOR INSERT WITH CHECK (true);

-- Optionally restrict update/delete (e.g., only allow service_role)
-- CREATE POLICY "Enable update for service_role" ON public.dk_fusion_frenzy_scores
--    FOR UPDATE USING (auth.role() = 'service_role');

-- CREATE POLICY "Enable delete for service_role" ON public.dk_fusion_frenzy_scores
--    FOR DELETE USING (auth.role() = 'service_role');

-- Create an index for faster sorting on the leaderboard
CREATE INDEX idx_dk_fusion_frenzy_scores_time_survived ON public.dk_fusion_frenzy_scores(time_survived DESC); 