import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function Search() {
  const { id } = useParams(); // Access the symbol from the URL params
  const [coinDetails, setCoinDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoinDetails = async () => {
      try {
        // Replace 'YOUR_API_KEY' with your actual API key
        const apiKey = process.env.REACT_APP_API_KEY;
        const url = `https://coinranking1.p.rapidapi.com/coin/${id}`; // Use the individual coin endpoint
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch coin details');
        }

        const result = await response.json();
        const coinData = result.data.coin || {};

        setCoinDetails(coinData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchCoinDetails();
  }, [id]);
  
  console.log('coinDetails', coinDetails)// Include id as a dependency to re-fetch when it changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className='bg-black h-screen flex flex-col justify-center items-center'>
      <div className={`text-white border-4 p-20 rounded-full items-center justify-center ${coinDetails.change < 0 ? 'bg-red-500' : 'bg-green-500'}`}>
        <h2 className='text-2xl font-bold'>{coinDetails.name}</h2>
        <p>Symbol: {coinDetails.symbol}</p>
        <p>Current Price: ${Number(coinDetails.price).toLocaleString()}</p>
        <p>Change in price: {coinDetails.change}%</p> 
        <p>All Time High: ${Number(coinDetails.allTimeHigh.price).toLocaleString()}</p>
      </div>


      {/* Second Column */}
      <div className='text-white border-4 p-20 bg-blue-500'>
        <p>{coinDetails.description}</p>
        <p className='p-4 border-t-4 '>Website Url</p>
        <a href={coinDetails.websiteUrl}>{coinDetails.websiteUrl}</a>
      </div>

    </div>
  );
}