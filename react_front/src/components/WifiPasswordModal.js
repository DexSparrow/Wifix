//WifiPasswordModal.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Lottie from 'react-lottie';
import './WifiPasswordModal.css';

// Importer les fichiers d'animation JSON
import nodAnimation from '../animations/Animation_smile.json';
import shakeAnimation from '../animations/Animation_disagree.json';

const WifiPasswordModal = ({ isOpen, onRequestClose, id,wifiName, handleConnect }) => {
  const [password, setPassword] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(null); // null, true, false
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowAnimation(true);
    } else {
      setShowAnimation(false);
      setIsPasswordCorrect(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isConnected = await handleConnect(id,wifiName,password);
      setIsPasswordCorrect(isConnected);
    } catch (error) {
      setIsPasswordCorrect(false);
    } finally {
      setIsLoading(false);
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: isPasswordCorrect === null ? nodAnimation : shakeAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClose = () => {
    setIsMinimized(false);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel="Password Modal"
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
        <form className="modal-content" onSubmit={handleSubmit}>
          {showAnimation && (
            <div className="animation-container">
              <Lottie
                options={defaultOptions}
                height={60}
                width={60}
              />
            </div>
          )}

          <input
            type="password"
            placeholder="Enter the password here"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setIsPasswordCorrect(null); // Réinitialise l'état lorsque l'utilisateur tape un nouveau mot de passe
            }}
            required
          />

          <div className="modal-actions">
            <button type="button" onClick={handleClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="apply-button" disabled={isLoading}>
              {isLoading ? 'Connecting...' : 'Connect'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default WifiPasswordModal;
