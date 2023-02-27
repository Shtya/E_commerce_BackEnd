const express = require("express")
const router = express.Router()
const SubCategory = require("./SubCategory")

const {IMG , Resize , Get, Get_Id, Create, Update, Delete } = require("../controller/C_Category")
const { V_Check_ID } = require("../validation/V_Category")
const { protect, allowedTo } = require("../controller/C_auth")

router.get("/"       ,protect , Get)
router.get("/:id"    ,protect , V_Check_ID , Get_Id)
router.post("/"      ,protect , allowedTo( "admin" , "manger") ,IMG ,Resize , Create)
router.put("/:id"    ,protect , allowedTo( "admin" , "manger") ,IMG ,Resize , V_Check_ID , Update)
router.delete("/:id" ,protect , allowedTo( "admin" , "manger") ,V_Check_ID , Delete)
router.use("/:IDCate/subcategories" , SubCategory)
module.exports = router