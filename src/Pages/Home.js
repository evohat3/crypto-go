import React from "react";
import { useNavigate } from "react-router-dom";
import '../utils/Home.css'
import { useTheme } from "../utils/ThemeContext";

function Home({ coins, setCoinUuid }) {

  const { isDarkMode } = useTheme();
  const navigate = useNavigate();


 

  const handleCoinClick = (coinSymbol) => {
    // Navigate to the /:id route with the symbol as the parameter
    navigate(`/${coinSymbol}`);
  };

  const setCoinid = (coinUuid) => { 
    setCoinUuid(coinUuid);
  }

 

  return (
    <div className={`p-8 bg-black ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 m-4 p-4">
        {coins.map((coin) => (
          <div
            key={coin.uuid}
            className={`border-4 p-2 sm:p-1 md:p-2 rounded-full hover:bg-yellow-400 ${isDarkMode ? 'border-white' : 'border-black'}`}
            onClick={() => {
              handleCoinClick(coin.uuid);
              setCoinid(coin.uuid);}}
          >
            <div
              className={`truncate text-base ${
                coin.change < 0 ? "bg-red-500" : "bg-[#31FF05]"
              } border-4 ${isDarkMode ? 'border-white' : 'border-black'} rounded-full`}
            >
              <span
                className={`block p-4 bg-black text-center ${
                  coin.change < 0
                    ? "text-red-500 hover:bg-red-500 hover:text-black hover:border-b-4 border-black"
                    : "text-[#31FF05] hover:bg-[#31FF05] hover:text-black hover:border-b-4 border-black"
                } text-lg`}
              >
                <span className="font-bold">{coin.symbol}</span>
                <span className="float-right font-bold">{coin.change}%</span>
              </span>
              <span className="block p-4 text-center font-bold">
                Price: ${Number(coin.price).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;