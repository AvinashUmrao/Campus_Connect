const express = require('express');
const { 
    getAllEvents, 
    createEvent, 
    registerForEvent,
    getEventById 
} = require('../controllers/eventController');
const router = express.Router();

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post('/create', createEvent);
router.post('/register', registerForEvent);

module.exports = router;