//Wifi_QrCodeModal.js

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './Wifi_QrCodeModal.css';

const WifiQrCodeModal = ({ isOpen, onRequestClose, id, wifiName }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const fetchQrCode = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/wifi/qr/${encodeURIComponent(id)}/`);
      const qrCodeBlob = await response.blob();
      const qrCodeUrl = URL.createObjectURL(qrCodeBlob);
      setQrCodeUrl(qrCodeUrl);
    } catch (error) {
      console.error('Error fetching QR code:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchQrCode();
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsMinimized(false);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className={`modal-macos ${isMinimized ? 'minimized' : ''}`}
      overlayClassName="overlay"
    >
      <div className="modal-header-macos">
        <div className="window-controls">
          <div className="close" onClick={handleClose}></div>
          <div className="minimize" onClick={handleMinimize}></div>
          <div className="maximize" onClick={() => setIsMinimized(false)}></div>
        </div>
        <h2 className="modal-title">Connect to {wifiName}</h2>
      </div>
      {!isMinimized && (
        <div className="modal-content">
          <img src={qrCodeUrl} alt="QR Code" className="qr-code-image" />
        </div>
      )}
    </Modal>
  );
};

export default WifiQrCodeModal;
