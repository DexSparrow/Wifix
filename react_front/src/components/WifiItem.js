import React, { useState } from 'react';
import WifiSettingsModal from './WifiSettingsModal';
import WifiPasswordModal from './WifiPasswordModal';
import './WifiItem.css';

const WifiItem = ({ name, connectToWifi, akm }) => {
  const [settingsModalIsOpen, setSettingsModalIsOpen] = useState(false);
  const [passwordModalIsOpen, setPasswordModalIsOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const openSettingsModal = (e) => {
    e.stopPropagation(); // Prevent triggering the parent onClick event
    setSettingsModalIsOpen(true);
  };

  const closeSettingsModal = () => {
    setSettingsModalIsOpen(false);
  };

  const openPasswordModal = (e) => {
    e.stopPropagation(); // Prevent triggering the parent onClick event
    if (akm !== 0) {
      setPasswordModalIsOpen(true);
    } else {
      // On peut gérer ici une action alternative si nécessaire
    }
  };

  const closePasswordModal = () => {
    setPasswordModalIsOpen(false);
  };

  const handleConnect = (name, password) => {
    return connectToWifi(name, password);
  };

  const fetchQrCode = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/wifi/qr/${encodeURIComponent(name)}/`);
      const qrCodeBlob = await response.blob();
      const qrCodeUrl = URL.createObjectURL(qrCodeBlob);
      setQrCodeUrl(qrCodeUrl);
    } catch (error) {
      console.error('Error fetching QR code:', error);
    }
  };

  return (
    <div className="wifi-item">
      <div className="wifi-info" onClick={openPasswordModal}>
        <i className="fas fa-wifi icon_white"></i>
        {akm !== 0 && ( // Condition pour afficher le cadenas
          <i className="fas fa-lock icon_white" style={{ marginTop:'20px',marginLeft: '17px', color: '#333',fontSize:'8px',position:'absolute',color:'white'}}></i>
        )}
        <span>{name}</span>
      </div>
      <div className="wifi-actions">
        <button className="btn blue" onClick={(e) => {
          e.stopPropagation();
          fetchQrCode();
        }}>
          <i className="fa fa-qrcode"></i>
        </button>
        <button className="btn settings" onClick={openSettingsModal}>
          <i className="fas fa-cog"></i>
        </button>
      </div>

      {qrCodeUrl && (
        <div className="qr-code">
          <img src={qrCodeUrl} alt="QR Code" />
        </div>
      )}

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
