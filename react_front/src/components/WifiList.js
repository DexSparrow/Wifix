//WifiList.js


import React, { useState, useEffect } from 'react';
import WifiItem from './WifiItem';
import './WifiList.css';
import levenshtein from 'js-levenshtein';

const WifiList = ({ searchText }) => {
  const [wifiList, setWifiList] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState({});

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/wifi/')
      .then(response => response.json())
      .then(data => {
        const uniqueData = Array.from(new Set(data.map(network => network.SSID)))
          .map(SSID => {
            return data.find(network => network.SSID === SSID);
          });
        setWifiList(uniqueData);
      })
      .catch(error => console.error('Error fetching WiFi list:', error));
  }, []);

  const handleConnect = (SSID, password) => {
    console.log(SSID + " password : " + password);
    setConnectionStatus(prevStatus => ({
      ...prevStatus,
      [SSID]: 'connecting'
    }));

    return fetch('http://127.0.0.1:8000/api/connect/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ SSID, password })
    })
      .then(response => {
        if (response.ok) {
          setConnectionStatus(prevStatus => ({
            ...prevStatus,
            [SSID]: 'connected'
          }));
          return true; // Indique que la connexion a réussi
        } else {
          setConnectionStatus(prevStatus => ({
            ...prevStatus,
            [SSID]: 'failed'
          }));
          return false; // Indique que la connexion a échoué
        }
      })
      .catch(error => {
        console.error('Error connecting to WiFi:', error);
        setConnectionStatus(prevStatus => ({
          ...prevStatus,
          [SSID]: 'failed'
        }));
        return false; // Indique que la connexion a échoué
      });
  };

  const filteredWifiList = wifiList.filter(network =>
    network.SSID.toLowerCase().includes(searchText.toLowerCase())
  ).sort((a, b) => {
    // Calculer la distance de Levenshtein entre le texte de recherche et les noms de réseau
    const distanceA = levenshtein(a.SSID.toLowerCase(), searchText.toLowerCase());
    const distanceB = levenshtein(b.SSID.toLowerCase(), searchText.toLowerCase());
    
    // Trier du plus semblable (distance plus petite) au moins semblable (distance plus grande)
    return distanceA - distanceB;
  });

  return (
    <div className='wifi-list'>
      {filteredWifiList.map((network) => (
        <WifiItem
          key={`${network.SSID}-${network.Signal}`}
          name={network.SSID}
          connectToWifi={handleConnect}
          akm={network.AKM}
        />
      )).reverse()} {/* Inverser l'ordre ici */}
    </div>
  );
};

export default WifiList;
