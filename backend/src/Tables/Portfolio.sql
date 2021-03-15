CREATE TABLE IF NOT EXISTS Portfolio (
    PortfolioID UUID NOT NULL DEFAULT uuid_generate_v1() PRIMARY KEY,
    PortfolioName VARCHAR(30) not null,
    UserID uuid not null;
);