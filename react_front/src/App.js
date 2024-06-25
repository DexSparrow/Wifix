// src/App.js
import React, { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import WifiList from './components/WifiList';
import Modal from 'react-modal';

// Bind modal to your app element (this is needed for accessibility reasons)
Modal.setAppElement('#root');

const App = () => {
  const [wifis, setWifis] = useState('');

  const handleSearchChange = (event) => {
    // Logique pour gérer la recherche
  };

  return (
    <div className="App">
      <SearchBar onChange={handleSearchChange} />
      <WifiList wifis={wifis} />
    </div>
  );
};

export default App;
