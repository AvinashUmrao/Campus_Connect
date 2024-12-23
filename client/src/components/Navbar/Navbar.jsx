import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item"><Link to='/about'>About Us</Link></li>
        <li className="navbar-item"><Link to="/signin">Sign In</Link></li>
        <li className="navbar-item"><Link to="/signup">Sign Up</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar; // Export the Navbar component