import Slider from "./Switch";
import { useState, useEffect } from "react";
import Marquee from "react-fast-marquee"; // Import the marquee library or use your preferred solution
import { fetchCoins } from "../utils/Api";
import { useTheme } from '../utils/ThemeContext';

function Navbar({ setSearchTerm, coinUuid }) {
  const { isDarkMode } = useTheme();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [tickerData, setTickerData] = useState([]);


  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Update state when search bar's value changes
  }

  const formattedDay = currentDateTime.toLocaleDateString(undefined, {
    weekday: "long",
  });

  const formattedTime = currentDateTime.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "numeric",
  });


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
    <>
<nav className={`font-sans flex flex-col text-center sm:flex-row sm:text-left sm:justify-between py-4 px-6 shadow sm:items-center w-full ${isDarkMode ? 'bg-slate-600' : 'bg-slate-300'}`}>

{/* Logo */}

  


{/* HOME */}
  <div className="mb-2 sm:mb-0 flex justify-center">
    <a href="/" ><img src="https://i.imgur.com/xUQOSHm.png" alt="Crypto-Go-Icon" className=" w-40 rounded-full"/></a>
  </div>

  {/* Time display */}
  <div className={` font-bold text-2xl ${isDarkMode ? 'text-white' : 'text-black' }`}>{formattedDay}, {formattedTime}</div>

{/* Search Bar */}
  <div className={coinUuid !== '' ? 'hidden' : ''}> <div type="text" onChange={handleSearchChange} className={`col-span-1 flex items-center group ${isDarkMode ? 'bg-white text-black' : 'bg-slate-600 text-white'} rounded-full p-2`}>
          <input className={`w-full bg-transparent outline-none ${isDarkMode ? 'text-black' : 'text-white'}`} placeholder="Search" />
          <span className={`ml-2 group-hover:cursor-pointer group-hover:text-white rounded-full ${isDarkMode ? 'group-hover:bg-slate-600' : 'group-hover:bg-slate-200'}`}>&#128269;</span> {/* Magnifying glass symbol */}
        </div></div>
    
{/* Slider */}
<div className="">
  <div className={`flex items-center justify-center p-2 rounded-full border-2 ${isDarkMode ? ' bg-white ' : 'bg-black'} `}>
    <div className={`mr-2 p-2 font-bold ${isDarkMode ? 'text-black' : 'text-white'}`}>Light</div>
    <Slider/>
    <div className={`ml-2 p-2 font-bold ${isDarkMode ? 'text-black' : 'text-white'}`}>Dark</div>
  </div>
  </div>



</nav>

{/* Ticker */}
<div className={`w-full h-16 bg-black ${isDarkMode ? 'border-2 border-white' : ''}`} >
  <Marquee >
    {tickerData.map((coin) => (
      <span
        key={coin.uuid}
        className={`ticker-item text-2xl font-semibold ${
          coin.change < 0 ? "text-red-500" : "text-[#31FF05]"
        }`} style={{lineHeight: "4rem" }} 
      >
        &nbsp;{coin.symbol}&nbsp;{coin.change}%&nbsp;$
        {parseFloat(coin.price).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}&nbsp;&nbsp;&nbsp;&nbsp;
      </span>
      
    ))}
  </Marquee>
  </div>

</>
  );
}

export default Navbar;
