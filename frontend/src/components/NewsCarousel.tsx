import { Carousel } from "react-bootstrap";
import NewsAPI from "../api/news";
import { useEffect, useState } from "react";
import { NewsItem } from "./NewsCard";

const carouselStyle = {
  width: "100%",
  boxShadow: "5px 10px 8px #888888"
};

const bgStyle = {
  width: "100%",
  height: "55vh",
  opacity: "0.85",
  padding: "2.5vh",
  backgroundColor: "rgba(0, 0, 0, 0.9)",
};

const textStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  padding: "20px",
};

const NewsCarousel: React.FC = () => {
  const [newsData, setNewsData] = useState<Array<NewsItem>>([]);

  useEffect(() => {
    NewsAPI.getFeaturedNews()
      .then(news => setNewsData(news.articles))
      .catch(err => console.log(err));
  }, []);

  const newsItem = (props: NewsItem, idx: number) => (
    <Carousel.Item key={idx}>
      <a href={props.url} target="_blank" rel="noreferrer">
        <img
          className="d-block w-100"
          src={props.image}
          alt={`Background for news: ${props.headline}`}
          style={bgStyle}
        />
        <Carousel.Caption style={textStyle}>
          <h3>{props.headline}</h3>
          <p>{props.summary}</p>
        </Carousel.Caption>
      </a>
    </Carousel.Item>
  );

  return (
    <Carousel style={carouselStyle}>
      {newsData.slice(0, 5).map((props, idx) => newsItem(props, idx))}
    </Carousel>
  );
};

export default NewsCarousel;