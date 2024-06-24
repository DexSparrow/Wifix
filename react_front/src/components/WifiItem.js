// src/components/WifiItem.js
import React from 'react';
import './WifiItem.css';

const WifiItem = ({ name }) => {
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
        <button className="btn settings">
          <i className="fas fa-cog"></i>
        </button>
      </div>
    </div>
  );
};

export default WifiItem;
