const mongoose = require('mongoose');

// Users Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now }
});

// Events Schema
const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  eventTime: { type: String, required: true },
  location: { type: String, required: true },
  clubName: { type: String, required: true },
  theme: { type: String },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Registrations Schema
const registrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  registrationDate: { type: Date, default: Date.now }
});

// Admins Schema
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
});

// Create models
const User = mongoose.model('User', userSchema);
const Event = mongoose.model('Event', eventSchema);
const Registration = mongoose.model('Registration', registrationSchema);
const Admin = mongoose.model('Admin', adminSchema);

// Export models
module.exports = { User, Event, Registration, Admin };


// // models.js
// const mongoose = require('mongoose');

// // Users Schema
// const userSchema = new mongoose.Schema({
//   firstName: { type: String, required: true },
//   lastName: { type: String },
//   email: { type: String, required: true, unique: true },
//   passwordHash: { type: String, required: true },
//   registrationDate: { type: Date, default: Date.now }
// });

// // Events Schema
// const eventSchema = new mongoose.Schema({
//   eventName: { type: String, required: true },
//   eventDate: { type: Date, required: true },
//   eventTime: { type: String, required: true },
//   location: { type: String, required: true },
//   clubName: { type: String, required: true },
//   theme: { type: String },
//   description: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now }
// });

// // Registrations Schema
// const registrationSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
//   registrationDate: { type: Date, default: Date.now }
// });

// // Admins Schema
// const adminSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   passwordHash: { type: String, required: true }
// });

// const User = mongoose.model('User', userSchema);
// const Event = mongoose.model('Event', eventSchema);
// const Registration = mongoose.model('Registration', registrationSchema);
// const Admin = mongoose.model('Admin', adminSchema);

// module.exports = { User, Event, Registration, Admin };

// // server.js
// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const rateLimit = require('express-rate-limit');

// const { User, Event, Registration, Admin } = require('./models/models');

// const app = express();
// app.use(express.json());

// // Ensure required environment variables are set
// if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
//   console.error('Missing required environment variables');
//   process.exit(1);
// }

// // Rate limiting
// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: 'Too many requests from this IP, please try again later.',
// });

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

// // Error handling
// process.on('unhandledRejection', (error) => {
//   console.error('Unhandled promise rejection:', error);
//   process.exit(1);
// });

// // JWT token generation
// const generateToken = (userId) => {
//   return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
// };

// // Auth middleware
// const protect = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) {
//     return res.status(401).json({ message: 'No token, authorization denied' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded.id;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

// // Routes
// app.get('/', (req, res) => {
//   res.send('Welcome to the server!');
// });

// // User Registration
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

// // User Login
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

// // Get all events
// app.get('/api/events', async (req, res) => {
//   try {
//     const events = await Event.find().sort({ eventDate: 1, eventTime: 1 });
//     res.status(200).json(events);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error fetching events' });
//   }
// });

// // Create new event
// app.post('/api/events', protect, async (req, res) => {
//   try {
//     const { eventName, eventDate, eventTime, location, clubName, description } = req.body;

//     // Validate all required fields
//     if (!eventName || !eventDate || !eventTime || !location || !clubName || !description) {
//       return res.status(400).json({ 
//         message: 'Missing required fields. Please provide eventName, eventDate, eventTime, location, clubName, and description.'
//       });
//     }

//     // Create new event
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
//     res.status(500).json({ message: 'Server error while creating event' });
//   }
// });

// // Register for event
// app.post('/api/events/register', protect, async (req, res) => {
//   const { eventId } = req.body;

//   if (!eventId) {
//     return res.status(400).json({ message: 'Event ID is required.' });
//   }

//   try {
//     const userId = req.user;

//     const event = await Event.findById(eventId);
//     if (!event) {
//       return res.status(400).json({ message: 'Event not found.' });
//     }

//     const registrationExists = await Registration.findOne({ userId, eventId });
//     if (registrationExists) {
//       return res.status(400).json({ message: 'Already registered for this event.' });
//     }

//     const newRegistration = new Registration({ userId, eventId });
//     await newRegistration.save();

//     res.status(201).json({ message: 'Successfully registered for event.' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error during registration.' });
//   }
// });

// const PORT = process.env.PORT || 5002;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });