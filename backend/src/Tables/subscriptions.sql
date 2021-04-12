CREATE TABLE IF NOT EXISTS subscriptions (
    watchlist_id UUID,
    user_id UUID,
    PRIMARY KEY(watchlist_id, user_id)
);
