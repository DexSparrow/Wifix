import React, { useState } from 'react';

const WifiControl = ({ toggleWifi }) => {
    const [wifiStatus, setWifiStatus] = useState('');

    const handleToggleWifi = async (action) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/toggle/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action }),
            });

            if (!response.ok) {
                throw new Error('Failed to toggle WiFi');
            }

            const data = await response.json();
            setWifiStatus(data.message); // Assuming your Django view returns a 'message' field
        } catch (error) {
            console.error('Error toggling WiFi:', error);
            setWifiStatus('Error toggling WiFi.');
        }
    };

    return (
        <div>
            <h1>WiFi Control</h1>
            <button onClick={() => handleToggleWifi('on')}>Activate WiFi</button>
            <button onClick={() => handleToggleWifi('off')}>Deactivate WiFi</button>
            {wifiStatus && <p>{wifiStatus}</p>}
        </div>
    );
};

export default WifiControl;
