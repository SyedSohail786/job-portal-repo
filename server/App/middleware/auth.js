// middleware/verifyToken.js
const jwt = require("jsonwebtoken");
require("dotenv").config()

module.exports = (req, res, next) => {
     const authHeader = req.headers.authorization;
     if (!authHeader) {
          return res.status(401).json({ status: false, msg: "No token provided" });
     }

     const token = authHeader.split(" ")[1];

     try {
          const decoded = jwt.verify(token, process.env.SECRET_KEY);
          req.user = decoded;
          next();
     } catch (err) {
          return res.status(403).json({ status: false, msg: "Invalid token" });
     }
};
