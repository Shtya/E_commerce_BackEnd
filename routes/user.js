const express = require("express")
const router = express.Router()

const {Update_Pass ,IMG , Resize , Get, Get_Id, Create, Update, Delete } = require("../controller/C_user")
const { V_Create , V_Update , V_Update_pass } = require("../validation/V_user")
const { protect, allowedTo } = require("../controller/C_auth")

router.get("/"       , Get)
router.get("/:id"    , Get_Id)
router.post("/"      , IMG ,Resize ,V_Create , Create)
router.put("/:id"    , IMG ,Resize ,V_Update , Update)
router.delete("/:id" , Delete)
router.put("/change-password/:id" ,V_Update_pass  ,Update_Pass)

module.exports = router