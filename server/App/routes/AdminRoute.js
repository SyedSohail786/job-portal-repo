const express = require("express")
const { adminJob } = require("./admin/adminJob")
const { adminRegister } = require("./admin/adminRegistrationRoute")

const AdminRoute = express.Router()

AdminRoute.use(adminJob)
AdminRoute.use(adminRegister)




module.exports = { AdminRoute }