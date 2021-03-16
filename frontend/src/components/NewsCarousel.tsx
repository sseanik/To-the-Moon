import { Carousel } from "react-bootstrap";
import NewsAPI from "../api/news";
import { useEffect, useState } from "react";

const carouselStyle = {
  height: "500px",
  width: "100%",
};

const bgStyle = {
  width: "100%",
  height: "55vh",
  opacity: "0.85"
};

const textStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.3)",
};

interface NewsItem {
  news_url: string;
  image_url: string;
  title: string;
  text: string;
  source_name: string;
  date: string;
  topics: Array<string>;
  sentiment: string;
  type: string;
}

const NewsCarousel: React.FC = () => {
  const [newsData, setNewsData] = useState<Array<NewsItem>>([]);

  useEffect(() => {
    const news = NewsAPI.getFeaturedNews();
    setNewsData(news.data);
  }, []);

  const newsItem = (props: NewsItem, idx: number) => (
    <Carousel.Item key={idx}>
      <a href={props.news_url} target="_blank" rel="noreferrer">
        <img
          className="d-block w-100"
          src={props.image_url}
          alt={`Background for news: ${props.title}`}
          style={bgStyle}
        />
        <Carousel.Caption style={textStyle}>
          <h3>{props.title}</h3>
          <p>{props.text}</p>
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