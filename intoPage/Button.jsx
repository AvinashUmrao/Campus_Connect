import React from 'react';
import PropTypes from 'prop-types';


const Button = ({ label, onClick, type = 'button', disabled = false }) => {
  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled} 
      className="custom-button"
    >
      {label}
    </button>
  );
};

// PropTypes for type checking
Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;