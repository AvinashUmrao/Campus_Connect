require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

// Import models from separate file
const { User, Event, Registration, Admin } = require('./models/models');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});


// In server.js
const eventRoutes = require('./routes/eventRoutes');
app.use('/api/events', eventRoutes);  

// Ensure required environment variables are set
if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/login', apiLimiter);
app.use('/api/register', apiLimiter);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected!'))
  .catch(err => {
    console.error('MongoDB connection failed', err);
    process.exit(1);
  });

// JWT token generation
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Auth middleware
const protect = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});

// User Registration
app.post('/api/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName, lastName, email, passwordHash: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user._id);
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
});

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ eventDate: 1, eventTime: 1 });
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// Create new event
app.post('/api/events', protect, async (req, res) => {
  try {
    const { eventName, eventDate, eventTime, location, clubName, description } = req.body;

    // Validate all required fields
    if (!eventName || !eventDate || !eventTime || !location || !clubName || !description) {
      return res.status(400).json({ 
        message: 'Missing required fields. Please provide eventName, eventDate, eventTime, location, clubName, and description.'
      });
    }

    // Create new event
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
    res.status(500).json({ message: 'Server error while creating event' });
  }
});

// Register for event
app.post('/api/events/register', protect, async (req, res) => {
  const { eventId } = req.body;

  if (!eventId) {
    return res.status(400).json({ message: 'Event ID is required.' });
  }

  try {
    const userId = req.user;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(400).json({ message: 'Event not found.' });
    }

    const registrationExists = await Registration.findOne({ userId, eventId });
    if (registrationExists) {
      return res.status(400).json({ message: 'Already registered for this event.' });
    }

    const newRegistration = new Registration({ userId, eventId });
    await newRegistration.save();

    res.status(201).json({ message: 'Successfully registered for event.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




// // Import required packages
// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const rateLimit = require('express-rate-limit');

// // Import models
// const { User, Event, Registration, Admin } = require('./models/models'); // Updated to include Admin

// // Initialize Express app
// const app = express();
// app.use(express.json());

// // Ensure required environment variables are set
// if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
//   console.error('Missing required environment variables');
//   process.exit(1);
// }

// // Rate limiting (optional, but useful for security)
// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per window
//   message: 'Too many requests from this IP, please try again later.',
// });

// // Apply rate limiting to specific routes
// app.use('/api/login', apiLimiter);
// app.use('/api/register', apiLimiter);

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('MongoDB connected!'))
//   .catch(err => {
//     console.error('MongoDB connection failed', err);
//     process.exit(1);
//   });

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (error) => {
//   console.error('Unhandled promise rejection:', error);
//   process.exit(1);
// });

// // Helper function to generate JWT token
// const generateToken = (userId) => {
//   return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
// };

// // Middleware to protect routes requiring authentication
// const protect = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) {
//     return res.status(401).json({ message: 'No token, authorization denied' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded.id; // Set the user ID to request object
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

// // Root route to avoid "Cannot GET /" error
// app.get('/', (req, res) => {
//   res.send('Welcome to the server!');
// });

// // User Registration (POST /api/register)
// app.post('/api/register', async (req, res) => {
//   const { firstName, lastName, email, password } = req.body;
//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email already in use' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ firstName, lastName, email, passwordHash: hashedPassword });
//     await newUser.save();

//     res.status(201).json({ message: 'User created successfully' });
//   } catch (error) {
//     console.error('Error during registration:', error);
//     res.status(500).json({ message: 'Server error, please try again later.' });
//   }
// });

// // User Login (POST /api/login)
// app.post('/api/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required.' });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'User not found.' });
//     }

//     const isMatch = await bcrypt.compare(password, user.passwordHash);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials.' });
//     }

//     const token = generateToken(user._id);
//     res.status(200).json({ token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error, please try again later.' });
//   }
// });

// // Fetch Events (GET /api/events)
// app.get('/api/events', async (req, res) => {
//   try {
//     const events = await Event.find();
//     res.status(200).json(events);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error fetching events, please try again later.' });
//   }
// });

// // Create a New Event (POST /api/events)
// app.post('/api/events', protect, async (req, res) => {
//   const { name, date, location, description } = req.body;

//   // Validate input
//   if (!name || !date || !location || !description) {
//     return res.status(400).json({ message: 'All fields (name, date, location, description) are required.' });
//   }

//   try {
//     // Create and save the event
//     const newEvent = new Event({ name, date, location, description });
//     await newEvent.save();

//     res.status(201).json({ message: 'Event created successfully', event: newEvent });
//   } catch (error) {
//     console.error('Error creating event:', error);
//     res.status(500).json({ message: 'Server error, please try again later.' });
//   }
// });

// // Event Registration (POST /api/events/register)
// app.post('/api/events/register', protect, async (req, res) => {
//   const { eventId } = req.body;

//   if (!eventId) {
//     return res.status(400).json({ message: 'Event ID is required.' });
//   }

//   try {
//     const userId = req.user; // User ID from protect middleware

//     const event = await Event.findById(eventId);
//     if (!event) {
//       return res.status(400).json({ message: 'Event not found.' });
//     }

//     const registrationExists = await Registration.findOne({ userId, eventId });
//     if (registrationExists) {
//       return res.status(400).json({ message: 'User already registered for this event.' });
//     }

//     const newRegistration = new Registration({ userId, eventId });
//     await newRegistration.save();

//     res.status(201).json({ message: 'User successfully registered for the event.' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error, please try again later.' });
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 5002;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


