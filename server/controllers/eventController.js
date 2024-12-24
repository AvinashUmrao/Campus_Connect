const { Event, Registration } = require('../models/models');

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ eventDate: 1, eventTime: 1 });
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
};

// Create an event
const createEvent = async (req, res) => {
  try {
    const { eventName, eventDate, eventTime, location, clubName, description } = req.body;

    if (!eventName || !eventDate || !eventTime || !location || !clubName || !description) {
      return res.status(400).json({ 
        message: 'Missing required fields. Please provide eventName, eventDate, eventTime, location, clubName, and description.'
      });
    }

    const newEvent = new Event({
      eventName,
      eventDate,
      eventTime,
      location,
      clubName,
      description
    });

    await newEvent.save();
    res.status(201).json({ 
      message: 'Event created successfully',
      event: newEvent 
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event' });
  }
};

// Get event by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Error fetching event' });
  }
};

// Register for event
const registerForEvent = async (req, res) => {
  const { eventId, userId } = req.body;

  if (!eventId || !userId) {
    return res.status(400).json({ message: 'Event ID and User ID are required.' });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    const existingRegistration = await Registration.findOne({ userId, eventId });
    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this event.' });
    }

    const newRegistration = new Registration({ 
      userId, 
      eventId,
      registeredAt: new Date()
    });
    await newRegistration.save();

    res.status(201).json({ 
      message: 'Successfully registered for event',
      registration: newRegistration
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering for event' });
  }
};

module.exports = { 
  getAllEvents, 
  createEvent, 
  registerForEvent,
  getEventById
};