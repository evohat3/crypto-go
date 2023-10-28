import React, { useState, useEffect } from 'react';


function Home() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = '8ae759da67msh17660d17a33b0aep134bc6jsn4d902f5fbb19'; // Replace with your actual API key
        const url = 'https://coinranking1.p.rapidapi.com/coins?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&tiers%5B0%5D=1&orderBy=marketCap&orderDirection=desc&limit=50&offset=0';
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': apiKey, // Add your API key here
            'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result = await response.json();
        console.log(result)
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <ul className='flex flex-col sm:flex-row md:flex-col lg:flex-col xl:flex-col'>
      {coins.map((coin) => (
        <li className='container border-4 p-2 mb-2 sm:p-1 sm:mb-1 md:p-2 md:mb-2' key={coin.uuid}>
          <div className={`truncate text-base ${coin.change < 0 ? 'bg-red-500' : 'bg-green-500'}`}>
          <span className="block">Coin: {coin.symbol}</span>
          <span className="block">Price: {coin.price}</span>
          <span className="block">Change {coin.change}%</span>

          </div>
  
        </li>
      ))}
    </ul>
  );
}

export default Home;
