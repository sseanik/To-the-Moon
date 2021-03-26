CREATE TABLE IF NOT EXISTS parent_comment (
    parent_id UUID not null DEFAULT uuid_generate_v1() primary key,
    StockTicker VARCHAR(10) FOREIGN KEY,
    author_id UUID NOT NULL FOREIGN KEY,
    is_verified DEFAULT FALSE,
    timestamp TEXT NOT NULL,
    content TEXT,
    is_edited BOOLEAN DEFAULT FALSE,
    upvote_user_ids TEXT ARRAY,
    downvote_user_ids TEXT ARRAY
);