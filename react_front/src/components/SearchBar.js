// SearchBar.js
import React from 'react';
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
