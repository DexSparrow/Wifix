// WifiList.js
import React, { useState, useEffect } from 'react';
import WifiItem from './WifiItem';
import './WifiList.css';

const WifiList = () => {
  const [wifiList, setWifiList] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState({});

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/wifi/')
      .then(response => response.json())
      .then(data => setWifiList(data))
      .catch(error => console.error('Error fetching WiFi list:', error));
  }, []);

  const handleConnect = (SSID, password) => {
    console.log(SSID+" password : "+password);
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

  return (
    <div className='wifi-list'>
      {wifiList.map((network) => (
        <WifiItem
          key={network.Signal}
          name={network.SSID}
          connectToWifi={handleConnect}
        />
      ))}
    </div>
  );
};

export default WifiList;
