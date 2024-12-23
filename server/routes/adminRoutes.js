const express = require('express');
const { addEvent, deleteEvent } = require('../controllers/adminController');
const router = express.Router();

router.post('/add-event', addEvent);
router.delete('/delete-event/:eventId', deleteEvent);

module.exports = router;
