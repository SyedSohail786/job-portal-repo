const express = require("express")
const { viewAllJobs } = require("./website/viewAllJobs")
const { users } = require("./website/users")

const WebsiteRoute = express.Router()


WebsiteRoute.use(viewAllJobs)
WebsiteRoute.use(users)

module.exports = { WebsiteRoute }