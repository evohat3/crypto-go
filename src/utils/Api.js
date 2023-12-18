
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
  
  export { fetchCoinDetails, fetchCoinHistory };
  