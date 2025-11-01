import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/api';
import './CreateOrder.css';

function CreateOrder() {
  const { isAuthenticated, loginWithRedirect, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    description: '',
    quantity: 10,
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value, 10) : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Validate file type
      if (file.type !== 'image/png') {
        setError('Only PNG files are allowed');
        return;
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        setError('File size exceeds maximum allowed size of 10 MB');
        return;
      }

      setError(null);
      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: 'https://nails-api.kendall-kelly.com/',
        },
      });

      await createOrder(accessToken, formData);
      setSuccess(true);

      // Reset form
      setFormData({
        description: '',
        quantity: 10,
        image: null
      });
      setImagePreview(null);

      // Show success message for 2 seconds, then navigate to home
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="create-order-container">
        <div className="auth-prompt">
          <h2>Sign in to create an order</h2>
          <p>You need to be signed in to place a custom nail order.</p>
          <button onClick={loginWithRedirect} className="login-button">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="create-order-container">
      <div className="create-order-content">
        <h1>Create Your Custom Order</h1>
        <p className="subtitle">Tell us about your dream nail design</p>

        {success && (
          <div className="success-message">
            Order created successfully! Redirecting...
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="order-form">
          <div className="form-group">
            <label htmlFor="description">
              Design Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your custom nail design in detail (e.g., colors, patterns, themes, special elements)"
              required
              rows={6}
              disabled={isSubmitting}
            />
            <small className="help-text">
              Be as specific as possible to help us bring your vision to life
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="quantity">
              Quantity (sets of nails) *
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              required
              disabled={isSubmitting}
            />
            <small className="help-text">
              How many sets of nails would you like?
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="image">
              Design Image (optional)
            </label>
            {imagePreview ? (
              <div className="image-preview-container">
                <img src={imagePreview} alt="Design preview" className="image-preview" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="remove-image-button"
                  disabled={isSubmitting}
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <input
                type="file"
                id="image"
                name="image"
                accept=".png"
                onChange={handleImageChange}
                disabled={isSubmitting}
              />
            )}
            <small className="help-text">
              Upload a PNG image of your desired design (max 10MB)
            </small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="cancel-button"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateOrder;
