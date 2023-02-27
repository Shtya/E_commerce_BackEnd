const express = require("express")
const router = express.Router()

const {Create ,getCart , DeleteOneProduct ,DeleteAllCart , UpdateQuantity , ApplyCoupon} = require('../controller/C_cart')
const { protect, allowedTo } = require("../controller/C_auth")

router.use(protect , allowedTo( "user" ))

router.post("/"           , Create)
router.get("/"             , getCart)
router.delete("/:id"       , DeleteOneProduct)
router.delete("/"          , DeleteAllCart)
router.put("/applyCoupon"          , ApplyCoupon)
router.put("/:id"          , UpdateQuantity)


module.exports = router