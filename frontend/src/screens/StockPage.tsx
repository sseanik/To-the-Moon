import React, { useState, useEffect } from "react";
import { Container, Row, Image } from "react-bootstrap";

// import { render } from 'react-dom';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

interface Props {
  // declare props types here
}

const test_options = {
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
  const [options, setOptions] = useState({
    title: {
      text: '<Default Title>'
    },
    series: [
      {
        data: [
          [1614004200000, 126],
          [1614090600000, 125.86],
          [1614177000000, 125.35],
          [1614263400000, 120.99],
          [1614349800000, 121.26],
          [1614609000000, 127.79],
          [1614695400000, 125.12],
          [1614781800000, 122.06],
          [1614868200000, 120.13],
          [1614954600000, 121.42],
          [1615213800000, 116.36]
        ]
      }
    ]
  });

  return (
    <Container>
      <Row className="justify-content-center">

      </Row>
      <Row className="justify-content-center mt-2">
        <h1>Welcome To The Stock Page!</h1>
      </Row>

      <Row className="justify-content-center">
        <div>
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={'stockChart'}
            options={options}
          />
        </div>
      </Row>
    </Container>
  );
}

export default StockPage;
