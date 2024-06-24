// import React, { useState } from 'react';
// import WifiControl from './components/WifiControl';
// import WifiList from './components/WifiList';

// const App = () => {
//     const [wifiStatus, setWifiStatus] = useState('');

//     const toggleWifi = async (action) => {
//         try {
//             // Implémentez ici la logique pour activer ou désactiver le WiFi
//             console.log(`Basculement du WiFi ${action}`);
//             // Exemple d'attente simulée
//             await new Promise(resolve => setTimeout(resolve, 1000));
//             setWifiStatus(action === 'on' ? 'WiFi activé.' : 'WiFi désactivé.');
//         } catch (error) {
//             console.error('Erreur lors du basculement du WiFi :', error);
//             setWifiStatus('Erreur lors du basculement du WiFi.');
//         }
//     };

//     return (
//         <div>
//             <WifiControl toggleWifi={toggleWifi} />
//             <WifiList />
//             {wifiStatus && <p>{wifiStatus}</p>}
//         </div>
//     );
// };

// export default App;



import React, { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import WifiList from './components/WifiList';

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
