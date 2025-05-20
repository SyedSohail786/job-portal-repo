const express= require("express")
const { insertController, viewController } = require("../../controller/admin/AdminController")

const adminJob= express.Router()

adminJob.post("/insert",insertController)
adminJob.post("/view", viewController)





module.exports={adminJob}