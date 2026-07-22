ALTER TABLE subscriptions
ADD COLUMN super_likes_count INTEGER NOT NULL DEFAULT 0;

ALTER TABLE subscriptions
ADD CONSTRAINT super_likes_count_non_negative
CHECK (super_likes_count >= 0);


ALTER TABLE subscriptions
ADD COLUMN search_boosts_count INTEGER NOT NULL DEFAULT 0;

ALTER TABLE subscriptions
ADD CONSTRAINT search_boosts_count_non_negative
CHECK (search_boosts_count >= 0);


ALTER TABLE subscriptions
ADD COLUMN cancelled_at timestamp(3) without time zone;

ALTER TABLE subscriptions
ADD COLUMN search_boost_expires_at timestamp(3) without time zone;


ALTER TABLE subscriptions DROP CONSTRAINT subscriptions_pkey;

ALTER TABLE subscriptions ADD COLUMN id UUID PRIMARY KEY DEFAULT gen_random_uuid();

CREATE INDEX idx_subscriptions_user_id ON subscriptions (user_id);
