// src/components/SearchBar.js
import React from 'react';
import '../fontawesome-free-5.15.4-web/css/all.min.css';
import '../fontawesome-free-5.15.4-web/css/all.css';

import './SearchBar.css';

const SearchBar = ({ onChange }) => {
  return (
    <div className="search-bar">
      <input type="text" placeholder="search_wifi..." onChange={onChange} />
      <button className="search-button">
        <i className="fas fa-search"></i>
      </button>
    </div>
  );
};

export default SearchBar;
