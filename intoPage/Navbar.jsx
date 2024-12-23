import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item"><a href="#about">About Us</a></li>
        <li className="navbar-item"><a href="#signin">Sign In</a></li>
        <li className="navbar-item"><a href="#signup">Sign Up</a></li>
      </ul>
    </nav>
  );
};

export default Navbar; // Export the Navbar component