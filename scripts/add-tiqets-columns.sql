-- Añadir columnas para Tiqets
ALTER TABLE experiences
ADD COLUMN IF NOT EXISTS tiqets_venue_id TEXT,
ADD COLUMN IF NOT EXISTS tiqets_campaign TEXT;
