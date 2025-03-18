-- Create portfolio_contact table
CREATE TABLE public.portfolio_contact (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    responded BOOLEAN DEFAULT FALSE
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.portfolio_contact ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Only allow inserts from authenticated users or service roles
CREATE POLICY "Enable insert for all users" ON public.portfolio_contact
    FOR INSERT TO public
    WITH CHECK (true);

-- Only allow read, update, and delete for authenticated users with specific roles
CREATE POLICY "Enable read for authenticated users" ON public.portfolio_contact
    FOR SELECT
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Enable update for authenticated users" ON public.portfolio_contact
    FOR UPDATE
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Enable delete for authenticated users" ON public.portfolio_contact
    FOR DELETE
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role'); 