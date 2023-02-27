const mongoose          = require("mongoose")
const path              = require("path")
const express           = require("express")
const cors              = require("cors")
const compression       = require("compression")
const dotenv            = require("dotenv")
const connectiondb      = require("./config/db")
const mounte            = require("./routes/index")
const morgan            = require('morgan')
const {globalError}     = require("./util/GlobalError")
const {webhookCheckout} = require("./controller/C_order")
const app = express()
dotenv.config({path:".env"})
connectiondb()



// 

app.post('/webhook', express.raw({type: 'application/json'}),webhookCheckout );




app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use("*" , cors())
app.use(compression())
app.use(express.static(path.join(__dirname , "uploads")))
app.use(morgan("dev"))
mounte(app)



// ) Catch Error
app.all("*", (req, res, next) => {
  next(new Error (`can't find this route : ${req.originalUrl}`))
})
app.use(globalError)


let port = process.env.PORT || 6000
app.listen(port , _=> console.log(`Server is running on ${port}`))
