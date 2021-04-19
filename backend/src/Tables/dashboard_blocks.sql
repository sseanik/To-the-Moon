CREATE TABLE IF NOT EXISTS dashboard_blocks (
    id UUID NOT NULL DEFAULT UUID_GENERATE_V1() PRIMARY KEY,
    type VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS portfolio_block (
    portfolio_name VARCHAR(30),
    detailed BOOLEAN default false
) INHERITS (dashboard_blocks);