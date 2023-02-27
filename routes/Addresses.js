const express = require("express")
const router = express.Router()

const {GETAll , Create , Delete  } = require("../controller/C_addresses")
const { protect, allowedTo } = require("../controller/C_auth")

router.get("/"               ,protect , allowedTo( "user" ) , GETAll)
router.post("/"              ,protect , allowedTo( "user" ) ,Create)
router.delete("/:AddressId"   ,protect , allowedTo( "user")  ,Delete)

module.exports = router