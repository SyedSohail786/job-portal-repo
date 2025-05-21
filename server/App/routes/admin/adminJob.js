const express= require("express")
const { insertController, viewController, getApplicantsData, downloadResume, updateApplicantAction } = require("../../controller/admin/AdminController")

const adminJob= express.Router()

adminJob.post("/insert",insertController)
adminJob.post("/view", viewController)
adminJob.post("/getApplicants",getApplicantsData)
adminJob.get('/download/:filename', downloadResume);
adminJob.post("/updateApplicantAction",updateApplicantAction)






module.exports={adminJob}