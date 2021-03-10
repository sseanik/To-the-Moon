import React, { useState, useEffect } from "react";
import { Container, Row, Image } from "react-bootstrap";

// import { render } from 'react-dom';
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

import { getStockData } from "../redux/actions/userActions";

interface Props {
  // declare props types here
}

const StockPage: React.FC<Props> = () => {
  const [graphOptions, setGraphOptions] = useState({
    title: {
      text: "<Default Title>"
    },
    series: [
      {
        data: [

        ]
      }
    ]
  });

  useEffect(() => {
    async function fetchStock() {
      var stockdata = await getStockData("AMZN");
      console.log(Object.entries(stockdata.data));
      var seriesList = [];

      for (let [key, value] of Object.entries(stockdata.data)) {
        seriesList.push({name: key, data: value});
      }
      setGraphOptions({ ... graphOptions, series: seriesList });
    }

    fetchStock();
  }, []);

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
            options={graphOptions}
          />
        </div>
      </Row>
    </Container>
  );
}

export default StockPage;
