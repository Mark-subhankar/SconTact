const jwt = require("jsonwebtoken");
const user = require("../model/user");

module.exports = async(req, res, next) => {
    // Import token from header
    const authHeader = req.header("authorization");

    if (authHeader) {
        // Split & grab the token like - ["Bearer","dcwicgwweb$#vjhcgdcbhc"]
        const token = authHeader.split(" ")[1];

        // Verify the token
        jwt.verify(token, "he@dfgeh!12&gsddf", async(err, payload) => {

            if (err) {
                return res.status(401).json({ error: "Unauthorized User" });
            }
            try {

                // Find the user on the basic of there _id 
                const nUser = await user.findOne({ _id: payload._id }).select("-password");

                req.user = nUser; // Set the user object in the request for further use

                next(); // Call next middleware

            } catch (error) {
                console.log(error);
            }
        });
    } else {
        return res.status(403).json({ error: "Forbidden" });
    }
};