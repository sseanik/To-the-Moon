CREATE TABLE IF NOT EXISTS dashboard_blocks (
    id UUID NOT NULL DEFAULT UUID_GENERATE_V1() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES users(id),
    type VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS portfolio_block (
    portfolio_name VARCHAR(30),
    detailed BOOLEAN default false
) INHERITS (dashboard_blocks);

CREATE TABLE IF NOT EXISTS news_block (
    stock_ticker VARCHAR(10)
) INHERITS (dashboard_blocks);

CREATE TABLE IF NOT EXISTS stock_block (
    stock_ticker VARCHAR(10)
) INHERITS (dashboard_blocks);