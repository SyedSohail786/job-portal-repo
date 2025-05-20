require("./App/config/instrument")
const express= require("express")
const Sentry = require("@sentry/node");
require("dotenv").config()
const app = express()
const mongoose = require('mongoose');
const cors= require("cors");
const { MainRoute } = require("./MainRoute");
app.use(cors())
app.use(express.json())


//All Routes
app.use(MainRoute)
//All Pictures Uplodation
app.use("/uploads/CompaniesLogo", express.static("uploads/CompaniesLogo"))

//Sentry Initialization
Sentry.setupExpressErrorHandler(app);

//FOR LOCALHOST

// mongoose.connect(process.env.DATABASE_URI + process.env.DATABASE_NAME)
// .then(() => console.log(`${process.env.DATABASE_NAME} Database Connected!`));
// app.listen(process.env.PORTNUMBER, ()=>{
//      console.log(`Server Started on Port ${process.env.PORTNUMBER}`);
     
// })

// FOR MONGODB ATLAS
mongoose.connect(process.env.DATABASE_URI + process.env.DATABASE_NAME)
.then(() => console.log(`${process.env.DATABASE_NAME} Database Connected!`));
app.listen(process.env.PORTNUMBER, ()=>{
     console.log(`Server Started on Port ${process.env.PORTNUMBER}`);
     
})
