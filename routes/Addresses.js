const express = require("express")
const router = express.Router()

const {GETAll , Create , Delete  } = require("../controller/C_addresses")
const { protect, allowedTo } = require("../controller/C_auth")

router.get("/"               ,protect  , GETAll)
router.post("/"              ,protect  ,Create)
router.delete("/:AddressId"   ,protect ,Delete)

module.exports = router