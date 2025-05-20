const mongoose = require("mongoose")
const adminRegister = new mongoose.Schema({
     uname: {
          type: String,
          required: true
     },
     uemail: {
          type: String,
          required: true
     },
     upassword: {
          type: String,
          required: true
     },
     filename: {
          type: String,
          required: true
     },
}, {
     timestamps: true,
})


const addJob = new mongoose.Schema({
     jobTitle: {
          type: String,
          required: true,
     },
     jobDescription: {
          type: String,
          required: true,
     },
     jobCategory: {
          type: String,
          required: true,
     },
     jobLocation: {
          type: String,
          required: true,
     },
     jobLevel: {
          type: String,
          required: true,
     },
     jobSalary: {
          type: Number,
          required: true,
     },
     jobPostedAdmin: {
          type: String,
          required: true,
     },
     jobApplicants: {
          type: Array,
     },
     jobVisible: {
          type: Boolean,
          default: true
     },
     adminImage:{
          type:String
     },
     adminName:{
          type:String
     }

}, {
     timestamps: true,
})


const jobModel = mongoose.model("job", addJob)
const adminRegisterModel = mongoose.model("Admin", adminRegister)
module.exports = { adminRegisterModel, jobModel }