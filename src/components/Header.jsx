import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import './Header.css';

const Header = () => {
  const { isAuthenticated, user, isLoading } = useAuth0();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 5C10 5 15 8 20 15C25 8 30 5 30 5C30 5 28 15 25 22C28 25 30 30 30 35C30 35 25 32 20 25C15 32 10 35 10 35C10 30 12 25 15 22C12 15 10 5 10 5Z" fill="#E91E8C"/>
          </svg>
          <span className="logo-text">KENDALL'S NAILS</span>
        </Link>
        <nav className="nav">
          <Link to="/designs" className="nav-link">BROWSE DESIGNS</Link>
          <Link to="/orders" className="nav-link">ORDER STATUS</Link>
          <div className="auth-section">
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <div className="user-info">
                    {user?.picture && (
                      <img src={user.picture} alt={user.name} className="user-avatar" />
                    )}
                    <span className="user-name">{user?.name}</span>
                    <LogoutButton />
                  </div>
                ) : (
                  <LoginButton />
                )}
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
