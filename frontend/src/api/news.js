import * as config from '../config.json';
import Utils from './utils';

const url = `http://localhost:${config.BACKEND_PORT}`;

const NewsAPI = {
  getFeaturedNews: () => {
    // TODO: fill with our news api implementation in backend
    const endpoint = '/news';
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Utils.getToken()}`,
      },
    };

    // return Utils.getJSON(`${url}${endpoint}`, options);
    return {
      "data": [
        {
            "news_url": "https://seekingalpha.com/article/4414148-all-good-near-term-look-out-next-year",
            "image_url": "https://cdn.snapi.dev/images/v1/u/d/the-mirage-within-the-market-a-current-snapshot-724843.jpg",
            "title": "All Good Near Term, Look Out Next Year",
            "text": "All Good Near Term, Look Out Next Year",
            "source_name": "Seeking Alpha",
            "date": "Tue, 16 Mar 2021 00:05:30 -0400",
            "topics": [
                "paylimitwall"
            ],
            "sentiment": "Neutral",
            "type": "Article"
        },
        {
            "news_url": "https://seekingalpha.com/article/4414140-how-to-spot-a-bubble",
            "image_url": "https://cdn.snapi.dev/images/v1/i/a/etf21-724822.jpg",
            "title": "How To Spot A Bubble",
            "text": "The defining feature of a bubble is inconsistency between expected returns based on price behavior and expected returns based on valuations. If we compare our most reliable valuation measures with the valuation measures that one would obtain from a proper long-term discounted cash flow analysis, we find that they're nearly identical.",
            "source_name": "Seeking Alpha",
            "date": "Mon, 15 Mar 2021 22:20:21 -0400",
            "topics": [
                "paylimitwall"
            ],
            "sentiment": "Neutral",
            "type": "Article"
        },
        {
            "news_url": "https://seekingalpha.com/article/4414122-deeper-look-at-sector-realignment-technically-speaking-for-3-15",
            "image_url": "https://cdn.snapi.dev/images/v1/q/k/103905600-gettyimages-94868577-nuegmzzwyp-724793.jpg",
            "title": "A Deeper Look At The Sector Realignment (Technically Speaking For 3/15)",
            "text": "The reflation trade is still very much on. The Fed will announce its latest policy action this week.",
            "source_name": "Seeking Alpha",
            "date": "Mon, 15 Mar 2021 20:57:29 -0400",
            "topics": [
                "tanalysis",
                "paylimitwall"
            ],
            "sentiment": "Neutral",
            "type": "Article"
        },
        {
            "news_url": "https://www.youtube.com/watch?v=H8JLwo4FNS4",
            "image_url": "https://cdn.snapi.dev/images/v1/k/3/valuations-are-elevated-because-so-much-money-is-in-the-market-bmo-global-asset-management-724797.jpg",
            "title": "Valuations are elevated because so much money is in the market: BMO Global Asset Management",
            "text": "Yahoo Finance's Adam Shapiro and Seana Smith spoke with BMO Global Asset Management CIO Ernesto Ramos about what sectors investors should consider as the economy opens.",
            "source_name": "Yahoo Finance",
            "date": "Mon, 15 Mar 2021 20:49:46 -0400",
            "topics": [],
            "sentiment": "Neutral",
            "type": "Video"
        },
        {
            "news_url": "https://www.youtube.com/watch?v=uTRB5Pr4PD0",
            "image_url": "https://cdn.snapi.dev/images/v1/r/n/jim-cramer-risk-tolerance-investing-and-the-stock-market-724766.jpg",
            "title": "Jim Cramer: Risk tolerance, investing and the stock market",
            "text": "\"Mad Money\" host Jim Cramer breaks down how investors can take on the appropriate amount of risk in the stock market.",
            "source_name": "CNBC Television",
            "date": "Mon, 15 Mar 2021 19:48:30 -0400",
            "topics": [
                "cramer",
                "madmoney"
            ],
            "sentiment": "Neutral",
            "type": "Video"
        },
        {
            "news_url": "https://www.youtube.com/watch?v=8Elqe9CHFAk",
            "image_url": "https://cdn.snapi.dev/images/v1/p/2/the-fed-learns-from-its-mistakes-on-employment-mike-konczal-724751.jpg",
            "title": "The Fed Learns From Its Mistakes on Employment: Mike Konczal",
            "text": "Mar.15 -- Mike Konczal, director of progressive thought at the Roosevelt Institute, speaks with Bloomberg's Caroline Hyde, Romaine Bostick and Joe Weisenthal on \"What'd You Miss?\" about this week's FOMC meeting and the unequal economic recovery.",
            "source_name": "Bloomberg Markets and Finance",
            "date": "Mon, 15 Mar 2021 19:16:41 -0400",
            "topics": [],
            "sentiment": "Neutral",
            "type": "Video"
        },
        {
            "news_url": "https://www.cnbc.com/2021/03/15/roaring-economy-to-benefit-more-than-reopening-trades-credit-suisse.html",
            "image_url": "https://cdn.snapi.dev/images/v1/5/3/106836583-1612562671268-gettyimages-1300566210-dsc07193-2021020530033829-724730.jpeg",
            "title": "Roaring economy will benefit more than just reopening trades, Credit Suisse analyst says",
            "text": "Credit Suisse's Jonathan Golub said he believes the reopenings will be bigger and benefit more industries than Wall Street thinks.",
            "source_name": "CNBC",
            "date": "Mon, 15 Mar 2021 18:34:21 -0400",
            "topics": [],
            "sentiment": "Positive",
            "type": "Article"
        },
        {
            "news_url": "https://www.cnbc.com/2021/03/15/stock-market-open-to-close-news.html",
            "image_url": "https://cdn.snapi.dev/images/v1/w/4/106847886-1614703835471-nyse-trading-floor-ob-photo-210302-press-10-724663.jpg",
            "title": "Stock futures are little changed after Dow, S&P close at record",
            "text": "U.S. stock index futures were little changed during overnight trading on Monday.",
            "source_name": "CNBC",
            "date": "Mon, 15 Mar 2021 18:03:19 -0400",
            "topics": [],
            "sentiment": "Neutral",
            "type": "Article"
        },
        {
            "news_url": "https://investorplace.com/2021/03/tech-will-drop-then-soar/",
            "image_url": "https://cdn.snapi.dev/images/v1/1/0/106845849-16142791783273-nyse-bell-podium-ob-photo-210225-press-39-jpg-722100-724645.jpg",
            "title": "Tech Will Drop, then Soar",
            "text": "Innovation vs. inflation is a real battle … why Luke Lango is betting big on innovation … but get ready for some market tantrums when inflation comes We have a challenge … On one hand, innovative tech stocks have been generating triple- and quadruple-digit returns in recent months.",
            "source_name": "InvestorPlace",
            "date": "Mon, 15 Mar 2021 17:36:17 -0400",
            "topics": [],
            "sentiment": "Positive",
            "type": "Article"
        },
        {
            "news_url": "https://www.etftrends.com/etf-strategist-channel/more-economic-and-market-upside-to-come/",
            "image_url": "https://cdn.snapi.dev/images/v1/s/t/stock-exchange-738671-1280-53-721896-724646.jpg",
            "title": "More Economic and Market Upside to Come",
            "text": "Our work suggests that U.S. economic prospects continue to brighten. Higher long-term interest rates currently reflect market expectations for faster economic growth and somewhat higher inflation.",
            "source_name": "ETF Trends",
            "date": "Mon, 15 Mar 2021 17:33:33 -0400",
            "topics": [],
            "sentiment": "Positive",
            "type": "Article"
        },
        {
            "news_url": "https://seekingalpha.com/article/4414096-bond-yields-to-continue-rising",
            "image_url": "https://cdn.snapi.dev/images/v1/c/k/106727425-1601646130354-nyse-724634.jpg",
            "title": "Bond Yields Will Continue To Rise",
            "text": "Bond yields will continue to rise as the pandemic resides, economic growth continues to pick up, and the Federal Reserve continues to err on the side of monetary ease.",
            "source_name": "Seeking Alpha",
            "date": "Mon, 15 Mar 2021 17:31:52 -0400",
            "topics": [
                "paylimitwall"
            ],
            "sentiment": "Positive",
            "type": "Article"
        },
        {
            "news_url": "https://www.youtube.com/watch?v=hps-_sBZR1w",
            "image_url": "https://cdn.snapi.dev/images/v1/m/q/fomc-preview-what-to-expect-from-the-march-2-day-policy-meeting-724652.jpg",
            "title": "FOMC preview: What to expect from the March 2-day policy meeting",
            "text": "Yahoo Finance's Brian Cheung weighs in on what to expect from the upcoming FOMC meeting.",
            "source_name": "Yahoo Finance",
            "date": "Mon, 15 Mar 2021 17:26:29 -0400",
            "topics": [],
            "sentiment": "Neutral",
            "type": "Video"
        },
        {
            "news_url": "https://www.youtube.com/watch?v=oJufvOtVOOc",
            "image_url": "https://cdn.snapi.dev/images/v1/p/n/market-recap-monday-march-15-stocks-close-at-highs-of-the-day-724598.jpg",
            "title": "Market Recap: Monday, March 15: Stocks close at highs of the day",
            "text": "Stocks ended mixed on Friday as technology stocks came under renewed pressure. Treasury yields resumed their march higher.",
            "source_name": "Yahoo Finance",
            "date": "Mon, 15 Mar 2021 17:17:22 -0400",
            "topics": [],
            "sentiment": "Positive",
            "type": "Video"
        },
        {
            "news_url": "https://www.youtube.com/watch?v=1LPjOqMlxBM",
            "image_url": "https://cdn.snapi.dev/images/v1/l/n/whats-the-outlook-for-us-gdp-in-2021-724625.jpg",
            "title": "What's the Outlook for U.S. GDP in 2021?",
            "text": "President Biden's $1.9 trillion stimulus package is now arriving. Analysts expect the massive cash injection will result in a very strong second quarter.",
            "source_name": "Bloomberg Markets and Finance",
            "date": "Mon, 15 Mar 2021 17:15:29 -0400",
            "topics": [],
            "sentiment": "Neutral",
            "type": "Video"
        },
        {
            "news_url": "https://seekingalpha.com/article/4414079-remember-value-investing",
            "image_url": "https://cdn.snapi.dev/images/v1/1/4/106419724-1583164885503rts34fgq-dahzkkx03s-724559.jpg",
            "title": "Remember Value Investing?",
            "text": "After being ignored for 13 years, value sectors such as financials, materials, energy and industrials are back and we believe economic acceleration and rising rates set the stage for a multiyear recovery.",
            "source_name": "Seeking Alpha",
            "date": "Mon, 15 Mar 2021 16:54:49 -0400",
            "topics": [
                "paylimitwall"
            ],
            "sentiment": "Neutral",
            "type": "Article"
        },
        {
            "news_url": "https://www.youtube.com/watch?v=1PlkDd2uDsk",
            "image_url": "https://cdn.snapi.dev/images/v1/7/d/expect-no-change-in-policy-from-the-feds-fomc-meeting-strategist-charles-schwab-724558.jpg",
            "title": "Expect no change in policy from the Fed's FOMC meeting: Strategist Charles Schwab",
            "text": "Yahoo Finance's Alexis Christoforous spoke with Charles Schwab Chief Fixed Income Strategist about what to expect from the Fed's upcoming FOMC meeting.",
            "source_name": "Yahoo Finance",
            "date": "Mon, 15 Mar 2021 16:52:52 -0400",
            "topics": [],
            "sentiment": "Neutral",
            "type": "Video"
        },
        {
            "news_url": "https://www.kiplinger.com/investing/stocks/602427/stock-market-today-031521-recovery-stocks-lead-the-way-as-stocks-calmly-climb",
            "image_url": "https://cdn.snapi.dev/images/v1/s/m/wedw322-6wdaea84k2-715341-724637.jpg",
            "title": "Stock Market Today: Recovery Plays Lead the Way as Stocks Calmly Climb",
            "text": "Airlines, restaurants and cruise liners were among some of the session's biggest gainers in a smooth, fruitful Monday for stocks.",
            "source_name": "Kiplinger",
            "date": "Mon, 15 Mar 2021 16:52:00 -0400",
            "topics": [],
            "sentiment": "Positive",
            "type": "Article"
        },
        {
            "news_url": "https://www.marketwatch.com/story/fed-should-switch-up-its-playbook-and-buy-more-treasurys-fewer-mortgage-bonds-urge-analysts-11615844557",
            "image_url": "https://cdn.snapi.dev/images/v1/l/w/im-311840width620size15183867141162515-724640.jpg",
            "title": "Market Extra: Fed should ‘switch' up its playbook and buy more Treasurys, fewer mortgage bonds, urge analysts",
            "text": "As the economy reopens, the Federal Reserve should consider tweaking its $120 billion monthly asset purchase program to allow for more Treasury purchases and fewer government-backed mortgage bonds, say analysts.",
            "source_name": "Market Watch",
            "date": "Mon, 15 Mar 2021 16:42:00 -0400",
            "topics": [
                "paylimitwall"
            ],
            "sentiment": "Neutral",
            "type": "Article"
        },
        {
            "news_url": "https://www.cnbc.com/2021/03/15/why-this-weeks-fed-meeting-could-be-march-madness-for-markets.html",
            "image_url": "https://cdn.snapi.dev/images/v1/q/z/a-market-that-gets-no-respect-stocks-near-all-time-highs-despite-hand-wringing-723660-724496.jpg",
            "title": "Why this week's Fed meeting could be 'March madness' for markets",
            "text": "The ball is in Fed Chairman Jerome Powell's court, and what he says Wednesday could tip when the Fed might begin to change policy.",
            "source_name": "CNBC",
            "date": "Mon, 15 Mar 2021 16:19:57 -0400",
            "topics": [],
            "sentiment": "Negative",
            "type": "Article"
        },
        {
            "news_url": "https://www.proactiveinvestors.com//companies/news/943829/us-stocks-close-higher-on-reopening-optimism-943829.html?SNAPI",
            "image_url": "https://cdn.snapi.dev/images/v1/z/8/nasdaq-leads-the-way-as-yields-decline-following-ecb-decision-to-increase-bond-buys-719134-724438.jpg",
            "title": "US stocks close higher on reopening optimism",
            "text": "4:05pm: US equities close higher  US stocks closed higher as investors grew optimistic about pandemic reopenings and how that positively impacts the economy. The Dow Jones Industrial Average jumped to an all-time high as rising optimism continued to encourage the rotation into cyclical stocks amid the passage of the $1.9 trillion stimulus bill.",
            "source_name": "Proactive Investors",
            "date": "Mon, 15 Mar 2021 16:14:56 -0400",
            "topics": [],
            "sentiment": "Positive",
            "type": "Article"
        }
      ]
    }
  },
  getNewsByStock: (stock) => {
    const endpoint = `/news?symbol=${stock}`;
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Utils.getToken()}`,
      },
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
};

export default NewsAPI;
