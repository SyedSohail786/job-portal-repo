const express= require("express")
const { insertController, viewController, getApplicantsData } = require("../../controller/admin/AdminController")

const adminJob= express.Router()

adminJob.post("/insert",insertController)
adminJob.post("/view", viewController)
adminJob.post("/getApplicants",getApplicantsData)






module.exports={adminJob}