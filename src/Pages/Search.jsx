import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "animate.css";
import { fetchCoinDetails, fetchCoinHistory } from "../utils/Api";
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale, // x axis
  LinearScale, // y axis
  PointElement
} from 'chart.js'

ChartJS.register(  
  LineElement,
  CategoryScale, 
  LinearScale, 
  PointElement
  )


export default function Search() {
  const { id } = useParams(); // Access the symbol from the URL params
  const [coinDetails, setCoinDetails] = useState(null);
  const [coinHistory, setCoinHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);







  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCoinDetails(id);
        setCoinDetails(data);

        const coinHistData = await fetchCoinHistory(id);
        // console.log('coin Hist Data',coinHistData[0])

        const formattedData = coinHistData.map((entry) => {
          const price = Number(entry.price).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          });

          // Convert timestamp to Date object
          const date = new Date(entry.timestamp * 1000);

          // Round down to the nearest hour
          date.setMinutes(0, 0, 0);

          const timestamp = new Date(entry.timestamp * 1000).toLocaleString(
            "en-US",
            { timeZone: "America/New_York" }
          );

          return {
            price,
            timestamp,
          };
        });



       // Filter data to include only one timestamp per hour
       const hourlyData = formattedData.filter((entry, index, array) => {
        const currentHour = new Date(entry.timestamp).getHours();
        const previousHour =
          index > 0 ? new Date(array[index - 1].timestamp).getHours() : -1;

        return currentHour !== previousHour;
      });



        

        setCoinHistory(hourlyData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

const hourLabels = coinHistory.map(entry => {
  const timestamp = new Date(entry.timestamp);
  const options = { hour: 'numeric', hour12: true };
  const formattedHour = new Intl.DateTimeFormat('en-US', options).format(timestamp);

  return formattedHour;
});

  const dataValues = coinHistory.map(entry => parseFloat(entry.price.replace('$', '').replace(',', '')));

  
 
// Reverse the arrays
const reversedHourLabels = [...hourLabels].reverse();
const reversedDataValues = [...dataValues].reverse();

const data = {
  labels: reversedHourLabels,
  datasets: [
    {
      label: 'Coin Price History',
      data: reversedDataValues,
      backgroundColor: 'white',
      borderColor: coinDetails.change < 0 ? 'red' : 'green',
      pointBorderColor: 'black',
      fill: true,
    }
  ]
}

const options = {
  responsive: true, // Enable responsiveness
  maintainAspectRatio: false, // Do not maintain aspect ratio
  plugins: {
    legend: {
      display: true,
      position: 'top',
    }
  },
  scales: {
    y: {
      min: Math.min(...dataValues),
      max: Math.max(...dataValues), 
    }
  }
};


return (
  <div className="bg-black h-screen flex flex-col">
    <div className="w-1/2 h-1/2">
    {/* Chart box */}
    <div className="position-relative">
  <div className="text-white border-4 sm:p-8 md:p-10 lg:p-12 xl:p-16 bg-white w-full h overflow-y-auto" style={{ height: "50vh", width: "100vw" }}>
    {coinHistory && (
      <Line
        data={data}
        options={options}
      />
    )}
  </div>
</div>

    </div>

    {/* Boxes container */}
    <div className="flex justify-center mt-6 space-x-4">

      {/* First Box */}
      <div className="w-full">
        <div
          className={`text-white border-4  sm:p-8 md:p-10 lg:p-12 xl:p-16 w-full items-center justify-center animate__animated animate__backInRight ${
            coinDetails.change < 0 ? "bg-red-500" : "bg-green-500"
          }`}
        >
          <img
            src={coinDetails.iconUrl}
            alt={`${coinDetails.name} icon`}
            className="sm:w-6 sm:h-6 md:w-12 md:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 border-4 bg-white rounded-full"
          />
          <h2 className="text-base sm:text-sm md:text-md lg:text-2xl xl:text-3xl font-bold bg-black rounded-full p-2 m-2">
            {coinDetails.name}
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl bg-black rounded-full p-2 m-2">
             <span className="font-bold">Symbol:</span> {coinDetails.symbol}
          </p>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl bg-black rounded-full p-2 m-2">
          <span className="font-bold">Current Price:</span> ${Number(coinDetails.price).toLocaleString()}
          </p>
        <p className={`text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl bg-black rounded-full p-2 m-2 ${
            coinDetails.change < 0 ? "text-red-500" : "text-green-500"
          }`}>
          <span className="font-bold">Change:</span> {" "}
  {coinDetails.change > 0 ? "+" : ""}{coinDetails.change}%
          </p>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl bg-black rounded-full p-2 m-2">
          <span className="font-bold">All Time High:</span> ${Number(coinDetails.allTimeHigh.price).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Second Box */}
      <div className="text-white border-4 p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 bg-slate-700 whitespace-normal text-center  animate__animated animate__backInLeft" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
          {coinDetails.description}
        </p>
        {/* box inside second box*/}
        <div className="border-4 hover:bg-white hover:text-black p-4 m-4 w-1/2border-4 hover:bg-white hover:text-black p-4 m-4 w-1/2" onClick={() => window.location.href = coinDetails.websiteUrl} >
          <p className="p-4 ">More Information at:</p>
          <a
            className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-center underline text-blue-400 hover:text-blue-600 hover:underline whitespace-normal"
            href={coinDetails.websiteUrl}
          >
            {coinDetails.websiteUrl}
          </a>
        </div>
      </div>
    </div>
  </div>
);

}
