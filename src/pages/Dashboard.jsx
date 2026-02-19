import React, { useState, useEffect } from "react";
import { useAuth } from "../context/Authcontext.jsx";
import { itemsAPI } from "../services/Api.jsx";
import ItemForm from "../components/ItemForm.jsx";
import ItemList from "../components/ItemList.jsx";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await itemsAPI.getAll();
      setItems(response.data);
      setError("");
    } catch (err) {
      setError("Failed to load items");
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    try {
      const response = await itemsAPI.create(formData);
      setItems([response.data, ...items]);
      setShowForm(false);
      setError("");
    } catch (err) {
      setError("Failed to create item");
      console.error("Error creating item:", err);
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      const response = await itemsAPI.update(id, formData);
      setItems(items.map((item) => (item.id === id ? response.data : item)));
      setEditingItem(null);
      setError("");
    } catch (err) {
      setError("Failed to update item");
      console.error("Error updating item:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await itemsAPI.delete(id);
        setItems(items.filter((item) => item.id !== id));
        setError("");
      } catch (err) {
        setError("Failed to delete item");
        console.error("Error deleting item:", err);
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, {user?.username}!</p>
          </div>
          <button onClick={logout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {error && <div className="error-message">{error}</div>}

        <div className="dashboard-actions">
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
          >
            {showForm ? "Cancel" : "+ Add New Item"}
          </button>
        </div>

        {showForm && (
          <ItemForm
            item={editingItem}
            onSubmit={
              editingItem
                ? (data) => handleUpdate(editingItem.id, data)
                : handleCreate
            }
            onCancel={handleCancel}
          />
        )}

        {loading ? (
          <div className="loading">Loading items...</div>
        ) : (
          <ItemList items={items} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
