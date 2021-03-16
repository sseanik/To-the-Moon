import React from "react";
import { Card, Image } from "react-bootstrap";

interface NewsItem {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

const NewsCard: React.FC<NewsItem> = (props) => {
  const { category, datetime, headline, id, image, related, source, summary, url } = props;

  return (
    <a href={url}>
      <Card>
        <Card.Header>{headline}</Card.Header>
        <Image src={image}/>
        <Card.Body>
          <Card.Title>{source}</Card.Title>
          <Card.Text>{summary}</Card.Text>
        </Card.Body>
      </Card>
    </a>
    
  )
}

export default NewsCard;