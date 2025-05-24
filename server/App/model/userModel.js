const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
     _id: { type: String, required: true },
     userName: { type: String, required: true },
     userEmail: { type: String, required: true, unique: true },
     resume: { type: String },
     profilePic: { type: String, required: true },
})

const userModel = mongoose.model("users", userSchema)

module.exports = { userModel }