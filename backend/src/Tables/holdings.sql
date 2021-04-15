CREATE TABLE IF NOT EXISTS holdings (
    investment_id TEXT NOT NULL DEFAULT uuid_generate_v1() PRIMARY KEY,
    user_id UUID,
    portfolio_name VARCHAR(30),
    purchase_price DOUBLE PRECISION,
    num_shares BIGINT,
    purchase_date DATE,
    stock_ticker VARCHAR(10)
);
