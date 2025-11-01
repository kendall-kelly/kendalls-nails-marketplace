import React from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../../example1.png';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/create-order');
  };

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Design your own custom nails
          </h1>
          <button className="cta-button" onClick={handleGetStarted}>
            GET STARTED
          </button>
        </div>
        <div className="hero-image">
          <img
            src={heroImage}
            alt="Custom nail design with butterfly and moon patterns"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
