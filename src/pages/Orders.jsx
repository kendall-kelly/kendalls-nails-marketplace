import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getOrders, getImageUrl } from '../services/api';
import './Orders.css';

const STATUS_ORDER = {
  submitted: 1,
  accepted: 2,
  rejected: 3,
  in_production: 4,
  shipped: 5,
  delivered: 6,
};

const STATUS_LABELS = {
  submitted: 'Submitted',
  accepted: 'Accepted',
  rejected: 'Rejected',
  in_production: 'In Production',
  shipped: 'Shipped',
  delivered: 'Delivered',
};

const STATUS_COLORS = {
  submitted: 'status-submitted',
  accepted: 'status-accepted',
  rejected: 'status-rejected',
  in_production: 'status-in-production',
  shipped: 'status-shipped',
  delivered: 'status-delivered',
};

function Orders() {
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: 'https://nails-api.kendall-kelly.com/',
        },
      });

      const result = await getOrders(accessToken, { page, limit: 10 });

      // Sort orders by status and then by created_at (newest first)
      const sortedOrders = result.data.sort((a, b) => {
        const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
        if (statusDiff !== 0) return statusDiff;
        return new Date(b.created_at) - new Date(a.created_at);
      });

      setOrders(sortedOrders);
      setPagination(result.pagination);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders(currentPage);
    }
  }, [isAuthenticated, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <h1>My Orders</h1>
          <div className="auth-message">
            <p>Please log in to view your orders.</p>
            <button onClick={() => loginWithRedirect()} className="btn-primary">
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <h1>My Orders</h1>
          <div className="loading">Loading your orders...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <h1>My Orders</h1>
          <div className="error-message">
            <p>Error: {error}</p>
            <button onClick={() => fetchOrders(currentPage)} className="btn-secondary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1>My Orders</h1>

        {orders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
            <a href="/create-order" className="btn-primary">
              Create Your First Order
            </a>
          </div>
        ) : (
          <>
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-id-date">
                      <h2>Order #{order.id}</h2>
                      <p className="order-date">{formatDate(order.created_at)}</p>
                    </div>
                    <span className={`status-badge ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>

                  <div className="order-body">
                    {order.image_path && (
                      <div className="order-image-container">
                        <img
                          src={getImageUrl(order.image_path)}
                          alt="Order design"
                          className="order-image"
                        />
                      </div>
                    )}

                    <div className="order-detail">
                      <span className="detail-label">Description:</span>
                      <p className="detail-value">{order.description}</p>
                    </div>

                    <div className="order-details-row">
                      <div className="order-detail">
                        <span className="detail-label">Quantity:</span>
                        <span className="detail-value">{order.quantity}</span>
                      </div>

                      {order.price && (
                        <div className="order-detail">
                          <span className="detail-label">Price:</span>
                          <span className="detail-value">${order.price.toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    {order.technician && (
                      <div className="order-detail">
                        <span className="detail-label">Technician:</span>
                        <span className="detail-value">{order.technician.name}</span>
                      </div>
                    )}

                    {order.updated_at !== order.created_at && (
                      <div className="order-detail">
                        <span className="detail-label">Last Updated:</span>
                        <span className="detail-value">{formatDate(order.updated_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn-pagination"
                >
                  Previous
                </button>

                <span className="page-info">
                  Page {pagination.page} of {pagination.totalPages}
                  {' '}({pagination.total} total orders)
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="btn-pagination"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Orders;
