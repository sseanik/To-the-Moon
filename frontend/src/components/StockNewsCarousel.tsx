import { Carousel, Container } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import { connect } from "react-redux";
import { useEffect } from "react";
import { NewsItem } from "./NewsCard";
import newsActions from "../redux/actions/newsActions";

const carouselStyle = {
  width: "100%",
  height: "35vh",
  boxShadow: "5px 10px 8px black",
};

const carouselItemStyle = {
  width: "100%",
  height: "35vh",
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
  stock: string;
  loading: { [key: string]: boolean };
  articles: { [key: string]: Array<NewsItem> };
}

interface DispatchProps {
  getNewsByStockMulti: (stock: string) => void;
}

const StockNewsCarousel: React.FC<StateProps & DispatchProps> = (props) => {
  const { stock, loading, articles, getNewsByStockMulti } = props;

  const newsLoading =
    loading && loading.hasOwnProperty(stock) ? loading[stock] : false;
  const newsArticles =
    articles && articles.hasOwnProperty(stock) ? articles[stock] : [];

  useEffect(() => {
    getNewsByStockMulti(stock);
  }, [getNewsByStockMulti, stock]);

  const newsItem = (props: NewsItem, idx: number) => (
    <Carousel.Item key={idx} style={carouselItemStyle}>
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
      {newsLoading ? (
        <ClipLoader color={"green"} loading={newsLoading}>
          <span className="sr-only">Loading...</span>
        </ClipLoader>
      ) : (
        <Carousel style={carouselStyle}>
          {newsArticles.slice(0, 5).map((props, idx) => newsItem(props, idx))}
        </Carousel>
      )}
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.stockNewsMultiReducer.loading,
  articles: state.stockNewsMultiReducer.data,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    getNewsByStockMulti: (stock: string) =>
      dispatch(newsActions.getNewsByStockMulti(stock)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StockNewsCarousel);
