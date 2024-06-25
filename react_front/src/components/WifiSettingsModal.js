import React from 'react';
import Modal from 'react-modal';
import './WifiSettingsModal.css';

const WifiSettingsModal = ({ isOpen, onRequestClose, wifiName }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Settings Modal"
      className="modal"
      overlayClassName="overlay"
    >
      <div className="modal-header">
        <div className="window-controls">
          <button className="close-btn" onClick={onRequestClose}></button>
          <button className="minimize-btn"></button>
          <button className="maximize-btn"></button>
        </div>
        <h2 className="modal-title">{wifiName}</h2>
      </div>
      <div className="modal-content">
        <label>Hardware Address</label>
        <p>22:8A:1C:AF:F1:4E</p>
        <label>Last Used</label>
        <p>3 days ago</p>
        <label>
          <input type="checkbox" /> Connect automatically
        </label>
        <label>
          <input type="checkbox" /> Make available to other users
        </label>
        <label>
          <input type="checkbox" /> Metered connection: has data limits or can incur charges
        </label>
      </div>
      <div className="modal-actions">
        <button onClick={onRequestClose} className="cancel-button">Cancel</button>
        <button className="apply-button">Apply</button>
      </div>
    </Modal>
  );
};

export default WifiSettingsModal;
