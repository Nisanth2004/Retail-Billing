import React from 'react'
import './Category.css'
const Category = ({categoryName,imgUrl,bgColor,numberOfItems,isSelected,onClick}) => {

  
  return (
    <div className="d-flex align-items-center p-3 rounded gap-1 position-relative category-hover"
    style={{backgroundColor:bgColor,cursor:'pointer'}}
    onClick={onClick}
    >
      <div style={{position:'relative',marginRight:'15px'}}>
        <img className='category-image' src={imgUrl} alt={categoryName}></img>

      </div>

      <div>
        <h6 className='text-white mb-0'>{categoryName}</h6>
        <p className='text-white mb-0'>{numberOfItems} Items</p>
      </div>

{isSelected && <div className='active-category'></div>}


    </div>
  )
}

export default Category
