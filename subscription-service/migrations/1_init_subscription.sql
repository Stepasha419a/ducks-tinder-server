CREATE TABLE IF NOT EXISTS subscriptions (
    user_id UUID PRIMARY KEY,
    subscription VARCHAR(40) NOT NULL,
    login VARCHAR(39) NOT NULL,
    
    expires_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
)