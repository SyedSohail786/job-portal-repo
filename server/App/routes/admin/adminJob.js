const express = require("express")
const { insertController, viewController, getApplicantsData, downloadResume, updateApplicantAction } = require("../../controller/admin/AdminController")
const auth = require("../../middleware/auth")

const adminJob = express.Router()

adminJob.post("/insert", auth, insertController)
adminJob.post("/view", auth, viewController)
adminJob.post("/getApplicants", auth, getApplicantsData)
adminJob.get('/download/:filename', auth, downloadResume);
adminJob.post("/updateApplicantAction", auth, updateApplicantAction)






module.exports = { adminJob }