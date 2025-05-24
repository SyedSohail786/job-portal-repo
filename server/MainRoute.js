const express = require("express")
const { AdminRoute } = require("./App/routes/AdminRoute")
const { WebsiteRoute } = require("./App/routes/WebsiteRoute")

const MainRoute = express.Router()

MainRoute.use("/admin", AdminRoute)
MainRoute.use("/website", WebsiteRoute)



module.exports = { MainRoute }