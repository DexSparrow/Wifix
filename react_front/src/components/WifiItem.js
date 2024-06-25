import React, { useState } from 'react';
import WifiSettingsModal from './WifiSettingsModal';
import WifiPasswordModal from './WifiPasswordModal';
import './WifiItem.css';

const WifiItem = ({ name, connectToWifi }) => {
  const [settingsModalIsOpen, setSettingsModalIsOpen] = useState(false);
  const [passwordModalIsOpen, setPasswordModalIsOpen] = useState(false);

  const openSettingsModal = (e) => {
    e.stopPropagation(); // Prevent triggering the parent onClick event
    setSettingsModalIsOpen(true);
  };

  const closeSettingsModal = () => {
    setSettingsModalIsOpen(false);
  };

  const openPasswordModal = (e) => {
    e.stopPropagation(); // Prevent triggering the parent onClick event
    setPasswordModalIsOpen(true);
  };

  const closePasswordModal = () => {
    setPasswordModalIsOpen(false);
  };

  const handleConnect = (password) => {
    connectToWifi(name, password);
  };

  return (
    <div className="wifi-item" >
      <div className="wifi-info" onClick={openPasswordModal}>
        <i className="fas fa-wifi"></i>
        <span>{name}</span>
      </div>
      <div className="wifi-actions">
        <button className="btn blue" onClick={(e) => e.stopPropagation()}>
          <i className="fa fa-qrcode"></i>
        </button>
        <button className="btn settings" onClick={openSettingsModal}>
          <i className="fas fa-cog"></i>
        </button>
      </div>

      <WifiSettingsModal
        isOpen={settingsModalIsOpen}
        onRequestClose={closeSettingsModal}
        wifiName={name}
      />

      <WifiPasswordModal
        isOpen={passwordModalIsOpen}
        onRequestClose={closePasswordModal}
        wifiName={name}
        handleConnect={handleConnect}
      />
    </div>
  );
};

export default WifiItem;
