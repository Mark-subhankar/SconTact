const mongoose = require("mongoose");
const joi = require("joi");

// Creating contact Schema
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    dob: {
        type: Date, // Define dob as a Date type
    },
    address: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: Number,
        required: [true, "Phone number is required"]
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
});

// Creating model 
const Contact = mongoose.model("Contact", contactSchema);

// Contact data validate 
const validateContact = (data) => {
    const schema = joi.object({
        name: joi.string().min(4).max(50).required(),
        dob: joi.date().allow(''), // Add validation for dob as a date
        address: joi.string().min(4).max(100).allow(''),
        email: joi.string().email().allow(''),
        phone: joi.number().integer().min(1000000000).max(9999999999).required()
    });
    return schema.validate(data);
}

module.exports = { Contact, validateContact };