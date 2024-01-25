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
  const [timeFrame, setTimeFrame] = useState(''); // Add this line
  const { isDarkMode } = useTheme();

  const handleTimeFrame = (timeFrame) => {
    // console.log(timeFrame);
    setTimeFrame(timeFrame);
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCoinDetails(id, timeFrame);
        setCoinDetails(data);

        const coinHistData = await fetchCoinHistory(id, timeFrame);

        const change = coinHistData.change;
        


        const formattedData = coinHistData.coinHist.map((entry) => {
          const price = Number(entry.price).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          });
          

          // Convert timestamp to Date object
          const date = new Date(entry.timestamp * 1000);
          // console.log(date)

          // Round down to the nearest hour
          date.setMinutes(0, 0, 0);

          const timestamp = new Date(entry.timestamp * 1000).toLocaleString(
            "en-US",
            { timeZone: "America/New_York" }
          );

          // console.log(timestamp)

          return {
            price,
            timestamp,
            change
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
  }, [id, timeFrame]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const timeLabels = coinHistory.map((entry) => {
    const timestamp = new Date(entry.timestamp);
    let options;
  
    switch (timeFrame) {
      case '3h':
      case '24h':
        options = { hour: 'numeric', hour12: true };
        break;
      case '7d':
      case '30d':
        options = { day: 'numeric', month: 'short' };
        break;
      case '3m':
        options = { month: 'short', year: 'numeric' };
        break;
      case '1yr':
        options = { month: 'short', year: 'numeric' };
        break;
      case '5yr':
        options = { year: 'numeric' };
        break;
      default:
        options = {};
    }
  
    const formattedTime = new Intl.DateTimeFormat('en-US', options).format(timestamp);
  
    return formattedTime;
  });

  const dataValues = coinHistory.map((entry) =>
    parseFloat(entry.price.replace("$", "").replace(",", ""))
  );

  // const dayData = coinHistory.filter((_, index) => index % 24 === 0);
  // // const lastSevenDaysData = dayData.slice(-7);

  // const dayLabels = dayData.map((entry) => {
  //   const timestamp = new Date(entry.timestamp);
  //   const options = { weekday: "short", hour12: true };
  //   const formattedDay = new Intl.DateTimeFormat("en-US", options).format(
  //     timestamp
  //   );
  //   return formattedDay
  // });

  // // console.log('day labels:', dayLabels)

  // const monthData = coinHistory.filter((_, index) => index % 30 === 0);
  // const monthLabels = monthData.map((entry) => {
  //   const timestamp = new Date(entry.timestamp);
  //   const options = { month: 'long', year: 'numeric' };
  //   const formattedMonth = new Intl.DateTimeFormat('en-US', options).format(timestamp);
  //   return formattedMonth;
  // });

  // console.log('month labels:', monthLabels)



  

  // Reverse the arrays
  const reversedTimeLabels = [...timeLabels].reverse();
  const reversedDataValues = [...dataValues].reverse();
  // const reversedMonthLabels = [...monthLabels].reverse();
  // const reversedDayLabels = [...dayLabels].reverse();

// console.log('reversed month labels:',reversedMonthLabels)
  // console.log('reversed hour labels:',reversedHourLabels)
  // console.log('reversed time labels:',reversedTimeLabels)

  const data = {
    labels: reversedTimeLabels,
    datasets: [
      {
        label: "Coin Price History",
        data: reversedDataValues,
        // backgroundColor: isDarkMode ? "white" : "black",
        borderColor: coinHistory[0].change < 0 ? "red" : "green",
        pointBorderColor: "rgba(0, 0, 0, 0)",
        fill: true,
      },
    ],
  };
  console.log(coinHistory[0].change)

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

     {/* Button group */}
    <div className="float-right md:space-x-3">
    <button className={`px-4 py-2 rounded-md transition-colors duration-300 font-bold ${coinHistory[0].change < 0 ? 'bg-red-500' : 'bg-green-500'} ${isDarkMode ? 'hover:bg-slate-200' : 'hover:bg-black hover:text-slate-200'}`} onClick={() => handleTimeFrame('3h')}>3h</button>
    <button className={`px-4 py-2 rounded-md transition-colors duration-300 font-bold ${coinHistory[0].change < 0 ? 'bg-red-500' : 'bg-green-500'} ${isDarkMode ? 'hover:bg-slate-200' : 'hover:bg-black hover:text-slate-200'}`} onClick={() => handleTimeFrame('24h')}>24h</button>
    <button className={`px-4 py-2 rounded-md transition-colors duration-300 font-bold ${coinHistory[0].change < 0 ? 'bg-red-500' : 'bg-green-500'} ${isDarkMode ? 'hover:bg-slate-200' : 'hover:bg-black hover:text-slate-200'}`} onClick={() => handleTimeFrame('7d')}>7d</button>
    <button className={`px-4 py-2 rounded-md transition-colors duration-300 font-bold ${coinHistory[0].change < 0 ? 'bg-red-500' : 'bg-green-500'} ${isDarkMode ? 'hover:bg-slate-200' : 'hover:bg-black hover:text-slate-200'}`} onClick={() => handleTimeFrame('30d')}>30d</button>
    <button className={`px-4 py-2 rounded-md transition-colors duration-300 font-bold ${coinHistory[0].change < 0 ? 'bg-red-500' : 'bg-green-500'} ${isDarkMode ? 'hover:bg-slate-200' : 'hover:bg-black hover:text-slate-200'}`} onClick={() => handleTimeFrame('3m')}>3m</button>
    <button className={`px-4 py-2 rounded-md transition-colors duration-300 font-bold ${coinHistory[0].change < 0 ? 'bg-red-500' : 'bg-green-500'} ${isDarkMode ? 'hover:bg-slate-200' : 'hover:bg-black hover:text-slate-200'}`} onClick={() => handleTimeFrame('1y')}>1yr</button>
    <button className={`px-4 py-2 rounded-md transition-colors duration-300 font-bold ${coinHistory[0].change < 0 ? 'bg-red-500' : 'bg-green-500'} ${isDarkMode ? 'hover:bg-slate-200' : 'hover:bg-black hover:text-slate-200'}`} onClick={() => handleTimeFrame('5y')}>5yr</button>
    </div>

    <div className={`float-left ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
            <div className="text-2xl font-bold ">Price History</div>
            <div className="">Past {timeFrame} 
             <span className={`ml-4 `}>Change: <span className={`font-bold ${coinHistory[0].change < 0 ? 'text-red-500' : 'text-green-500'}`}>{coinHistory[0].change < 0 ? '' : '+'}{coinHistory[0].change}%</span> </span>
            
            </div>
    </div>

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
      <p className={`mt-1 p-2 text-lg rounded-full w-1/2 ${coinHistory[0].change < 0 ? 'bg-red-500' : 'bg-green-500'}`}>{timeFrame} Change: {coinHistory[0].change < 0 ? '' : '+' }{coinHistory[0].change}%</p>
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
