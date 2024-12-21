const mongoose = require('mongoose');
const schema = mongoose.Schema;


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


module.exports = mongoose.model('User', userSchema);
