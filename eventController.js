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

    // Validate all required fields
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

// Enhanced registerForEvent with additional checks
const registerForEvent = async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user;

  if (!eventId) {
    return res.status(400).json({ message: 'Event ID is required.' });
  }

  try {
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Add check for past events
    const eventDate = new Date(`${event.eventDate}T${event.eventTime}`);
    if (eventDate < new Date()) {
      return res.status(400).json({ message: 'Cannot register for past events.' });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({ userId, eventId });
    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this event.' });
    }

    // Create new registration with timestamp
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

// Get user's registered events
const getUserEvents = async (req, res) => {
  try {
    const userId = req.user;
    const registrations = await Registration.find({ userId })
      .populate('eventId');
    
    res.status(200).json(registrations);
  } catch (error) {
    console.error('Error fetching user events:', error);
    res.status(500).json({ message: 'Error fetching user events' });
  }
};

// Update event details
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Error updating event' });
  }
};

module.exports = { 
  getAllEvents, 
  createEvent, 
  registerForEvent,
  getEventById,
  getUserEvents,
  updateEvent
};

// // controllers/eventController.js
// const { Event, Registration } = require('../models/models');

// // Get all events
// const getAllEvents = async (req, res) => {
//   try {
//     const events = await Event.find().sort({ eventDate: 1, eventTime: 1 });
//     res.status(200).json(events);
//   } catch (error) {
//     console.error('Error fetching events:', error);
//     res.status(500).json({ message: 'Error fetching events' });
//   }
// };

// // Create an event
// const createEvent = async (req, res) => {
//   try {
//     const { eventName, eventDate, eventTime, location, clubName, description } = req.body;

//     // Validate all required fields
//     if (!eventName || !eventDate || !eventTime || !location || !clubName || !description) {
//       return res.status(400).json({ 
//         message: 'Missing required fields. Please provide eventName, eventDate, eventTime, location, clubName, and description.'
//       });
//     }

//     const newEvent = new Event({
//       eventName,
//       eventDate,
//       eventTime,
//       location,
//       clubName,
//       description
//     });

//     await newEvent.save();
//     res.status(201).json({ 
//       message: 'Event created successfully',
//       event: newEvent 
//     });
//   } catch (error) {
//     console.error('Error creating event:', error);
//     res.status(500).json({ message: 'Error creating event' });
//   }
// };

// // Register for event
// const registerForEvent = async (req, res) => {
//   const { eventId } = req.body;
//   const userId = req.user; // Getting userId from auth middleware

//   if (!eventId) {
//     return res.status(400).json({ message: 'Event ID is required.' });
//   }

//   try {
//     // Check if event exists
//     const event = await Event.findById(eventId);
//     if (!event) {
//       return res.status(404).json({ message: 'Event not found.' });
//     }

//     // Check if already registered
//     const existingRegistration = await Registration.findOne({ userId, eventId });
//     if (existingRegistration) {
//       return res.status(400).json({ message: 'Already registered for this event.' });
//     }

//     // Create new registration
//     const newRegistration = new Registration({ userId, eventId });
//     await newRegistration.save();

//     res.status(201).json({ 
//       message: 'Successfully registered for event',
//       registration: newRegistration
//     });
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ message: 'Error registering for event' });
//   }
// };

// // Get event by ID
// const getEventById = async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);
//     if (!event) {
//       return res.status(404).json({ message: 'Event not found' });
//     }
//     res.status(200).json(event);
//   } catch (error) {
//     console.error('Error fetching event:', error);
//     res.status(500).json({ message: 'Error fetching event' });
//   }
// };

// module.exports = { 
//   getAllEvents, 
//   createEvent, 
//   registerForEvent,
//   getEventById
// };

// // routes/eventRoutes.js
// const express = require('express');
// const { 
//   getAllEvents, 
//   createEvent, 
//   registerForEvent,
//   getEventById 
// } = require('../controllers/eventController');
// const { protect } = require('../middleware/authMiddleware');
// const router = express.Router();

// // Public routes
// router.get('/', getAllEvents);
// router.get('/:id', getEventById);

// // Protected routes (require authentication)
// router.post('/', protect, createEvent);
// router.post('/register', protect, registerForEvent);

// module.exports = router;    



// const { Event } = require('../models/models'); // Ensure correct import

// // Get all events
// const getAllEvents = async (req, res) => {
//   try {
//     const events = await Event.find();
//     res.status(200).json(events);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error fetching events' });
//   }
// };

// // Create an event
// const createEvent = async (req, res) => {
//   const { name, date, location, description } = req.body;
//   try {
//     const newEvent = new Event({ name, date, location, description });
//     await newEvent.save();
//     res.status(201).json({ message: 'Event created successfully', event: newEvent });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error creating event' });
//   }
// };

// module.exports = { getAllEvents, createEvent };




// // const Event = require('../models/event');
// // const Registration = require('../models/registration'); // Assuming there's a Registration model

// // // Get All Events
// // const getAllEvents = async (req, res) => {
// //     try {
// //         const events = await Event.find();
// //         res.status(200).json(events);
// //     } catch (err) {
// //         res.status(500).json({ error: err.message });
// //     }
// // };

// // // Create a New Event
// // const createEvent = async (req, res) => {
// //     const { name, date, location, description } = req.body;

// //     // Validate input
// //     if (!name || !date || !location || !description) {
// //         return res.status(400).json({ message: 'All fields are required.' });
// //     }

// //     try {
// //         // Create a new event
// //         const newEvent = new Event({ name, date, location, description });
// //         await newEvent.save();

// //         res.status(201).json({ message: 'Event created successfully', event: newEvent });
// //     } catch (err) {
// //         res.status(500).json({ error: err.message });
// //     }
// // };

// // // Register for Event
// // const registerForEvent = async (req, res) => {
// //     const { userId, eventId } = req.body;

// //     // Validate input
// //     if (!userId || !eventId) {
// //         return res.status(400).json({ message: 'User ID and Event ID are required.' });
// //     }

// //     try {
// //         // Check if the event exists
// //         const event = await Event.findById(eventId);
// //         if (!event) {
// //             return res.status(404).json({ message: 'Event not found.' });
// //         }

// //         // Check if the user is already registered
// //         const registrationExists = await Registration.findOne({ userId, eventId });
// //         if (registrationExists) {
// //             return res.status(400).json({ message: 'User is already registered for this event.' });
// //         }

// //         // Register the user for the event
// //         const newRegistration = new Registration({ userId, eventId });
// //         await newRegistration.save();

// //         res.status(201).json({ message: 'Registration successful', registration: newRegistration });
// //     } catch (err) {
// //         res.status(500).json({ error: err.message });
// //     }
// // };

// // module.exports = { getAllEvents, createEvent, registerForEvent };
