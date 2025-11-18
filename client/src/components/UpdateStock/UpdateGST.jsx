import React, { useState } from "react";
import toast from "react-hot-toast";
import { updateItemGst } from "../../Service/ItemService";

const UpdateGST = ({ item }) => {
  const [gst, setGst] = useState(item.gstRate || "");
  const [loading, setLoading] = useState(false);

  const handleGstUpdate = async () => {
    if (!gst || gst < 0) {
      toast.error("Invalid GST value");
      return;
    }

    setLoading(true);

    try {
      await updateItemGst(item.itemId, gst);
      toast.success("GST updated!");

    } catch (err) {
      toast.error("Failed to update GST");
    }

    setLoading(false);
  };

  return (
    <div className="mt-3 border-top pt-3">
      <p className="text-info fw-bold small">GST Rate</p>

      <div className="input-group input-group-sm">
        <input
          type="number"
          className="form-control bg-dark text-light border-info"
          placeholder="GST %"
          value={gst}
          onChange={(e) => setGst(e.target.value)}
        />

        <button
          className="btn btn-info btn-sm"
          onClick={handleGstUpdate}
          disabled={loading}
        >
          {loading ? "Updating..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default UpdateGST;
