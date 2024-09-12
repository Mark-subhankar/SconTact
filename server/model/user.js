const mongoose = require("mongoose");

// Creating user Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"]
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    // profileImage: String
});

// Create model 
const User = mongoose.model("User", userSchema);

// Export this model
module.exports = User;