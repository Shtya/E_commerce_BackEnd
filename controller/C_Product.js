const M_Product = require("../model/M_Product")
const AsyncHandler = require("express-async-handler")
const slugify = require("slugify")
const sharp            = require("sharp")
const multer           = require("multer")
const { v4: uuidv4 } = require("uuid")


const memory = multer.memoryStorage({})
const filter = (req, file, next) => {
  file.mimetype.startsWith("image")
    ? next(null , true)
    : next(new Error("Allow Upload Image") , false)
}

const Upload = multer({ storage: memory, fileFilter: filter })
exports.IMG = Upload.fields([
  {maxCount: 1 , name:"imageCover"},
  {maxCount: 5 , name:"images"},
])
exports.Resize = AsyncHandler(async (req, res, next) => {
  // console.log(req.files)
  if (req.files.imageCover) {
    const filename = `product_${uuidv4()}.jpeg`
    await sharp(req.files.imageCover[0].buffer).resize(400, 400)
      .toFormat("jpeg").jpeg({ quality: 100 })
      .toFile(`uploads/product/${filename}`)
    req.body.imageCover = filename
  }


  req.body.images=[]
  if (req.files.images) {
    await Promise.all(
      req.files.images.map((e, index) => {
      const filename = `Products${uuidv4()}_${index+1}.jpeg`
      sharp(e.buffer).resize(400, 400)
      .toFormat("jpeg").jpeg({ quality: 100 })
      .toFile(`uploads/product/${filename}`)
      req.body.images.push(filename)
    }))
  }
  next()
})


exports.Create = AsyncHandler(async (req, res) => {
  req.body.title ?req.body.slug = slugify(req.body.title) : null
  const data = await M_Product.create(req.body)
  res.status(200).json({data})
})

exports.Get = AsyncHandler(async (req, res) => {
  let page = req.query.page * 1 || 1
  let limit = req.query.limit * 1 || 10
  let skip = (page - 1) * limit

  // Build Query 
  let Query = M_Product.find().limit(limit).skip(skip).populate({path:"reviews" })


  //======== 1) Search bt [gt lt lte gte]
  let Clone = { ...req.query }
  let excude = ["limit", "page", "fields", "keyword", "sort"]
  excude.forEach(e => delete Clone[e])
  const REg = JSON.stringify(Clone).replace(/\b(gte|gle|gt|lt)\b/g, match => `$${match}`)
  REg ?Query = Query.find(JSON.parse(REg)) : null
  


  //======= 2) Sorting 
  if (req.query.sort) {
    Query=Query.sort(req.query.sort.split(",").join(" "))
  }

  //======= 3) Feilds
  if (req.query.fields) {
    Query=Query.select(req.query.fields.split(",").join(" "))
  }

  //====== 4) Search by keyword
  if (req.query.keyword) {
    let query = {}
    query.$or = [
      {title :{$regex : req.query.keyword , $options:"i"}},
      {description :{$regex : req.query.keyword , $options:"i"}},
    ]
    Query = Query.find(query)
  }


  const data = await  Query
  res.status(200).json({
    result: data.length,
    paginationResult: {
      currentPage: page,
      numberOfPages: Math.ceil(await M_Product.find().countDocuments() / limit),
      limit
    },
    data
  })
})

exports.Get_Id = AsyncHandler(async (req, res , next) => {
  const data = await M_Product.findById(req.params.id)
  if(!data) next( new Error("This user is not found"))
  res.status(200).json({data})
})

exports.Update = AsyncHandler(async (req, res , next) => {
  req.body.title ? req.body.slug = slugify(req.body.title):null
  const data = await M_Product.findByIdAndUpdate(req.params.id, req.body , { new: true })
  if(!data) next( new Error("This user is not found"))
  res.status(200).json({data})
})

exports.Delete = AsyncHandler(async (req, res , next) => {
  const data = await M_Product.findByIdAndDelete(req.params.id)
  if(!data) next( new Error("This user is not found"))
  res.status(200).json("تم الحذف")
})