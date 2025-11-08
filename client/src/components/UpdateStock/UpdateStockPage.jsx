import React, { useContext, useState, useMemo } from "react";
import { AppContext } from "../../context/AppContext";
<<<<<<< HEAD
import UpdateStock from "./UpdateStock";
import "./UpdateStockPage.css";
=======
import { updateItemThreshold } from "../../Service/ItemService";
import UpdateStock from "./UpdateStock";
import "./UpdateStockPage.css";
import toast from "react-hot-toast";
>>>>>>> 4f943e9 (Update threshold)
import {
  FaSearch,
  FaBoxOpen,
  FaExclamationTriangle,
  FaTimesCircle,
  FaChartPie,
  FaChartBar,
<<<<<<< HEAD
  FaRedoAlt,
=======
  FaInfoCircle,
  FaSpinner,
>>>>>>> 4f943e9 (Update threshold)
} from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const UpdateStockPage = () => {
<<<<<<< HEAD
  const { itemsData, categories } = useContext(AppContext);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
=======
  const { itemsData, categories, setItemsData } = useContext(AppContext);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [thresholdInputs, setThresholdInputs] = useState({});
  const [loadingItemId, setLoadingItemId] = useState(null);
>>>>>>> 4f943e9 (Update threshold)

  // ✅ Filter items
  const filteredItems = useMemo(() => {
    return itemsData.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.categoryName === selectedCategory;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [itemsData, selectedCategory, searchTerm]);

  // ✅ Stock analytics
  const totalItems = itemsData.length;
<<<<<<< HEAD
  const lowStockItems = itemsData.filter((i) => i.quantity <= 5 && i.quantity > 0);
=======
  const lowStockItems = itemsData.filter(
    (i) => i.quantity <= i.minThreshold && i.quantity > 0
  );
>>>>>>> 4f943e9 (Update threshold)
  const outOfStockItems = itemsData.filter((i) => i.quantity === 0);
  const mostStocked = itemsData.reduce(
    (prev, curr) => (curr.quantity > (prev?.quantity || 0) ? curr : prev),
    null
  );
  const totalStockValue = itemsData.reduce(
<<<<<<< HEAD
    (sum, item) => sum + (item.quantity * (item.price || 0)),
=======
    (sum, item) => sum + item.quantity * (item.price || 0),
>>>>>>> 4f943e9 (Update threshold)
    0
  );

  // ✅ Chart data
  const chartData = useMemo(() => {
    const data = categories.map((cat) => {
      const totalQty = itemsData
        .filter((i) => i.categoryName === cat.name)
        .reduce((sum, i) => sum + i.quantity, 0);
      return { name: cat.name, value: totalQty };
    });
    return data.filter((d) => d.value > 0);
  }, [itemsData, categories]);

<<<<<<< HEAD
  const COLORS = ["#FFBB28", "#FF8042", "#00C49F", "#0088FE", "#FF4B4B", "#A5A5A5"];

  return (
    <div className="update-stock-container border-container p-4">
=======
  const COLORS = [
    "#FFBB28",
    "#FF8042",
    "#00C49F",
    "#0088FE",
    "#FF4B4B",
    "#A5A5A5",
  ];

  // ✅ Handle threshold input change
  const handleThresholdChange = (itemId, value) => {
    setThresholdInputs((prev) => ({ ...prev, [itemId]: value }));
  };

  // ✅ Update threshold with loading state
  const updateThreshold = async (itemId) => {
    const minThreshold = thresholdInputs[itemId];
    if (!minThreshold || minThreshold < 1) {
      toast.error("Please enter a valid threshold");
      return;
    }

    setLoadingItemId(itemId);
    try {
      const response = await updateItemThreshold(itemId, minThreshold);
      const updatedItem = response.data;

      setItemsData((prev) =>
        prev.map((item) => (item.itemId === itemId ? updatedItem : item))
      );

      toast.success(`Threshold updated to ${minThreshold}`);
    } catch (error) {
      toast.error("Failed to update threshold");
      console.error(error);
    } finally {
      setLoadingItemId(null);
    }
  };

  return (
    <div className="update-stock-container border-container p-4">
      {/* 🔔 Info Banner */}
      <div className="info-banner mb-4">
        <FaInfoCircle className="me-2" size={18} />
        <span>
          Items below their <b>threshold value</b> will appear as{" "}
          <b className="text-danger">Low Stock</b>. You can update each item’s
          threshold and stock separately for better monitoring.
        </span>
      </div>

>>>>>>> 4f943e9 (Update threshold)
      <div className="row gx-4">
        {/* Left Section */}
        <div className="col-md-9 border-end border-warning pe-4">
          {/* Search + Category Filter */}
          <div className="search-filter-bar d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
<<<<<<< HEAD
            {/* Search Box */}
=======
>>>>>>> 4f943e9 (Update threshold)
            <div className="search-box d-flex align-items-center flex-grow-1 me-3">
              <span className="search-icon">
                <FaSearch />
              </span>
              <input
                type="text"
                className="search-input"
                placeholder="Search by item name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

<<<<<<< HEAD
            {/* Category Dropdown */}
=======
>>>>>>> 4f943e9 (Update threshold)
            <select
              className="category-dropdown"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Scrollable Items */}
          <div className="scrollable-items">
            <div className="row g-4">
              {filteredItems.map((item) => (
                <div className="col-lg-3 col-md-4 col-sm-6" key={item.itemId}>
                  <div className="card bg-dark text-light border border-warning rounded shadow-sm h-100">
                    <img
                      src={item.imgUrl}
                      alt={item.name}
                      className="rounded-top"
<<<<<<< HEAD
                      style={{ width: "100%", height: "150px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h6 className="fw-bold text-warning mb-1">{item.name}</h6>
                      <p className="text-secondary small mb-1">
                        {item.categoryName}
                      </p>
                      <p className="mb-2">
                        Current Stock:{" "}
                        <b
                          className={
                            item.quantity <= 5
                              ? "text-danger"
                              : item.quantity === 0
                              ? "text-muted"
=======
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="card-body">
                      <h6 className="fw-bold text-warning mb-1">{item.name}</h6>
                      <span className="badge bg-warning text-dark mb-2">
                        {item.categoryName}
                      </span>
                      <p className="mb-1">
                        Stock:{" "}
                        <b
                          className={
                            item.quantity <= item.minThreshold
                              ? "text-danger"
>>>>>>> 4f943e9 (Update threshold)
                              : "text-success"
                          }
                        >
                          {item.quantity}
<<<<<<< HEAD
                        </b>
                      </p>
                      <UpdateStock itemId={item.itemId} />
=======
                        </b>{" "}
                        <span className="text-secondary small">
                          (Threshold: {item.minThreshold})
                        </span>
                        {item.quantity <= item.minThreshold && (
                          <span className="badge bg-danger ms-2">Low</span>
                        )}
                      </p>

                      {/* 🟡 Update Threshold Section */}
                      <div className="threshold-section mt-3">
                        <label className="form-label text-warning fw-semibold small">
                          <FaExclamationTriangle className="me-1" />
                          Set Threshold Value
                        </label>
                        <div className="input-group input-group-sm mt-1">
                          <input
                            type="number"
                            min="1"
                            className="form-control form-control-sm bg-dark text-light border-warning"
                            placeholder="Enter new threshold"
                            value={thresholdInputs[item.itemId] || ""}
                            onChange={(e) =>
                              handleThresholdChange(item.itemId, e.target.value)
                            }
                            disabled={loadingItemId === item.itemId}
                          />
                          <button
                            className="btn btn-outline-warning btn-sm d-flex align-items-center justify-content-center"
                            onClick={() => updateThreshold(item.itemId)}
                            disabled={loadingItemId === item.itemId}
                          >
                            {loadingItemId === item.itemId ? (
                              <>
                                <FaSpinner className="spin me-2" /> Updating...
                              </>
                            ) : (
                              "Update"
                            )}
                          </button>
                        </div>
                      </div>

                      {/* 🟢 Stock Update Section */}
                      <div className="stock-update-section mt-3">
                        <label className="form-label text-success fw-semibold small">
                          <FaBoxOpen className="me-1" />
                          Update Stock Quantity
                        </label>
                        <UpdateStock itemId={item.itemId} />
                      </div>
>>>>>>> 4f943e9 (Update threshold)
                    </div>
                  </div>
                </div>
              ))}
              {filteredItems.length === 0 && (
                <p className="text-center text-secondary mt-4">
                  No items found for this category or search.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-md-3 sticky-sidebar">
          <div className="card bg-dark text-light border border-warning p-3 h-100">
            <h5 className="text-warning mb-3 d-flex align-items-center">
              <FaChartBar className="me-2" /> Stock Insights
            </h5>

            <div className="stock-stats mb-4 small">
<<<<<<< HEAD
              <p><FaBoxOpen className="me-2 text-info" /> Total Categories: <b>{categories.length}</b></p>
              <p><FaBoxOpen className="me-2 text-info" /> Total Items: <b>{totalItems}</b></p>
              <p><FaExclamationTriangle className="me-2 text-warning" /> Low Stock: <b>{lowStockItems.length}</b></p>
              <p><FaTimesCircle className="me-2 text-danger" /> Out of Stock: <b>{outOfStockItems.length}</b></p>
              <p>💰 Total Value: <b>₹{totalStockValue.toLocaleString()}</b></p>
              {mostStocked && (
                <p>🏆 Top Item: <b>{mostStocked.name}</b> ({mostStocked.quantity})</p>
=======
              <p>
                <FaBoxOpen className="me-2 text-info" /> Total Categories:{" "}
                <b>{categories.length}</b>
              </p>
              <p>
                <FaBoxOpen className="me-2 text-info" /> Total Items:{" "}
                <b>{totalItems}</b>
              </p>
              <p>
                <FaExclamationTriangle className="me-2 text-warning" /> Low
                Stock: <b>{lowStockItems.length}</b>
              </p>
              <p>
                <FaTimesCircle className="me-2 text-danger" /> Out of Stock:{" "}
                <b>{outOfStockItems.length}</b>
              </p>
              <p>
                💰 Total Value:{" "}
                <b>₹{totalStockValue.toLocaleString()}</b>
              </p>
              {mostStocked && (
                <p>
                  🏆 Top Item:{" "}
                  <b>
                    {mostStocked.name} ({mostStocked.quantity})
                  </b>
                </p>
>>>>>>> 4f943e9 (Update threshold)
              )}
            </div>

            {chartData.length > 0 && (
              <>
                <h6 className="text-info mt-3 d-flex align-items-center">
                  <FaChartPie className="me-2" /> Category Distribution
                </h6>
                <div style={{ width: "100%", height: 200 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        dataKey="value"
                        data={chartData}
                        outerRadius={70}
                        label
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}

            <p className="text-secondary small text-center mt-3">
              Last Updated: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateStockPage;
