import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "animate.css";
import { fetchCoinDetails, fetchCoinHistory } from "../utils/Api";
import { useTheme } from "../utils/ThemeContext";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale, // x axis
  LinearScale, // y axis
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function Search() {
  const { id } = useParams(); // Access the symbol from the URL params
  const [coinDetails, setCoinDetails] = useState(null);
  const [coinHistory, setCoinHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCoinDetails(id);
        setCoinDetails(data);

        const coinHistData = await fetchCoinHistory(id);


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

  const hourLabels = coinHistory.map((entry) => {
    const timestamp = new Date(entry.timestamp);
    const options = { hour: "numeric", hour12: true };
    const formattedHour = new Intl.DateTimeFormat("en-US", options).format(
      timestamp
    );

    return formattedHour;
  });

  const dataValues = coinHistory.map((entry) =>
    parseFloat(entry.price.replace("$", "").replace(",", ""))
  );

  // Reverse the arrays
  const reversedHourLabels = [...hourLabels].reverse();
  const reversedDataValues = [...dataValues].reverse();

  const data = {
    labels: reversedHourLabels,
    datasets: [
      {
        label: "Coin Price History",
        data: reversedDataValues,
        backgroundColor: isDarkMode ? "white" : "black",
        borderColor: coinDetails.change < 0 ? "red" : "green",
        pointBorderColor: "black",
        fill: true,
      },
    ],
  };

  const range = Math.max(...dataValues) - Math.min(...dataValues);
  const percentBuffer = range * 0.05; // Adjust this value as needed
  const minBuffer = 0.01; // Adjust this value as needed
  const buffer = Math.max(percentBuffer, minBuffer);

  const options = {
    responsive: true, // Enable responsiveness
    maintainAspectRatio: false, // Do not maintain aspect ratio
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
          color: isDarkMode ? "white" : "black", // X-axis title color
          font: {
            size: 14,
            weight: "bold",
          },
        },
        ticks: {
          color: isDarkMode ? "white" : "black", // X-axis tick color
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(128, 128, 128, 0.5)'
        }
        
      },
      y: {
        min: Math.min(...dataValues) - buffer,
        max: Math.max(...dataValues) + buffer,
        title: {
          display: true,
          text: "Price",
          color: isDarkMode ? "white" : "black", // Y-axis title color
          font: {
            size: 14,
            weight: "bold",
          },
        },
        ticks: {
          color: isDarkMode ? "white" : "black", // Y-axis tick color
          font: {
            size: 12,
            weight: "bold",
          },
          callback: (value, index, values) => `$${value.toLocaleString()}`,
        },
        grid: {
          color: 'rgba(128, 128, 128, 0.5)'
        }
      },
    },
  };

  // console.log(coinDetails);

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDarkMode ? "bg-black" : "bg-white"
      }`}
    >
      <div className="w-1/2 h-1/2">
        {/* Chart box */}
        <div className="position-relative">
          <div
            className={` sm:p-8 md:p-10 lg:p-12 xl:p-16 w-full  border-b-4 ${
              isDarkMode ? "border-white" : "border-black"
            }`}
            style={{ height: "50vh", width: "100vw" }}
          >
            {coinHistory && <Line data={data} options={options} />}
          </div>
        </div>
      </div>

      {/* Boxes container */}
      <div className="flex flex-col sm:flex-row justify-center mt-2 mr-4 ml-4 space-x-0 sm:space-x-4 space-y-4 sm:space-y-0">
  {/* First Box */}
  <div className={`mt-8 sm:mt-2 w-full sm:w-1/2 min-h-[300px] sm:min-h-[200px] shadow-md rounded-lg overflow-hidden border-2 border-black ${isDarkMode ? 'bg-slate-200' : 'bg-black text-white'}`}>
    <div className="px-4 py-2">
      <h1 className="flex items-center  font-bold text-4xl ">{coinDetails.name} 
      <img className="h-12 w-12 object-cover mt-2" src={coinDetails.iconUrl} alt={coinDetails.name} />
      </h1>
      <p className="mt-1 p-2 text-lg">Ticker: {coinDetails.symbol}</p>
      <p className="mt-1 p-2 text-lg">Current Price: ${Number(coinDetails.price).toLocaleString()}</p>
      <p className={`mt-1 p-2 text-lg rounded-full w-1/2 ${coinDetails.change < 0 ? 'bg-red-500' : 'bg-green-500'}`}>Change: {coinDetails.change < 0 ? '' : '+' }{coinDetails.change}%</p>
      <p className="mt-1 p-2 text-lg">All Time High: ${Number(coinDetails.allTimeHigh.price).toLocaleString()}</p>
      <p className="mt-1 p-2 text-lg">Circulating Supply: {Number(coinDetails.supply.circulating).toLocaleString()}</p>
    </div>
    
    <div className="px-4 py-2 mt-2">
      {/* Rest of your code */}
    </div>
  </div>

  {/* Second Box */}
  <div className={`w-full sm:w-1/2  shadow-md rounded-lg overflow-hidden border-2 border-black ${isDarkMode ? 'bg-slate-200' : 'bg-black text-white'}`}>
    <div className="px-4 py-2 text-center">
      <p className="text-2xl font-bold border-black border-2">What is {coinDetails.name}?</p>
      <p className="mt-1 p-2 font-bold" style={{ whiteSpace: 'pre-line' }}>{coinDetails.description}</p>
    </div>
    <div className="px-4 py-2 mt-2 text-center">
      More Information at:
    </div>

    <a href={`${coinDetails.websiteUrl}`} className="text-center">
      
      <div className={` ml-20 mr-20 ${isDarkMode ? 'bg-black text-white hover:bg-sky-500 hover:text-black' : 'bg-slate-200 text-black hover:bg-sky-500 hover:text-black'}`}>{coinDetails.websiteUrl}</div>
      
      
      </a>
 
  </div>
  </div>



    </div>
  );
}
