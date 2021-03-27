CREATE TABLE IF NOT EXISTS ForumReply (
    reply_id UUID NOT NULL DEFAULT UUID_GENERATE_V1() PRIMARY KEY,
    comment_id UUID REFERENCES ForumComment(comment_id),
    stock_ticker VARCHAR(10) REFERENCES SecuritiesOverviews(StockTicker),
    author_id UUID REFERENCES Users(id),
    time_stamp BIGINT NOT NULL,
    content VARCHAR(5000),
    upvote_user_ids UUID [] DEFAULT '{}',
    downvote_user_ids UUID [] DEFAULT '{}',
    is_edited BOOLEAN DEFAULT FALSE
);