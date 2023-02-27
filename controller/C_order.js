const M_order = require("../model/M_order")
const M_cart = require("../model/M_cart")
const M_product = require("../model/M_Product")
const AsyncHandler = require("express-async-handler")
const stripe = require("stripe")('sk_test_51MegNnIlxFD1sVSUAMhZkes39gzB51hDstqwOnMiZylSOdsG9vFj1vebmFoRLu4AL0dRaZ9aDPZx5bbnpZHYTdWB00xfYzPV7v')


exports.CreateOrder = AsyncHandler(async (req, res, next) => {
  const taxPrice = 0
  const shiipinPrice = 0
  
    // 1) Get Cart depend on CartId
  const cart = await M_cart.findById(req.params.cartId)
  if (!cart) next(new Error("there is no such cart with id"))
  
  // 2) Get order price depend on cart price "Check if coupon apply"
  const cartPrice = cart.totalCartDiscount ? cart.totalCartDiscount : cart.totalCartPirce
  const totalOrderPrice = cartPrice + taxPrice + shiipinPrice
  

  // 3) Create order with default paymentMethodType "cash"
  const order = await M_order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice
  })

  // 4) After creating order , decrement product quantity , increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map(item =>( {
      updateOne: {
        filter: { _id: item.product },
        update : {$inc : {quantity : -item.quantity , sold: +item.quantity}}
      }
    }))
    await M_product.bulkWrite(bulkOption, {}) // make more opareation in this moment
    // 5) Clear cart depend on CartId
    await M_cart.findByIdAndDelete(req.params.cartID)
  }

  res.status(201).json({status : "success" , data : order})



})


exports.GetAllOrder = AsyncHandler(async (req, res, next) => {
  const data = await M_order.find({user :req.user._id})
  res.status(200).json({data })
})

exports.GET_Id_Order = AsyncHandler(async (req, res, next) => {
  const data = await M_order.find({_id :req.params.id})
  res.status(200).json({data })
})

exports.Update_Order_To_paid = AsyncHandler(async (req, res, next) => {
  const order = await M_order.findById(req.params.id )
  if (!order) next(new Error("there is no such a order with this id"))
  
  order.isPaid = true
  order.paidAt = Date.now()
  const UpdateOrder = await order.save()
  res.status(200).json({data : UpdateOrder})
})

exports.Update_Order_To_delever = AsyncHandler(async (req, res, next) => {
  const order = await M_order.findById(req.params.id )
  if (!order) next(new Error("there is no such a order with this id"))
  
  order.isDelivered = true
  order.deliveredAt = Date.now()
  const UpdateOrder = await order.save()
  res.status(200).json({data : UpdateOrder})
})



// With Payment by website "Stripe"
exports.checkOutSession = AsyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  const cart = await M_cart.findById(req.params.id)
  if (!cart) next(new Error("there is no such cart with id"))
  
  // 2) Get order price depend on cart price "Check if coupon"
  const cartPrice = cart.totalCartDiscount ? cart.totalCartDiscount : cart.totalCartPirce
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice
  
  // 3) Create Stripe Checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [{
      price_data :{product_data :{name: req.user.name},
      unit_amount: totalOrderPrice * 100,
      currency: 'egp'},
      quantity:1
    }],
    mode: "payment",
    success_url:`${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.id,
    metadata:req.body.shippingAddress
  })
  res.status(200).json({status:"success" , session})
})