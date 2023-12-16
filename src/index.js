import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home'
import Search from './Pages/Search'
import Navbar from './components/Navbar'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <BrowserRouter>
      <Navbar/>
    <Routes>
      <Route index element={<Home/>} />
      <Route path="/:id" element={<Search />}/>
    </Routes>
    
    </BrowserRouter>

);


