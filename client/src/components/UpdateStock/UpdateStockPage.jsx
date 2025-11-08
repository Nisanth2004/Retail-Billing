import React, { useContext, useState, useMemo } from "react";
import { AppContext } from "../../context/AppContext";
import UpdateStock from "./UpdateStock";
import "./UpdateStockPage.css";
import {
  FaSearch,
  FaBoxOpen,
  FaExclamationTriangle,
  FaTimesCircle,
  FaChartPie,
  FaChartBar,
  FaRedoAlt,
} from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const UpdateStockPage = () => {
  const { itemsData, categories } = useContext(AppContext);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

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
  const lowStockItems = itemsData.filter((i) => i.quantity <= 5 && i.quantity > 0);
  const outOfStockItems = itemsData.filter((i) => i.quantity === 0);
  const mostStocked = itemsData.reduce(
    (prev, curr) => (curr.quantity > (prev?.quantity || 0) ? curr : prev),
    null
  );
  const totalStockValue = itemsData.reduce(
    (sum, item) => sum + (item.quantity * (item.price || 0)),
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

  const COLORS = ["#FFBB28", "#FF8042", "#00C49F", "#0088FE", "#FF4B4B", "#A5A5A5"];

  return (
    <div className="update-stock-container border-container p-4">
      <div className="row gx-4">
        {/* Left Section */}
        <div className="col-md-9 border-end border-warning pe-4">
          {/* Search + Category Filter */}
          <div className="search-filter-bar d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
            {/* Search Box */}
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

            {/* Category Dropdown */}
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
                              : "text-success"
                          }
                        >
                          {item.quantity}
                        </b>
                      </p>
                      <UpdateStock itemId={item.itemId} />
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
              <p><FaBoxOpen className="me-2 text-info" /> Total Categories: <b>{categories.length}</b></p>
              <p><FaBoxOpen className="me-2 text-info" /> Total Items: <b>{totalItems}</b></p>
              <p><FaExclamationTriangle className="me-2 text-warning" /> Low Stock: <b>{lowStockItems.length}</b></p>
              <p><FaTimesCircle className="me-2 text-danger" /> Out of Stock: <b>{outOfStockItems.length}</b></p>
              <p>💰 Total Value: <b>₹{totalStockValue.toLocaleString()}</b></p>
              {mostStocked && (
                <p>🏆 Top Item: <b>{mostStocked.name}</b> ({mostStocked.quantity})</p>
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
