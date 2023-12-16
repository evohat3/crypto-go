import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'animate.css';

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className='bg-black h-screen flex flex-col p-4'>


      <div className='flex flex-col'>
      {/* First Box */}
      <div className='mt-16 '>
        <div className={`text-white border-4 p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 rounded-full w-1/2 items-center justify-center m-4 p-4 animate__animated animate__backInLeft ${coinDetails.change < 0 ? 'bg-red-500' : 'bg-green-500'}`}>
          <img
            src={coinDetails.iconUrl}
            alt={`${coinDetails.name} icon`}
            className='w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 float-right border-4 bg-white'
          />
          <h2 className='text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold '>{coinDetails.name}</h2>
          <p className='text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl animate__rubberBand'>Symbol: {coinDetails.symbol}</p>
          <p className='text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl'>Current Price: ${Number(coinDetails.price).toLocaleString()}</p>
          <p className='text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl'>Change in price: {coinDetails.change}%</p> 
          <p className='text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl'>All Time High: ${Number(coinDetails.allTimeHigh.price).toLocaleString()}</p>
        </div>
      </div>

      {/* Second Box */}
      <div className='text-white border-4 p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 bg-slate-700 m-4 p-4 rounded-full w-1/2 whitespace-normal text-center animate__animated animate__backInLeft'>
        <p className='text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl'>{coinDetails.description}</p>
        
        
      </div>

      {/* Third Box */}

      <div className='text-white border-4 p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 bg-slate-700 m-4 p-4 rounded-full w-1/2 whitespace-normal text-center animate__animated animate__backInLeft'>
      <p className='text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-center whitespace-normal'>Website Url</p>
        <a className='text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-center underline text-blue-400 hover:text-blue-600 hover:underline whitespace-normal' href={coinDetails.websiteUrl}>{coinDetails.websiteUrl}</a>
      </div>

      </div>

      {/* Fourth box */}
      <div className='position-relative'>

      <div className='text-white border-4 p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 bg-slate-700 m-4 p-4 w-1/3 fixed right-0 top-0 h-full overflow-y-auto'>
      <p className='text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl'>Hello</p>
    </div>

    </div>

    </div>
  );
}
