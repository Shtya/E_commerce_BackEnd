const M_User = require("../model/M_User")
const AsyncHandler = require("express-async-handler")


exports.Create = AsyncHandler(async (req, res) => {

  const data = await M_User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { addresses: req.body } },
    {new :true}
  )
  res.status(200).json({data : data.addresses , status : "success Add"})
})


exports.Delete = AsyncHandler(async (req, res) => {

  const data = await M_User.findByIdAndUpdate(
    req.user._id,
    { $pull: { addresses:{ _id: req.params.AddressId }} },
    {new :true}
  )
  res.status(200).json({data : data.addresses , status : "success Delete"})
})

exports.GETAll = AsyncHandler(async (req, res) => {

  const data = await M_User.findById(req.user._id)
  res.status(200).json({data : data.addresses , status : "success"})
})


