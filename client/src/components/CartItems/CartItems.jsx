// src/components/CartItems/CartItems.jsx
import React, { useContext } from 'react';
import './CartItems.css';
import { AppContext } from '../../context/AppContext';

const CartItems = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(AppContext);

  return (
    <div className="p-3 h-100 overflow-y-auto">
      {cartItems.length === 0 ? (
        <p className="text-light">Your cart is empty.</p>
      ) : (
        <div className="cart-items-list">
          {cartItems.map((item, index) => {
            const price = Number(item.price) || 0;
            const qty = Number(item.quantity) || 0;
            const cgstRate = Number(item.cgstRate) || 0;
            const sgstRate = Number(item.sgstRate) || 0;

            const itemSubtotal = price * qty;
            const cgstAmount = (itemSubtotal * cgstRate) / 100;
            const sgstAmount = (itemSubtotal * sgstRate) / 100;
            const totalWithTax = itemSubtotal + cgstAmount + sgstAmount;

            return (
              <div key={index} className="cart-item mb-3 p-3 bg-dark rounded">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0 text-light">{item.name}</h6>
                  <p className="mb-0 text-light">₹{itemSubtotal.toFixed(2)}</p>
                </div>

                <div>
                  <small className="text-warning">
                    CGST ({cgstRate}%): ₹{cgstAmount.toFixed(2)} · SGST ({sgstRate}%): ₹{sgstAmount.toFixed(2)}
                  </small>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-2">
                  <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-danger btn-sm" onClick={() => updateQuantity(item.itemId, qty - 1)} disabled={qty === 1}>
                      <i className="bi bi-dash"></i>
                    </button>

                    <span className="text-light">{qty}</span>

                    <button className="btn btn-primary btn-sm" onClick={() => updateQuantity(item.itemId, qty + 1)}>
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>

                  <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.itemId)} style={{ width: 'auto' }}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>

                <div className="mt-2 text-end text-light">
                  <small>Total (with tax): ₹{totalWithTax.toFixed(2)}</small>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CartItems;
