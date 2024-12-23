const User = require('../models/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Ensure email is unique
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: "Registration successful" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({
            token,
            user: { id: user._id, name: user.firstName + ' ' + user.lastName, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Register (Alternative)
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const user = new User({ firstName, lastName, email, password });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { registerUser, loginUser, register };
