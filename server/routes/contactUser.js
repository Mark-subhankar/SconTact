const { validateContact, Contact } = require("../model/contact");
const auth = require("../middlewares/authorization");
const mongoose = require("mongoose");
const router = require("express").Router();

// create contact ===========================================================================================>
router.post("/contact", auth, async(req, res) => {
    const { error } = validateContact(req.body);

    // if there is error for validation then send it 
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    // retrive data from body in the field 
    const { name, dob, address, email, phone } = req.body;

    // createting model
    try {
        const newContact = new Contact({
            name,
            dob,
            address, // Allow empty strings
            email, // Allow empty strings
            phone,
            postedBy: req.user._id,
        });

        // save this model 
        const result = await newContact.save();

        // then send response 
        return res.status(201).json({...result._doc });
    } catch (err) {
        // if any error to try block
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// fetch contact ===========================================================================================>
router.get("/mycontacts", auth, async(req, res) => {
    try {
        // find by contact data on the basis of there user _id
        const myContacts = await Contact.find({ postedBy: req.user._id }).populate(
            "postedBy",
            "-password"
        );

        // after received then send contact data in reverse order
        return res.status(200).json({ contacts: myContacts.reverse() });
    } catch (err) {
        // if any error to try block
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});


// delete contacts data One by One  ===========================================================================================>
router.delete("/delete/:id", auth, async(req, res) => {
    // retrive contact id to the url
    const { id } = req.params;

    // check if there is no contact id 
    if (!id) return res.status(400).json({ error: "no id specified." });

    // check if id is not valid 
    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ error: "please enter a valid id" });
    try {
        // Then find contact id 
        const contact = await Contact.findOne({ _id: id });

        // if don't find a contact id
        if (!contact) return res.status(400).json({ error: "no contact found" });

        //  check if user id not match by  postedBy._id
        if (req.user._id.toString() !== contact.postedBy._id.toString())
            return res
                .status(401)
                .json({ error: "you can't delete other people contacts!" });

        // delete contact data on basis of there contact id 
        const result = await Contact.deleteOne({ _id: id });

        //  find all contacts where the postedBy field matches the current user's _id
        const myContacts = await Contact.find({ postedBy: req.user._id }).populate(
            "postedBy",
            "-password"
        );

        // then send the response 
        return res
            .status(200)
            .json({...contact._doc, myContacts: myContacts.reverse() });
    } catch (err) {
        // if there try block any error
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});


// Delete all contacts
router.delete("/deleteAll", auth, async(req, res) => {
    try {
        // Find all contacts posted by the current user
        const contacts = await Contact.find({ postedBy: req.user._id });

        // if there is no contacts data
        if (!contacts) {
            return res.status(400).json({ error: "There is no contacts Exist" });
        }

        // Delete all contacts
        await Contact.deleteMany({ postedBy: req.user._id });

        // Send success response
        return res.status(200).json({ message: "All contacts deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});



// Update contact ===========================================================================================>
router.put("/contact/:id", auth, async(req, res) => {
    const contactId = req.params.id;

    // Check if contact id is valid
    if (!mongoose.isValidObjectId(contactId)) {
        return res.status(400).json({ error: "Please enter a valid id" });
    }

    try {
        // Find the contact by id
        let contact = await Contact.findById(contactId);

        // Check if contact exists
        if (!contact) {
            return res.status(404).json({ error: "Contact not found" });
        }

        // Check if the user is authorized to update the contact
        if (req.user._id.toString() !== contact.postedBy.toString()) {
            return res.status(401).json({ error: "You are not authorized to update this contact" });
        }

        // Update contact with new data
        contact = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

        // Send updated contact data as response
        return res.status(200).json(contact);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Exports router
module.exports = router;