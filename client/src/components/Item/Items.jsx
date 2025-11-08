import React, { useContext } from 'react'
import './Item.css'
import { AppContext } from '../../context/AppContext'

const Items = ({ itemName, itemImage, itemPrice, itemId, itemStock }) => {  // ✅ Added itemStock
  const { addToCart } = useContext(AppContext);

  const handleAddToCart = () => {
    addToCart({
      name: itemName,
      price: itemPrice,
      quantity: 1,
      itemId: itemId
    });
  };

  return (
    <div className="p-3 bg-dark rounded shadow-sm h-100 d-flex align-items-center item-card">
      {/* Image Section */}
      <div style={{ position: 'relative', marginRight: '15px' }}>
        <img src={itemImage} alt={itemName} className="item-image" />
      </div>

      {/* Info Section */}
      <div className="flex-grow-1 ms-2">
        <h6 className="mb-1 text-light">{itemName}</h6>
        <p className="mb-0 fw-bold text-light">&#8377;{itemPrice}</p>

        {/* ✅ Show available stock */}
        <small className={`text-${itemStock > 0 ? 'success' : 'danger'}`}>
          {itemStock > 0 ? `In Stock: ${itemStock}` : 'Out of Stock'}
        </small>
      </div>

      {/* Add to Cart Section */}
      <div className="d-flex flex-column justify-content-between align-items-center ms-3"
        style={{ height: '100%' }}>
        <i className="bi bi-cart-plus fs-4 text-warning"></i>

        {/* ✅ Add your conditional button here */}
        <button
          className="btn btn-success btn-sm"
          onClick={handleAddToCart}
          disabled={itemStock <= 0}   // ✅ Disable if no stock
        >
          {itemStock > 0 ? <i className="bi bi-plus"></i> : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

export default Items;
