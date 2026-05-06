-- Optional public bucket used in some MemoryMint projects (safe if it already exists).
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-photos', 'user-photos', true)
ON CONFLICT (id) DO NOTHING;
