import React, { useState } from 'react'

const SearchBox = ({onSearch}) => {

    const[searchText,setSearchText]=useState('')
    
    const handleInputChange=(e)=>{
        const text=e.target.value;
        setSearchText(text)
        onSearch(text);

    }
  return (
    <div className="input-group mb-3">
        <input type="text" name="" id=""
         className="form-control"
         onChange={handleInputChange}
         value={searchText}

         placeholder='Search Items..'
        
        />

        <span className="input-group-text bg-warning">
            <i className="bi bi-search"></i>
        </span>
    </div>

  )
}

export default SearchBox
