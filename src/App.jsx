import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import BrowseDesigns from './pages/BrowseDesigns';
import CreateOrder from './pages/CreateOrder';
import Orders from './pages/Orders';
import { useUserSync } from './hooks/useUserSync';
import './App.css';

function App() {
  // Automatically sync user with API after Auth0 login
  const { error } = useUserSync();

  // Optional: Log sync errors (you can also display this to the user)
  if (error) {
    console.error('User sync error:', error);
  }

  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/designs" element={<BrowseDesigns />} />
            <Route path="/create-order" element={<CreateOrder />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
