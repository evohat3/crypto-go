import React from 'react';
import { Line } from 'react-chartjs-2';


//TODO Create a button group 

const CoinPriceChart = ({ coinData }) => {
    // Extract timestamps and prices from your data
    const timestamps = coinData.map(entry => entry.timestamp);
    const prices = coinData.map(entry => entry.price);
  
    // Prepare the data object for Chart.js
    const chartData = {
      labels: timestamps,
      datasets: [
        {
          label: 'Coin Price',
          data: prices,
          fill: false,
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 2,
        },
      ],
    };
  
    // Configure other chart options as needed
    const chartOptions = {
        scales: {
          x: [
            {
              type: 'module',
              position: 'bottom',
            },
          ],
        },
      };
  
    return (
      <div>
        <Line data={chartData} options={chartOptions} />
      </div>
    );
  };
  
  export default CoinPriceChart;
  