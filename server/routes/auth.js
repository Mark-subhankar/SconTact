const router = require("express").Router();
const bcrypt = require("bcrypt");
const user = require("../model/user");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/authorization");



// email checking 
const emailReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Login Route 
router.post("/login", async(req, res) => {
    const { email, password } = req.body;

    try {
        // Check email is exist or not 
        const userExist = await user.findOne({ email });

        if (!userExist) {
            return res.status(400).json({ error: `Invalid email or password` });
        }

        // Compare betweeen plain text password v/s user password 
        const doesPasswordMatch = await bcrypt.compare(password, userExist.password);

        if (!doesPasswordMatch) {
            return res.status(400).json({ error: `Invalid email or password` });
        }

        // Token Generate 
        const payload = { _id: userExist._id };
        const token = jwt.sign(payload, "he@dfgeh!12&gsddf", { expiresIn: "1h" });

        const userSend = {...userExist._doc, password: undefined };
        return res.status(200).json({ token, userSend });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err.message,
        });
    }
});


// Register Route
router.post("/register", async(req, res) => {

    // Distructuring of name , email , password 
    const { name, email, password } = req.body;

    // Check all the missing fields 
    if (!name || !email || !password) {
        return res.status(400).json({ error: `plaese enter the all required field` });
    }

    //Name validation 
    if (name.length > 30) {
        return res.status(400).json({ error: "name can only less than 30 char" })
    }

    // Email validation 
    if (!emailReg.test(email)) {
        return res.status(400).json({ error: "please enter a valid email address" })
    }

    // password validation 
    if (password.length <= 6) {
        return res.status(400).json({ error: "password must be 6 characters long" });
    }

    try {
        // User exist check in database 
        const existuser = await user.findOne({ email });

        if (existuser) {
            return res.status(400).json({ error: `Email is already exists ` })
        }
        // create password Hash
        const hashPassword = await bcrypt.hash(password, 12);

        // create model
        const newUser = new user({ name, email, password: hashPassword })

        // save the user
        const result = await newUser.save();

        //if we don't want to show password during api testing 
        result._doc.password = undefined;

        //send all data as a json
        return res.status(201).json({...result._doc })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err.message
        });
    }
})

router.get("/me", auth, async(req, res) => {
    return res.status(200).json({...req.user._doc });
})

// Exports all router
module.exports = router;