import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../utils/Home.css'
import { useTheme } from "../utils/ThemeContext";

function Home() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = process.env.REACT_APP_API_KEY;
        const url =
          "https://coinranking1.p.rapidapi.com/coins?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&tiers%5B0%5D=1&orderBy=marketCap&orderDirection=desc&limit=100&offset=0";

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": apiKey,
            "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        const coinData = result.data.coins || [];

        setCoins(coinData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCoinClick = (coinSymbol) => {
    // Navigate to the /:id route with the symbol as the parameter
    navigate(`/${coinSymbol}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={`p-8 bg-black ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 m-4 p-4">
        {coins.map((coin) => (
          <div
            key={coin.uuid}
            className={`border-4 p-2 sm:p-1 md:p-2 rounded-full hover:bg-yellow-400 ${isDarkMode ? 'border-white' : 'border-black'}`}
            onClick={() => handleCoinClick(coin.uuid)}
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