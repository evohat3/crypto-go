
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


  const fetchCoinHistory = async (id) => {
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const url = `https://coinranking1.p.rapidapi.com/coin/${id}/history?timePeriod=24h`;
  
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

      return coinHist;
    } catch (error) {
      throw error;
    }
  };

  const fetchCoins = async () => {
    const url = 'https://coinranking1.p.rapidapi.com/coins?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&tiers%5B0%5D=1&orderBy=marketCap&orderDirection=desc&limit=50&offset=0';
  
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
  