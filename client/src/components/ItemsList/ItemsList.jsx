import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { deleteItems } from "../../Service/ItemService";
import "./ItemsList.css";
import toast from "react-hot-toast";

const ItemsList = () => {
  const { itemsData, setItemsData } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = itemsData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const removeItem = async (itemId) => {
    try {
      const response = await deleteItems(itemId);
      if (response.status === 204) {
        setItemsData((prev) => prev.filter((item) => item.itemId !== itemId));
        toast.success("Item deleted successfully");
      } else {
        toast.error("Unable to delete the item");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete the item");
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
    }
  };

  return (
    <div
      className="category-list-container"
      style={{ height: "100vh", overflowY: "auto", overflowX: "hidden" }}
    >
      {/* 🔍 Search Bar */}
      <div className="row pe-2">
        <div className="input-group mb-3">
          <input
            type="text"
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

      {/* 🧾 Items List */}
      <div className="row g-3 pe-2">
        {filteredItems.map((item) => (
          <div className="col-12" key={item.itemId}>
            <div className="card p-3 bg-dark shadow-sm border border-warning rounded">
              <div className="d-flex align-items-center justify-content-between">
                {/* 🖼️ Item Info */}
                <div className="d-flex align-items-center">
                  <img
                    src={item.imgUrl}
                    alt={item.name}
                    className="item-image me-3 rounded"
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
                    <span className="badge rounded-pill text-bg-warning mt-1">
                      ₹{item.price}
                    </span>
                  </div>
                </div>

                {/* ❌ Delete Action */}
                <div className="d-flex flex-column align-items-end">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeItem(item.itemId)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <p className="text-center text-secondary mt-4">
            No items found for this search.
          </p>
        )}
      </div>
    </div>
  );
};

export default ItemsList;
