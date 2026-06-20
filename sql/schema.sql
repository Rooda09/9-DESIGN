-- SQL-first draft. Prisma schema is the recommended source of truth.
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN', 'MODERATOR');
CREATE TYPE domain_key AS ENUM ('ARCHITECTURE', 'PHOTOGRAPHY', 'BRANDING');
CREATE TYPE engine_type AS ENUM ('IMAGE', 'CLIP', 'AUDIO', 'UPSCALE');
CREATE TYPE job_type AS ENUM ('IMAGE_GENERATION', 'CLIP_GENERATION', 'AUDIO_GENERATION', 'IMAGE_UPSCALE', 'CLIP_UPSCALE');
CREATE TYPE job_status AS ENUM ('DRAFT', 'QUEUED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');
CREATE TYPE visibility AS ENUM ('PRIVATE', 'PUBLIC_OUTPUT_ONLY', 'PUBLIC_PROMPT_PREVIEW', 'FULL_REMIX', 'PAID_TEMPLATE');

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'USER',
  avatar_url TEXT,
  bio TEXT,
  is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE token_wallets (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE domains (
  id TEXT PRIMARY KEY,
  key domain_key UNIQUE NOT NULL,
  label_en TEXT NOT NULL,
  label_ar TEXT NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE dropdown_groups (
  id TEXT PRIMARY KEY,
  domain_id TEXT REFERENCES domains(id),
  key TEXT UNIQUE NOT NULL,
  label_en TEXT NOT NULL,
  label_ar TEXT NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  is_required BOOLEAN NOT NULL DEFAULT FALSE,
  is_advanced BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE dropdown_options (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL REFERENCES dropdown_groups(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  label_en TEXT NOT NULL,
  label_ar TEXT NOT NULL,
  best_for TEXT,
  description_en TEXT,
  description_ar TEXT,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  metadata JSONB,
  UNIQUE(group_id, value)
);

CREATE TABLE ai_engines (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type engine_type NOT NULL,
  provider TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  supports_image_to_image BOOLEAN NOT NULL DEFAULT FALSE,
  supports_text_to_image BOOLEAN NOT NULL DEFAULT FALSE,
  supports_image_to_video BOOLEAN NOT NULL DEFAULT FALSE,
  supports_text_to_video BOOLEAN NOT NULL DEFAULT FALSE,
  supports_audio BOOLEAN NOT NULL DEFAULT FALSE,
  supports_upscale BOOLEAN NOT NULL DEFAULT FALSE,
  supports_reference_lock BOOLEAN NOT NULL DEFAULT FALSE,
  default_token_cost INTEGER NOT NULL DEFAULT 0,
  config JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
