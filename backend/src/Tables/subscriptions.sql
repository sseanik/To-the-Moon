CREATE TABLE IF NOT EXISTS subscriptions (
    watchlist_id UUID REFERENCES Watchlists(watchlist_id),
    user_id UUID REFERENCES Users(id),
    PRIMARY KEY(watchlist_id, user_id)
);
