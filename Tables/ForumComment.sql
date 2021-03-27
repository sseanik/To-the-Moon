CREATE TABLE IF NOT EXISTS ForumComment (
    comment_id UUID NOT NULL DEFAULT UUID_GENERATE_V1() PRIMARY KEY,
    stock_ticker VARCHAR(10) REFERENCES SecuritiesOverviews(StockTicker),
    author_id UUID REFERENCES Users(id),
    time_stamp BIGINT NOT NULL,
    content VARCHAR(5000),
    upvote_user_ids UUID [],
    downvote_user_ids UUID [],
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE
);