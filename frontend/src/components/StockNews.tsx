import { Container } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import { NewsItem, default as NewsCard } from "./NewsCard";
import newsActions from "../redux/actions/newsActions";
import { connect } from "react-redux";
import { useEffect } from "react";

interface StateProps {
  loading: boolean;
  articles: Array<NewsItem>;
}

interface DispatchProps {
  getStockNews: (stock: string) => void;
}

interface Props {
  stock: string;
}

const StockNews: React.FC<StateProps & DispatchProps & Props> = (props) => {
  const { stock, loading, articles, getStockNews } = props;

  useEffect(() => {
    getStockNews(stock);
  }, [getStockNews, stock]);

  return (
    <Container>
      <ClipLoader color={"green"} loading={loading}>
        <span className="sr-only">Loading...</span>
      </ClipLoader>
      {articles.map((news, idx) => (
        <NewsCard key={idx} {...news} />
      ))}
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.landingNewsReducer.loading,
  articles: state.landingNewsReducer.data,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    getStockNews: (stock: string) =>
      dispatch(newsActions.getNewsByStock(stock)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StockNews);
