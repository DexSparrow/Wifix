// WifiList.js
import React, { useState, useEffect } from 'react';
import './styles.css';

const WifiList = ({ connectToWifi }) => {
    const [wifiList, setWifiList] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState({});

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/wifi/')
            .then(response => response.json())
            .then(data => setWifiList(data))
            .catch(error => console.error('Error fetching WiFi list:', error));
    }, []);

    const handleConnect = (SSID, password) => {
        setConnectionStatus(prevStatus => ({
            ...prevStatus,
            [SSID]: 'connecting'
        }));

        fetch('http://127.0.0.1:8000/api/connect/', {
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
            } else {
                throw new Error('Connection failed');
            }
        })
        .catch(error => {
            console.error('Error connecting to WiFi:', error);
            setConnectionStatus(prevStatus => ({
                ...prevStatus,
                [SSID]: 'failed'
            }));
        });
    };

    return (
        <div className="wifi-list">
            <h2>WiFi Networks</h2>
            <ul>
                {wifiList.map(network => (
                    <li key={network.SSID} className="network">
                        <strong>SSID:</strong> {network.SSID}, <strong>Signal:</strong> {network.Signal}
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const password = e.target.elements.password.value;
                            handleConnect(network.SSID, password);
                        }}>
                            <input type="password" name="password" placeholder="Password" required />
                            <button type="submit">Connect</button>
                        </form>
                        {connectionStatus[network.SSID] === 'connecting' && <p>Connecting...</p>}
                        {connectionStatus[network.SSID] === 'connected' && <p>Connected!</p>}
                        {connectionStatus[network.SSID] === 'failed' && <p>Connection failed. Please try again.</p>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WifiList;
