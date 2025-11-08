<<<<<<< HEAD
import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { deleteItems, updateItemStock } from '../../Service/ItemService';
import './ItemsList.css';
import toast from 'react-hot-toast';

const ItemsList = () => {
  const { itemsData, setItemsData } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = itemsData.filter(item =>
=======
import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { deleteItems } from "../../Service/ItemService";
import "./ItemsList.css";
import toast from "react-hot-toast";

const ItemsList = () => {
  const { itemsData, setItemsData } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = itemsData.filter((item) =>
>>>>>>> 4f943e9 (Update threshold)
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const removeItem = async (itemId) => {
    try {
      const response = await deleteItems(itemId);
      if (response.status === 204) {
<<<<<<< HEAD
        const updatedItems = itemsData.filter(item => item.itemId !== itemId);
        setItemsData(updatedItems);
        toast.success("Item deleted");
=======
        setItemsData((prev) => prev.filter((item) => item.itemId !== itemId));
        toast.success("Item deleted successfully");
>>>>>>> 4f943e9 (Update threshold)
      } else {
        toast.error("Unable to delete the item");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete the item");
<<<<<<< HEAD
      console.log(error);
    }
  };

  const handleAddStock = async (itemId, quantity) => {
    try {
      const response = await updateItemStock(itemId, quantity);
      const updatedItem = response.data;
      setItemsData(prevItems =>
        prevItems.map(item => item.itemId === itemId ? updatedItem : item)
      );
      toast.success(`Added ${quantity} stock to ${updatedItem.name}`);
    } catch (err) {
      toast.error("Failed to update stock");
      console.log(err);
=======
    }
  };

  // 🧮 Helper function to determine stock status
  const getStockBadge = (quantity, threshold) => {
    const diff = quantity - threshold;

    if (quantity <= threshold) {
      return <span className="badge bg-danger ms-2">Low Stock</span>;
    } else if (diff > 0 && diff <= 5) {
      return <span className="badge bg-warning text-dark ms-2">Warning</span>;
    } else {
      return null;
>>>>>>> 4f943e9 (Update threshold)
    }
  };

  return (
<<<<<<< HEAD
    <div className="category-list-container" style={{ height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
=======
    <div
      className="category-list-container"
      style={{ height: "100vh", overflowY: "auto", overflowX: "hidden" }}
    >
      {/* 🔍 Search Bar */}
>>>>>>> 4f943e9 (Update threshold)
      <div className="row pe-2">
        <div className="input-group mb-3">
          <input
            type="text"
<<<<<<< HEAD
            name="keyword"
            id="keyword"
=======
>>>>>>> 4f943e9 (Update threshold)
            placeholder="Search by keyword"
            className="form-control"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <span className="input-group-text bg-warning">
            <i className="bi bi-search"></i>
          </span>
        </div>
      </div>

<<<<<<< HEAD
      <div className="row g-3 pe-2">
        {filteredItems.map((item, index) => (
          <div className="col-12" key={index}>
            <div className="card p-3 bg-dark shadow-sm">
              <div className="d-flex align-items-center justify-content-between">
=======
      {/* 🧾 Items List */}
      <div className="row g-3 pe-2">
        {filteredItems.map((item) => (
          <div className="col-12" key={item.itemId}>
            <div className="card p-3 bg-dark shadow-sm border border-warning rounded">
              <div className="d-flex align-items-center justify-content-between">
                {/* 🖼️ Item Info */}
>>>>>>> 4f943e9 (Update threshold)
                <div className="d-flex align-items-center">
                  <img
                    src={item.imgUrl}
                    alt={item.name}
                    className="item-image me-3 rounded"
<<<<<<< HEAD
                    style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                  />
                  <div>
                    <h6 className="mb-1 text-white">{item.name}</h6>
                    <p className="mb-0 text-white">Category: {item.categoryName}</p>
                    <p className="mb-0 text-white">
                      Stock: {item.quantity} {item.quantity <= 5 && <span className="badge bg-danger">Low</span>}
                    </p>
=======
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    {/* 🏷️ Item Name */}
                    <h6 className="mb-1 text-warning">{item.name}</h6>

                    {/* 🏷️ Category as Badge */}
                    <span className="badge bg-info text-dark mb-1">
                      {item.categoryName}
                    </span>

                    {/* 🧮 Stock + Threshold Info */}
                    <p className="mb-0 text-light small">
                      Stock:{" "}
                      <b
                        className={
                          item.quantity <= item.minThreshold
                            ? "text-danger"
                            : "text-success"
                        }
                      >
                        {item.quantity}
                      </b>
                      <span className="text-secondary ms-1">
                        (Min: {item.minThreshold})
                      </span>
                      {/* 🟡/🔴 Badge based on stock condition */}
                      {getStockBadge(item.quantity, item.minThreshold)}
                    </p>

                    {/* 💰 Price */}
>>>>>>> 4f943e9 (Update threshold)
                    <span className="badge rounded-pill text-bg-warning mt-1">
                      ₹{item.price}
                    </span>
                  </div>
                </div>

<<<<<<< HEAD
                <div className="d-flex flex-column align-items-end gap-2">
                  <button className="btn btn-warning btn-sm" onClick={() => handleAddStock(item.itemId, 5)}>
                    Add 5 Stock
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => removeItem(item.itemId)}>
=======
                {/* ❌ Delete Action */}
                <div className="d-flex flex-column align-items-end">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeItem(item.itemId)}
                  >
>>>>>>> 4f943e9 (Update threshold)
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
<<<<<<< HEAD
=======

        {filteredItems.length === 0 && (
          <p className="text-center text-secondary mt-4">
            No items found for this search.
          </p>
        )}
>>>>>>> 4f943e9 (Update threshold)
      </div>
    </div>
  );
};

export default ItemsList;
