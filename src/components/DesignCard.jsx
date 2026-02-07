import React from 'react';
import './DesignCard.css';

function DesignCard({ design }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="design-card">
      <div className="design-card-image">
        <img
          src={design.image_url || `https://via.placeholder.com/400x300/E91E8C/FFFFFF?text=Nail+Design`}
          alt={design.description}
        />
      </div>
      <div className="design-card-content">
        <p className="design-card-description">{design.description}</p>
        <div className="design-card-meta">
          <span className="design-card-date">
            {formatDate(design.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default DesignCard;
