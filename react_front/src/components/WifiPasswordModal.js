import React, { useState } from 'react';
import Modal from 'react-modal';
import Lottie from 'react-lottie';
import './WifiPasswordModal.css';

// Importer les fichiers d'animation JSON
import nodAnimation from '../animations/Animation_smiley.json';
import shakeAnimation from '../animations/Animation_disagree.json';

const WifiPasswordModal = ({ isOpen, onRequestClose, wifiName, handleConnect }) => {
  const [password, setPassword] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(null); // null, true, false
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isConnected = await handleConnect(wifiName, password);
      setIsPasswordCorrect(isConnected);
    } catch (error) {
      setIsPasswordCorrect(false);
    } finally {
      setIsLoading(false);
    }
  };

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: isPasswordCorrect ? nodAnimation : shakeAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Password Modal"
      className="modal"
      overlayClassName="overlay"
    >
      <div className="modal-header">
        <h2 className="modal-title">Connect to {wifiName}</h2>
      </div>
      <form className="modal-content" onSubmit={handleSubmit}>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setIsPasswordCorrect(null); // Réinitialise l'état lorsque l'utilisateur tape un nouveau mot de passe
            }}
            required
          />
        </label>
        <div className="modal-actions">
          <button type="button" onClick={onRequestClose} className="cancel-button">
            Cancel
          </button>
          <button type="submit" className="apply-button" disabled={isLoading}>
            {isLoading ? 'Connecting...' : 'Connect'}
          </button>
        </div>
      </form>
      {isPasswordCorrect !== null && (
        <div className="animation-container">
          <Lottie
            options={defaultOptions}
            height={100}
            width={100}
          />
        </div>
      )}
    </Modal>
  );
};

export default WifiPasswordModal;
