// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import WifiList from './components/WifiList';
import Splashscreen from './components/Splashscreen';
import Modal from 'react-modal';

// Bind modal to your app element (this is needed for accessibility reasons)
Modal.setAppElement('#root');

const App = () => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation d'un délai pour le splashscreen
    const timeout = setTimeout(() => {
      setLoading(false); // Met fin au chargement après 6 secondes (simulé)
      document.body.classList.add('loaded'); // Ajoute la classe 'loaded' au body
    }, 6000); // 6000 millisecondes = 6 secondes

    return () => clearTimeout(timeout); // Nettoie le timeout si le composant est démonté avant la fin du délai
  }, []);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  if (loading) {
    return <Splashscreen />;
  }

  return (
    <div className="App">
      <SearchBar onChange={handleSearchChange} />
      <WifiList searchText={searchText} />
    </div>
  );
};

export default App;
