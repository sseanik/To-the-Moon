CREATE TABLE IF NOT EXISTS watchlists (
    watchlist_id TEXT NOT NULL DEFAULT uuid_generate_v1() PRIMARY KEY,
    user_id UUID,
    watchlist_name VARCHAR(30),
    watchlist_description TEXT,
    stock_tickers VARCHAR(10) [] DEFAULT ARRAY []::VARCHAR(10) [],
    proportions DECIMAL(8,4) [] DEFAULT ARRAY []::DECIMAL(8,4) []
);