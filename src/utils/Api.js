
const fetchCoinDetails = async (id) => {
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const url = `https://coinranking1.p.rapidapi.com/coin/${id}`;
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
  
      return coinData;
    } catch (error) {
      throw error;
    }
  };


  const fetchCoinHistory = async (id,timeframe = '24h') => {
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const url = timeframe ? `https://coinranking1.p.rapidapi.com/coin/${id}/history?timePeriod=${timeframe}` : `https://coinranking1.p.rapidapi.com/coin/${id}/history?timePeriod=24h`;
      // console.log('fetch Coin History', url)
      // console.log('id', id)
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch coin history');
      }
  
      const result = await response.json();
  
      const coinHist = result.data?.history || {};

      const change = result.data?.change || {};

   

      

      return {coinHist, change};
    } catch (error) {
      throw error;
    }
  };

  

  const fetchCoins = async (data) => {
    const url = data ? `https://coinranking1.p.rapidapi.com/coins?timePeriod=24h&orderBy=marketCap&search=${data}&orderDirection=desc&limit=1&offset=0` : `https://coinranking1.p.rapidapi.com/coins?&timePeriod=24h&orderBy=marketCap&orderDirection=desc&limit=50&offset=0`;

    // console.log('fetch coins called' , url)
                
  
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '8ae759da67msh17660d17a33b0aep134bc6jsn4d902f5fbb19',
        'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
      }
    };
  
    try {
      const response = await fetch(url, options);
      const result = await response.json(); // assuming the response is in JSON format
      return result;
    } catch (error) {
      console.error(error);
      throw error; // rethrow the error to handle it elsewhere if needed
    }
  };



  
  export { fetchCoinDetails, fetchCoinHistory, fetchCoins };
  