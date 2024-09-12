const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/db");
const auth = require("./middlewares/authorization");


const app = express();

//middlewares
app.use(express.json()); // we can send as a json format
app.use(morgan("tiny")); //  It simplifies the process of logging requests to your application
app.use(require('cors')()); // enables secure communication

// authorization Routes
app.get("/protected", auth, (req, res) => {
    return res.status(200).json({ user: req.user });
})

// route Reutes
app.use("/api/", require("./routes/auth"));
app.use("/api/", require("./routes/contactUser"));


const PORT = process.env.PORT || 8000;

app.listen(PORT, async() => {
    try {
        // Here use mongodb database
        await connectDB();
        console.log(`server listening on port:${PORT}`);
    } catch (error) {
        console.log(error);
    }
})