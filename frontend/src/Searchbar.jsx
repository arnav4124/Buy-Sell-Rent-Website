import React, { useState } from 'react';
import './Searchbar.css';
import { searchContext } from './Search';
const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
    const {searchQuery, setSearchQuery} = React.useContext(searchContext);

   

    const handleSearchChange = (e) => {
      const value = e.target.value;
      setSearchTerm(value); // Update local state to allow typing
      setSearchQuery(value); // Update context if needed elsewhere
    }; // Update the search query


  return (
    <div className='searchbar-container'>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        className='search-bar-input'
      />
      <button  className='search-bar-button'>
        Search
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    margin: '20px',
  },
  input: {
    padding: '8px',
    fontSize: '16px',
    width: '700px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    padding: '8px 16px',
    fontSize: '16px',
    width: '100px',
    backgroundColor: '#c71d7a',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default SearchBar;
