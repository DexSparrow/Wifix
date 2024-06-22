import React, { useState } from 'react';

const WifiControl = ({ toggleWifi }) => {
    const [wifiStatus, setWifiStatus] = useState('');

    const handleToggleWifi = async (action) => {
        try {
            await toggleWifi(action);
            setWifiStatus(action === 'on' ? 'WiFi activated.' : 'WiFi deactivated.');
        } catch (error) {
            console.error('Error toggling WiFi:', error);
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
