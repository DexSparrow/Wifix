import React, { useState } from 'react';
import WifiSettingsModal from './WifiSettingsModal';
import './WifiItem.css';

const WifiItem = ({ name }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="wifi-item">
      <div className="wifi-info">
        <i className="fas fa-wifi"></i>
        <span>{name}</span>
      </div>
      <div className="wifi-actions">
        <button className="btn blue">
          <i className="fa fa-qrcode"></i>
        </button>
        <button className="btn settings" onClick={openModal}>
          <i className="fas fa-cog"></i>
        </button>
      </div>

      <WifiSettingsModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        wifiName={name}
      />
    </div>
  );
};

export default WifiItem;
