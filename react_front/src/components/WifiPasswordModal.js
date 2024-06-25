import React, { useState } from 'react';
import Modal from 'react-modal';
import './WifiPasswordModal.css';

const WifiPasswordModal = ({ isOpen, onRequestClose, wifiName, handleConnect }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleConnect(password);
    onRequestClose();
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
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <div className="modal-actions">
          <button type="button" onClick={onRequestClose} className="cancel-button">
            Cancel
          </button>
          <button type="submit" className="apply-button">
            Connect
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default WifiPasswordModal;
