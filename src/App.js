import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Search from './Pages/Search';
import Navbar from './components/Navbar';
import { ThemeProvider } from './utils/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/:id" element={<Search />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;