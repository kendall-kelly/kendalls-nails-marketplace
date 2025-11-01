import React, { useState, useEffect } from 'react';
import DesignCard from '../components/DesignCard';
import './BrowseDesigns.css';

function BrowseDesigns() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:8080/api/v1/design-submissions');

      if (!response.ok) {
        throw new Error(`Failed to fetch designs: ${response.status}`);
      }

      const data = await response.json();
      setDesigns(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching designs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="browse-designs">
      <div className="browse-designs-header">
        <h1>Browse Nail Designs</h1>
        <p>Explore creative nail designs submitted by our community</p>
      </div>

      {loading && (
        <div className="browse-designs-loading">
          <div className="spinner"></div>
          <p>Loading designs...</p>
        </div>
      )}

      {error && (
        <div className="browse-designs-error">
          <p>Error: {error}</p>
          <button onClick={fetchDesigns} className="retry-button">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && designs.length === 0 && (
        <div className="browse-designs-empty">
          <p>No designs found. Be the first to submit a design!</p>
        </div>
      )}

      {!loading && !error && designs.length > 0 && (
        <div className="designs-grid">
          {designs.map((design) => (
            <DesignCard key={design.id} design={design} />
          ))}
        </div>
      )}
    </div>
  );
}

export default BrowseDesigns;
