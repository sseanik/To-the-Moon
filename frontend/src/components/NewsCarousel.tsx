import { Carousel, Container } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import { connect } from "react-redux";
import { useEffect } from "react";
import { NewsItem } from "./NewsCard";
import newsActions from "../redux/actions/newsActions";

const carouselStyle = {
  width: "100%",
  boxShadow: "5px 10px 8px #888888",
};

const bgStyle = {
  width: "100%",
  height: "55vh",
  opacity: "0.85",
  padding: "2.5vh",
  backgroundColor: "rgba(0, 0, 0, 0.9)",
  objectFit: "cover",
} as React.CSSProperties;

const textStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  padding: "20px",
};

interface StateProps {
  loading: boolean;
  articles: Array<NewsItem>;
}

interface DispatchProps {
  getGeneralNews: () => void;
}

const NewsCarousel: React.FC<StateProps & DispatchProps> = (props) => {
  const { loading, articles, getGeneralNews } = props;

  useEffect(() => {
    getGeneralNews();
  }, [getGeneralNews]);

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
    <Container>
      <ClipLoader color={"green"} loading={loading}>
        <span className="sr-only">Loading...</span>
      </ClipLoader>
      <Carousel style={carouselStyle}>
        {articles.slice(0, 5).map((props, idx) => newsItem(props, idx))}
      </Carousel>
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.landingNewsReducer.loading,
  articles: state.landingNewsReducer.data,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    getGeneralNews: () => dispatch(newsActions.getGeneralNews()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsCarousel);
