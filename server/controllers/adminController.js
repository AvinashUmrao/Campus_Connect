const Event = require('../models/event');

// Add Event
const addEvent = async (req, res) => {
    const { title, description, date, location } = req.body;
    try {
        const event = await Event.create({ title, description, date, location });
        res.status(201).json({ message: 'Event created successfully', event });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete Event
const deleteEvent = async (req, res) => {
    const { eventId } = req.params;
    try {
        const event = await Event.findByIdAndDelete(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { addEvent, deleteEvent };
