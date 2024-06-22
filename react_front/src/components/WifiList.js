import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WifiList = () => {
    const [wifiNetworks, setWifiNetworks] = useState([]);

    useEffect(() => {
        const fetchWifiNetworks = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/wifi/');
                setWifiNetworks(response.data);
            } catch (error) {
                console.error('Failed to fetch WiFi networks:', error);
            }
        };

        fetchWifiNetworks();
    }, []);

    return (
        <div>
            <h1>Available WiFi Networks</h1>
            <ul>
                {wifiNetworks.map((network, index) => (
                    <li key={index}>
                        {network.ssid} - {network.signal_strength}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WifiList;
