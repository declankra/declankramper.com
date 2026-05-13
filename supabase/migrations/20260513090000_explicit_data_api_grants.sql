-- Explicit Data API grants for Supabase's May/October 2026 public schema change.
-- RLS policies continue to control row-level access.

grant usage on schema public to anon, authenticated, service_role;

grant insert on table public.portfolio_contact to anon;
grant select, insert, update, delete on table public.portfolio_contact to authenticated, service_role;

grant select, insert on table public.dk_fusion_frenzy_scores to anon;
grant select, insert, update, delete on table public.dk_fusion_frenzy_scores to authenticated, service_role;
