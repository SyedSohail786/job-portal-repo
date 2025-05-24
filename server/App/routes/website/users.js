const express = require("express")
const { usersDataController, saveResumeController, saveAppliedJobsController, getResumeController } = require("../../controller/website/WebsiteControllers")
const { uploads } = require("../../middleware/fileUpload")
const users = express.Router()




users.post("/saveUsersData", usersDataController)
users.post("/saveResume", uploads("uploads/resume").single("userResume"), saveResumeController)
users.post("/saveAppliedJobs", saveAppliedJobsController)
users.post("/getResume", getResumeController)

module.exports = { users }