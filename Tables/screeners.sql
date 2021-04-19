CREATE TABLE IF NOT EXISTS screeners (
    screener_name VARCHAR(30),
    user_id UUID REFERENCES Users(id),
    parameters TEXT,
    PRIMARY KEY(screener_name, user_id)
);