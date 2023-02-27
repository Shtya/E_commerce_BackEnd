const mongoose      = require("mongoose")
const path          = require("path")
const express       = require("express")
const cors          = require("cors")
const compression   = require("compression")
const dotenv        = require("dotenv")
const connectiondb  = require("./config/db")
const mounte        = require("./routes/index")
const morgan        = require('morgan')
const {globalError} = require("./util/GlobalError")
const app           = express()
dotenv.config({path:".env"})
connectiondb()



// 
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, "whsec_IJE3T0jShmSuaI1bfLVdxTfHk4kWh4JV");// EndPoint Secret Key
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  // Handle the event
  if (event.type === "checkout.session.completed") {
    console.log(`Create Order here on : ${event.type}`);
    console.log(event.data.object.client_reference);
  }

  // Return a 200 res to acknowledge receipt of the event
  res.send();
});




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