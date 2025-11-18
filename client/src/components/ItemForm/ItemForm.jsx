// src/components/ItemForm/ItemForm.jsx
import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { addItem } from "../../Service/ItemService";
import toast from "react-hot-toast";

const ItemForm = () => {
  const { categories, setItemsData, itemsData, setCategories } = useContext(AppContext);

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    name: "",
    categoryId: "",
    price: "",
    gstRate: "",
    description: "",
    quantity: "",
  });

  // Handle Field Changes
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Submit
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please upload an image");
      return;
    }
    if (!data.categoryId) {
      toast.error("Please select a category");
      return;
    }
    if (!data.price || data.price <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }
    if (!data.gstRate) {
      toast.error("Please enter GST rate");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append(
      "item",
      JSON.stringify({
        ...data,
        price: Number(data.price),
        gstRate: Number(data.gstRate),
        quantity: Number(data.quantity || 0),
      })
    );
    formData.append("file", image);

    try {
      const response = await addItem(formData);

      if (response.status === 201) {
        toast.success("Item Added Successfully");

        // Update item list
        setItemsData([...itemsData, response.data]);

        // Update category item count
        setCategories((prev) =>
          prev.map((cat) =>
            cat.categoryId === data.categoryId
              ? { ...cat, items: cat.items + 1 }
              : cat
          )
        );

        // Reset form
        setData({
          name: "",
          price: "",
          gstRate: "",
          categoryId: "",
          description: "",
          quantity: "",
        });
        setImage(null);
      } else {
        toast.error("Unable to add item");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="item-form-container" style={{ height: "100vh", overflowY: "auto" }}>
      <div className="mx-2 mt-2">
        <div className="row">
          <div className="card col-md-12 form-container">
            <div className="card-body">
              <form onSubmit={onSubmitHandler}>
                
                {/* Image Upload */}
                <div className="mb-3 text-center">
                  <label htmlFor="image" className="form-label">
                    <img
                      src={image ? URL.createObjectURL(image) : assets.upload}
                      alt="upload"
                      width={100}
                      height={100}
                      style={{ cursor: "pointer", objectFit: "cover" }}
                    />
                  </label>
                  <input
                    type="file"
                    id="image"
                    hidden
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </div>

                {/* Name */}
                <div className="mb-3">
                  <label className="form-label">Item Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter item name"
                    value={data.name}
                    required
                    onChange={onChangeHandler}
                  />
                </div>

                {/* Category */}
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    name="categoryId"
                    value={data.categoryId}
                    onChange={onChangeHandler}
                    required
                  >
                    <option value="">-- SELECT CATEGORY --</option>
                    {categories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div className="mb-3">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={data.price}
                    placeholder="₹100"
                    onChange={onChangeHandler}
                    min="0"
                    required
                  />
                </div>

                {/* GST Rate */}
                <div className="mb-3">
                  <label className="form-label">GST Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    name="gstRate"
                    value={data.gstRate}
                    placeholder="e.g., 5"
                    onChange={onChangeHandler}
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="4"
                    value={data.description}
                    placeholder="Enter item details"
                    onChange={onChangeHandler}
                  />
                </div>

                {/* Quantity */}
                <div className="mb-3">
                  <label className="form-label">Initial Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    name="quantity"
                    value={data.quantity}
                    placeholder="e.g., 10"
                    onChange={onChangeHandler}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-warning w-100"
                >
                  {loading ? "Saving..." : "Save Item"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemForm;
