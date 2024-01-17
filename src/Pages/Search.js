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
  }, [coinDetails, id]);

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

  return (
    <div
      className={`h-screen flex flex-col ${
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
  <div className="w-full sm:w-1/2 shadow-md rounded-lg overflow-hidden ">
    <div className="px-4 py-2">
      <h1 className="flex items-center text-gray-900 font-bold text-3xl ">{coinDetails.name} 
      <img className="h-12 w-12 object-cover mt-2" src={coinDetails.iconUrl} alt={coinDetails.name} />
      </h1>
      <p className="mt-1 text-gray-600 text-sm">This is an example of a card.</p>
    </div>
    <img className="h-56 w-full object-cover mt-2" src="https://source.unsplash.com/random" alt="Card 1"/>
    <div className="px-4 py-2 mt-2">
      {/* Rest of your code */}
    </div>
  </div>

  {/* Second Box */}
  <div className="w-full sm:w-1/2 bg-white shadow-md rounded-lg overflow-hidden">
    <div className="px-4 py-2">
      <h1 className="text-gray-900 font-bold text-3xl">Card 2</h1>
      <p className="mt-1 text-gray-600 text-sm">This is another example of a card.</p>
    </div>
    <img className="h-56 w-full object-cover mt-2" src="https://source.unsplash.com/random" alt="Card 2"/>
    <div className="px-4 py-2 mt-2">
      {/* Rest of your code */}
    </div>
  </div>
  </div>



    </div>
  );
}
