//App.js
import React, { useState } from 'react';
import './App.css';
import './fontawesome-free-5.15.4-web/css/all.min.css';
import './fontawesome-free-5.15.4-web/css/all.css';
import SearchBar from './components/SearchBar';
import WifiList from './components/WifiList';
import Modal from 'react-modal';

// Bind modal to your app element (this is needed for accessibility reasons)
Modal.setAppElement('#root');

const App = () => {
  const [searchText, setSearchText] = useState('');

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <div className="App">
      <SearchBar onChange={handleSearchChange} />
      <WifiList searchText={searchText} />
    </div>
  );
};

export default App;
