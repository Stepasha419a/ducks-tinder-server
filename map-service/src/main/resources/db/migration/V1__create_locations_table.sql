CREATE TYPE capital_enum AS ENUM ('primary', 'admin', 'minor');

CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    city VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    admin_region VARCHAR(255) NOT NULL,
    capital capital_enum,
    created_at timestamp(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);