CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'moderator', 'user'))
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255),
  description TEXT,
  spiciness_level NUMERIC(3, 2) CHECK (spiciness_level >= 1 AND spiciness_level <= 5),
  photos TEXT[] DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_identifier VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS auth_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_login TIMESTAMPTZ,
  session_expires TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_auth_log_user_id ON auth_log(user_id);

CREATE TABLE IF NOT EXISTS languages (
  slug VARCHAR(255) NOT NULL,
  lng VARCHAR(7) NOT NULL,
  value TEXT,
  last_updated TIMESTAMPTZ DEFAULT now(),
  approved BOOLEAN DEFAULT false,
  context_description TEXT,
  UNIQUE(slug, lng)
);

CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url VARCHAR(2048),
  tags TEXT[],
  description TEXT,
  resolution VARCHAR(50)
);
