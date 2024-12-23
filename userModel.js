const mongoose = require('mongoose');
const schema = mongoose.Schema;

// Check if the model is already defined to avoid overwriting it
const userSchema = new schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        min: 6,
        max: 255,
    },

    password: {
        type: String,
        min: 6,
        max: 1024,
    },
});

// Check if the model is already compiled
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
