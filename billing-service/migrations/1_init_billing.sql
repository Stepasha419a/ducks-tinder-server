CREATE TABLE
    IF NOT EXISTS credit_cards (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL UNIQUE,
        pan VARCHAR(16) NOT NULL,
        holder VARCHAR(40),
        cvc VARCHAR(4),
        expires_at timestamp(3) without time zone NOT NULL,
        created_at timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS purchases (
        id UUID PRIMARY KEY,
        credit_card_id UUID REFERENCES credit_cards (id) ON DELETE SET NULL,
        user_id UUID NOT NULL,
        amount bigint NOT NULL,
        created_at timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
    );