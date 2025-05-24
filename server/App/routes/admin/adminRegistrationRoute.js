const express=require("express");
const { uploads } = require("../../middleware/fileUpload");
const { AdminRegisterController, checkOTP, sendOtp, emailCheckController, CheckLoginDetails, getLogo } = require("../../controller/admin/AdminController");
const auth = require("../../middleware/auth");
const adminRegister= express.Router()


adminRegister.post("/email-check",emailCheckController)
adminRegister.post("/admin-register",uploads("uploads/CompaniesLogo").single("logo"),AdminRegisterController )
adminRegister.post ("/checkOTP", checkOTP)
adminRegister.post("/sendOtp", sendOtp)
adminRegister.post("/check-Login-Details",CheckLoginDetails)
adminRegister.post("/getLogo",auth, getLogo)










module.exports={adminRegister}