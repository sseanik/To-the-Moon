import React from "react";
import { Container, Row, Image } from "react-bootstrap";

// import { render } from 'react-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface Props {
  // declare props types here
}

const options = {
  chart: {
    type: 'spline'
  },
  title: {
    text: 'My chart'
  },
  series: [
    {
      data: [1, 2, 1, 4, 3, 6]
    }
  ]
};

const StockPage: React.FC<Props> = () => {
  return (
    <Container>
      <Row className="justify-content-center">

      </Row>
      <Row className="justify-content-center mt-2">
        <h1>Welcome To The Stock Page!</h1>
      </Row>

      <Row className="justify-content-center">
        <div>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </Row>
    </Container>
  );
}

export default StockPage;
