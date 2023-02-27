const express = require("express")
const router = express.Router()

const {checkOutSession ,CreateOrder ,GetAllOrder ,GET_Id_Order , Update_Order_To_paid , Update_Order_To_delever} = require("../controller/C_order")
const { protect, allowedTo } = require("../controller/C_auth")

router.use( protect, allowedTo("user" , "user" , "admin"))
router.post("/:cartId"     , CreateOrder)
router.get("/"             , GetAllOrder)
router.get("/:id"          , GET_Id_Order)
router.put("/:id/pay"      , Update_Order_To_paid)
router.put("/:id/deliver"      , Update_Order_To_delever)
router.get("/checkout-session/:id"      , checkOutSession)



module.exports = router