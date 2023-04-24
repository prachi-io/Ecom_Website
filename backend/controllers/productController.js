const Product = require("../models/productModel");

const ErrorHandler = require("../utils/errorhandler")
const catchAsyncErrors = require("../middleware/catchAsyncError")
const ApiFeatures = require("../utils/apiFeatures")

// Create product - admin route
// error handler for async suppose product banate time name nahi diya to errro aaega
exports.createProduct = catchAsyncErrors(async (req,res,next) => {

    req.body.user = req.user.id

    const product = await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    });
});

// get all products
exports.getAllProducts = catchAsyncErrors(async (req,res) => {77

    // Pagination
    const resultPerPage = 5;
    const productCount = await Product.countDocuments()

    const apiFeature = new ApiFeatures(Product.find(),req.query)
        .search()
        .filter()
        .pagination(resultPerPage);
    const products = await apiFeature.query;
    res.status(200).json({
        success:true,
        products
    })
});

// get product details
exports.getProductDetails = catchAsyncErrors(async (req,res,next) => {
    const product =await Product.findById(req.params.id);
    const productCount = await Product.countDocuments()
    if(!product) {
        return next(new ErrorHandler("Product not found",404))
    }
    // productCount,
    res.status(200).json({
        success:true,
        product,
        productCount,
    })
});

// update product - admin
exports.updateProduct = catchAsyncErrors(async (req,res,next) => {
    let product = Product.findById(req.params.id);
    if(!product) {
        return next(new ErrorHandler("Product not found",404))
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        product
    })
});

// delete product - admin
exports.deleteProduct = catchAsyncErrors(async (req,res,next) => {
    const product =await Product.findById(req.params.id);
    if(!product) {
        return next(new ErrorHandler("Product not found",404))
    }

    try {
        await Product.findByIdAndDelete(req.params.id);
        if(!product) {
            return next(new ErrorHandler("Product not found",404))
        }
        return res.status(200).json({
            success:true,
            message : "Product deleted",
            product
        })
    } catch (e) {
        return next(new ErrorHandler("Product not found",404))
    }
});