const mongoose = require("mongoose");

// Established MongoDb atlas database connection 
const connectDB = async() => {
    return mongoose
        .connect(`mongodb+srv://subhankardas7044444:mynotes@cluster0.b30g7kp.mongodb.net/contact-management-system`).then(() => console.log("Database connection Successfully")).catch(() => console.log("Connection established failed"))
}

//export connectDB arrow function 
module.exports = connectDB;