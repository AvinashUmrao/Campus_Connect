import React from 'react'; // Import React
import Button from './Button.jsx'; // Correctly import the Button component
import Navbar from './Navbar.jsx'; // Correctly import the Navbar component
import TypingEffect from './typingEffect.jsx';
import './App.css';



const App = () => {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <div className="app-container"> {/* Apply the CSS class here */}
      <Navbar /> 
      <TypingEffect /> {/* Use the TypingEffect component */}
      
      <Button label="Sign Up" onClick={handleClick} /> {/* Use the Button component */}
    </div>
  );
};



export default App;