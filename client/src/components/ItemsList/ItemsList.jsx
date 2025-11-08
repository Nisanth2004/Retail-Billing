import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { deleteItems, updateItemStock } from '../../Service/ItemService';
import './ItemsList.css';
import toast from 'react-hot-toast';

const ItemsList = () => {
  const { itemsData, setItemsData } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = itemsData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const removeItem = async (itemId) => {
    try {
      const response = await deleteItems(itemId);
      if (response.status === 204) {
        const updatedItems = itemsData.filter(item => item.itemId !== itemId);
        setItemsData(updatedItems);
        toast.success("Item deleted");
      } else {
        toast.error("Unable to delete the item");
      }
    } catch (error) {
      toast.error("Unable to delete the item");
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
    }
  };

  return (
    <div className="category-list-container" style={{ height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
      <div className="row pe-2">
        <div className="input-group mb-3">
          <input
            type="text"
            name="keyword"
            id="keyword"
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

      <div className="row g-3 pe-2">
        {filteredItems.map((item, index) => (
          <div className="col-12" key={index}>
            <div className="card p-3 bg-dark shadow-sm">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <img
                    src={item.imgUrl}
                    alt={item.name}
                    className="item-image me-3 rounded"
                    style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                  />
                  <div>
                    <h6 className="mb-1 text-white">{item.name}</h6>
                    <p className="mb-0 text-white">Category: {item.categoryName}</p>
                    <p className="mb-0 text-white">
                      Stock: {item.quantity} {item.quantity <= 5 && <span className="badge bg-danger">Low</span>}
                    </p>
                    <span className="badge rounded-pill text-bg-warning mt-1">
                      ₹{item.price}
                    </span>
                  </div>
                </div>

                <div className="d-flex flex-column align-items-end gap-2">
                  <button className="btn btn-warning btn-sm" onClick={() => handleAddStock(item.itemId, 5)}>
                    Add 5 Stock
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => removeItem(item.itemId)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsList;
