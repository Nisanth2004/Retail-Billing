import React, { useState } from "react";
import toast from "react-hot-toast";
import { updateItemStock } from "../../Service/ItemService";

const UpdateStock = ({ itemId }) => {
  const [quantity, setQuantity] = useState("");

  const handleSubmit = async () => {
    try {
      await updateItemStock(itemId, quantity);
      toast.success("Stock updated successfully!");
      setQuantity("");
    } catch (err) {
      toast.error("Failed to update stock.");
    }
  };

  return (
    <div className="input-group">
      <input
        type="number"
        className="form-control"
        placeholder="Add stock"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <button className="btn btn-warning" onClick={handleSubmit}>
        Add
      </button>
    </div>
  );
};

export default UpdateStock;
