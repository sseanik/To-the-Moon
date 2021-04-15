import React from "react";
import { Card, Image, Row } from "react-bootstrap";

const newsItemStyle = {
  width: "60vw",
  height: "auto",
  margin: "20px",
};

const imageStyle = {
  display: "block",
  height: "auto",
  width: "20vw",
};

export interface NewsItem {
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
  const { headline, image, source, summary, url } = props;

  return (
    <Row className="justify-content-center mt-2">
      <Card style={newsItemStyle}>
        <a href={url} target="_blank">
          <Card.Header as="h3">{headline}</Card.Header>
        </a>
        <Image className="mx-auto" src={image} style={imageStyle} />
        <Card.Body>
          <Card.Title>{source}</Card.Title>
          <Card.Text>{summary}</Card.Text>
        </Card.Body>
      </Card>
    </Row>
  );
};

export default NewsCard;
