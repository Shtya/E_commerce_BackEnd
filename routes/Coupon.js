const express = require("express")
const router = express.Router()

const { Get, Get_Id, Create, Update, Delete } = require("../controller/C_Coupon")
const { protect, allowedTo } = require("../controller/C_auth")

router.use(protect , allowedTo( "admin" , "manger"))
router.get("/"        , Get)
router.get("/:id"     , Get_Id)
router.post("/"       , Create)
router.put("/:id"     , Update)
router.delete("/:id"  , Delete)

module.exports = router