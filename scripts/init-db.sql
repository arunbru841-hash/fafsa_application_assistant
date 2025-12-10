-- FAFSA Assistant Database Initialization Script
-- This script runs when the PostgreSQL container starts for the first time

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS fafsa;

-- Grant permissions
GRANT ALL ON SCHEMA fafsa TO fafsa_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA fafsa TO fafsa_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA fafsa TO fafsa_user;

-- Set default schema
ALTER USER fafsa_user SET search_path TO fafsa, public;

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'FAFSA Assistant database initialized successfully';
END $$;
