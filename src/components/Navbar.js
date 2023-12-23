import Slider from "./Switch";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee"; // Import the marquee library or use your preferred solution
import { fetchCoins } from "../utils/Api";
import { useTheme } from '../utils/ThemeContext';

function Navbar() {
  const { isDarkMode } = useTheme();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [tickerData, setTickerData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  const formattedDay = currentDateTime.toLocaleDateString(undefined, {
    weekday: "long",
  });

  const formattedTime = currentDateTime.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "numeric",
  });

  const handleCGClick = (CG) => {
    navigate("/");
  };

  const fetchData = async () => {
    try {
      const coinsData = await fetchCoins();

      const coins = coinsData.data.coins;

      setTickerData(coins); // Adjust the number of coins to display
    } catch (error) {
      console.error("Error fetching coins:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // console.log(tickerData);
  return (
    <div className={`text-white h-12 fixed top-0 w-full p-4 flex items-center justify-between z-10 border-b-2 ${isDarkMode ? 'bg-gray-800 border-white' : 'bg-white border-black'}`} >
      <div className="flex-1">
        <span
          className={`rounded-full p-2 border-4 ${isDarkMode ? 'border-white hover:bg-white hover:text-black' : 'bg-blue-400 border-black hover:bg-black hover:text-white'}`}
          onClick={() => handleCGClick()}
        >
          Crypto-Go
        </span>
        <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
          {formattedDay}, {formattedTime}
        </span>
      </div>

{/* Scrolling stock ticker container */}
<div className="flex-1 flex items-center justify-center font-bold">
  <Marquee>
    {tickerData.map((coin) => (
      <span
        key={coin.id}
        className={`ticker-item bg-black ${
          coin.change < 0 ? "text-red-500" : "text-green-500"
        }`}
      >
        &nbsp;{coin.symbol}&nbsp;$
        {parseFloat(coin.price).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}&nbsp;&nbsp;&nbsp;&nbsp;
      </span>
    ))}
  </Marquee>
</div>

      <div className="flex items-center">
        <div className={`mr-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Light</div>
        <Slider />
        <div className={`ml-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Dark</div>
      </div>
    </div>
  );
}

export default Navbar;
