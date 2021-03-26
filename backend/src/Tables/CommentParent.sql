CREATE TABLE IF NOT EXISTS parent_comment (
    parent_id UUID NOT NULL DEFAULT UUID_GENERATE_V1() PRIMARY KEY,
    stock_ticker VARCHAR(10) FOREIGN KEY REFERENCES SecuritiesOverviews(StockTicker),
    author_id UUID NOT NULL FOREIGN KEY REFERENCES Users(id),
    is_verified FOREIGN KEY REFERENCES Users(is_verified),
    time_stamp TIMESTAMP NOT NULL,
    content TEXT,
    is_edited BOOLEAN DEFAULT FALSE,
    upvote_user_ids UUID [],
    downvote_user_ids UUID []
);