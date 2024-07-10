import React, { useState } from 'react';
import WifiSettingsModal from './WifiSettingsModal';
import WifiPasswordModal from './WifiPasswordModal';
import WifiQrCodeModal from './Wifi_QrCodeModal';
import './WifiItem.css';

const WifiItem = ({ id,name, connectToWifi, akm ,ping}) => {
  const [settingsModalIsOpen, setSettingsModalIsOpen] = useState(false);
  const [passwordModalIsOpen, setPasswordModalIsOpen] = useState(false);
  const [QrCodeModalIsOpen, setQrCodeModalIsOpen] = useState(false);


  const clicked_item = async (e)=>{
    e.stopPropagation(); // Prevent triggering the parent onClick event
    if (akm !== 0) {
      try {
        const res = await ping(id);
        closePasswordModal();        
      } catch (error) {
        console.log("Connected");
        openPasswordModal();
        //continue
      } finally {
        // setIsLoading(false);
      } 
    }
    else {
      // On peut gérer ici une action alternative si nécessaire
    }
  }

  const openQrCodeModal = (e) => {
    e.stopPropagation(); // Prevent triggering the parent onClick event
    setQrCodeModalIsOpen(true);
  };
  
  const openSettingsModal = (e) => {
    e.stopPropagation(); // Prevent triggering the parent onClick event
    setSettingsModalIsOpen(true);
  };

  const closeSettingsModal = () => {
    setSettingsModalIsOpen(false);
  };

  const closeQrCodeModal = () => {
    setQrCodeModalIsOpen(false);
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

  const handleConnect = (ID,name, password) => {
    return connectToWifi(ID,name, password);
  };

  return (
    <div className="wifi-item">
      <div className="wifi-info" onClick={clicked_item}>
        <i className="fas fa-wifi icon_white"></i>
        {akm !== 0 && ( // Condition pour afficher le cadenas
          <i className="fas fa-lock icon_white" style={{ marginTop:'20px',marginLeft: '17px', color: '#333',fontSize:'8px',position:'absolute',color:'white'}}></i>
        )}
        <span>{name}</span>
      </div>
      <div className="wifi-actions">
        <button className="btn blue" onClick={openQrCodeModal}>
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
        id={id}
      />

    <WifiQrCodeModal
        isOpen={QrCodeModalIsOpen}
        wifiName={name}
        id={id}
        onRequestClose={closeQrCodeModal}
      />

    </div>
  );
};

export default WifiItem;
