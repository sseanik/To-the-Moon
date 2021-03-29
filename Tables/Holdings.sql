CREATE TABLE IF NOT EXISTS Holdings (
    investment_id TEXT NOT NULL DEFAULT uuid_generate_v1() PRIMARY KEY,
    user_id TEXT,
    portfolio_name VARCHAR(30),
    purchase_price MONEY,
    num_shares INT,
    purchase_date DATE,
    stock_ticker VARCHAR(10)
);
