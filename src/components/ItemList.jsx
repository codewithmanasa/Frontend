import React from "react";

const ItemList = ({ items, onEdit, onDelete }) => {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>No items yet. Create your first item to get started!</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="items-grid">
      {items.map((item) => (
        <div
          key={item.id}
          className={`item-card ${item.completed ? "completed" : ""}`}
        >
          <div className="item-header">
            <h3>{item.title}</h3>
            <span
              className={`status-badge ${
                item.completed ? "status-completed" : "status-pending"
              }`}
            >
              {item.completed ? "Completed" : "Pending"}
            </span>
          </div>

          {item.description && (
            <p className="item-description">{item.description}</p>
          )}

          <div className="item-meta">
            <span className="item-date">
              Created: {formatDate(item.createdAt)}
            </span>
            {item.updatedAt !== item.createdAt && (
              <span className="item-date">
                Updated: {formatDate(item.updatedAt)}
              </span>
            )}
          </div>

          <div className="item-actions">
            <button
              onClick={() => onEdit(item)}
              className="btn btn-small btn-edit"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="btn btn-small btn-delete"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemList;
