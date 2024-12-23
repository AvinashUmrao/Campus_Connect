const express = require('express');
const { 
    getAllEvents, 
    createEvent, 
    registerForEvent,
    getEventById 
} = require('../controllers/eventController'); // Ensure the functions are exported correctly
const { isClient } = require('../middleware');  // Ensure correct import from middleware
const router = express.Router();

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Protected routes (require authentication)
router.post('/create', isClient, createEvent);  // Using 'isClient' as protect
router.post('/register', isClient, registerForEvent);

module.exports = router;


// const express = require('express');
    // const { getAllEvents, registerForEvent, createEvent } = require('../controllers/eventController'); // Import createEvent function
    // const router = express.Router();

    // router.get('/', getAllEvents); // Fetch all events
    // router.post('/register', registerForEvent); // Register for an event
    // router.post('/create', createEvent); // Create a new event

    // module.exports = router;
