import React, { useState } from 'react';
import Modal from 'react-modal';
import Lottie from 'react-lottie';
import './WifiPasswordModal.css';

import nodAnimation from '../animations/Animation_smiley.json';
import shakeAnimation from '../animations/Animation_disagree.json';

const WifiPasswordModal = ({ isOpen, onRequestClose, wifiName, handleConnect }) => {
  const [password, setPassword] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowAnimation(false);

    try {
      const isConnected = await handleConnect(wifiName, password);
      console.log("isconnected = "+isConnected);
      setIsPasswordCorrect(isConnected);
      setShowAnimation(true);
    } catch (error) {
      setIsPasswordCorrect(false);
      setShowAnimation(true);
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
        <>
          <form className="modal-content" onSubmit={handleSubmit}>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setIsPasswordCorrect(null);
                  setShowAnimation(false);
                }}
                required
              />
            </label>
            <div className="modal-actions">
              <button type="button" onClick={handleClose} className="cancel-button">
                Cancel
              </button>
              <button type="submit" className="apply-button" disabled={isLoading}>
                {isLoading ? 'Connecting...' : 'Connect'}
              </button>
            </div>
          </form>
          {showAnimation && (
            <div className="animation-container">
              <Lottie
                options={defaultOptions}
                height={100}
                width={100}
              />
            </div>
          )}
        </>
      )}
    </Modal>
  );
};

export default WifiPasswordModal;
