import React, { useEffect, useState } from "react";
import { getStockPredictions } from "../../Service/StockPredictionService";
import { FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import toast from "react-hot-toast";
import "./StockPredictionPage.css"; // 👈 add custom CSS below

const StockPredictionPage = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const response = await getStockPredictions();
      setPredictions(response.data);
    } catch (error) {
      toast.error("Failed to fetch stock analysis");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="loading-container">
        <FaSpinner className="loading-spinner text-warning" size={40} />
        <p className="text-light mt-3">Analyzing stock trends...</p>
      </div>
    );

  return (
    <div className="container mt-4">
      {/* 🟡 Meaningful Header */}
      <h4 className="text-warning mb-3">📈 Stock Refill Forecast</h4>
      <p className="text-secondary small mb-4">
        This report predicts how long your current stock will sustain based on recent sales patterns.
        Use this insight to plan timely restocking and avoid shortages.
      </p>

      <div className="table-responsive">
        <table className="table table-dark table-hover border-warning">
          <thead className="table-warning text-dark">
            <tr>
              <th>Item Name</th>
              <th>Current Quantity</th>
              <th>Average Daily Sales</th>
              <th>Estimated Days Remaining</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((item, index) => {
              const daysLeft = item.predictedDaysLeft;
              const isLow = typeof daysLeft === "number" && daysLeft <= 7;
              const isNotSelling = daysLeft === "Not selling";

              return (
                <tr key={index} className={isLow ? "table-danger" : ""}>
                  <td>{item.itemName}</td>
                  <td>{item.quantity}</td>
                  <td>{item.avgSales}</td>
                  <td>{isNotSelling ? "No Recent Sales" : `${daysLeft} days`}</td>
                  <td>
                    {isNotSelling ? (
                      <span className="badge bg-secondary">No Demand</span>
                    ) : isLow ? (
                      <span className="badge bg-danger">
                        <FaExclamationTriangle className="me-1" /> Refill Soon
                      </span>
                    ) : (
                      <span className="badge bg-success">Healthy</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockPredictionPage;
