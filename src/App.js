import React, {useEffect, useState }from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Search from './Pages/Search';
import Navbar from './components/Navbar';
import { ThemeProvider } from './utils/ThemeContext';
import { fetchCoins } from './utils/Api';


function App() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [coinUuid, setCoinUuid] = useState('');
  const [uuid, setUuid] = useState('');


  

  // Debounce the search term so that we don't make a request for every keystroke
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 200); 

    
    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

// Fetch coins on initial render and whenever the debounced search term changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const coinData = await fetchCoins(debouncedSearchTerm);
        const coins = coinData.data.coins;
        setCoins(coins);
        setLoading(false);
        if (coins.length === 1) {
          setUuid(coins[0].uuid);
        }
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearchTerm]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar setSearchTerm={setSearchTerm} coinUuid={coinUuid} uuid={uuid}/>
        <Routes>
          <Route index element={<Home coins={coins} searchTerm={searchTerm} setCoinUuid={setCoinUuid} />} />
          <Route path="/:id" element={<Search />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;