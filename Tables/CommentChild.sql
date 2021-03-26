CREATE TABLE IF NOT EXISTS ChildComment (
    child_id UUID NOT NULL DEFAULT UUID_GENERATE_V1() PRIMARY KEY,
    parent_id UUID REFERENCES ParentComment(parent_id),
    stock_ticker VARCHAR(10) REFERENCES SecuritiesOverviews(StockTicker),
    author_id UUID REFERENCES Users(id),
    time_stamp TIMESTAMP NOT NULL,
    content VARCHAR(5000),
    upvote_user_ids UUID [],
    downvote_user_ids UUID [],
    is_edited BOOLEAN DEFAULT FALSE
);