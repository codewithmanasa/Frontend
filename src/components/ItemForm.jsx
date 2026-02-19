import React, { useState, useEffect } from "react";

const ItemForm = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    completed: false,
  });

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description || "",
        completed: item.completed,
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!item) {
      setFormData({ title: "", description: "", completed: false });
    }
  };

  return (
    <div className="item-form-container">
      <form onSubmit={handleSubmit} className="item-form">
        <h3>{item ? "Edit Item" : "Create New Item"}</h3>

        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength="100"
            placeholder="Enter item title"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            maxLength="500"
            rows="4"
            placeholder="Enter item description (optional)"
            className="form-input"
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="completed"
              checked={formData.completed}
              onChange={handleChange}
            />
            <span>Mark as completed</span>
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {item ? "Update" : "Create"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemForm;
