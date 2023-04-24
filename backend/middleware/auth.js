// particular function after login hi access ho sakte h
const catchAsyncError = require("./catchAsyncError")
const ErrorHandler = require("../utils/errorhandler")
const jwt = require("jsonwebtoken")
const User = require("../models/userModels")

exports.isAuthenticatedUser = catchAsyncError(async (req,res,next)=> {
    const {token} = req.cookies;
    // console.log(token)
    if(!token) {
        return next (new ErrorHandler("Please login to access this resource",401))
    }
    const decodedData = jwt.verify(token,process.env.JWT_SECRET);
    // console.log(decodedData)
    req.user = await User.findById(decodedData.id)
    // console.log(req.user)
    next()

})

exports.authorizeRoles = (...roles) => {
    // console.log(roles)
    // console.log(roles.includes("user"))
    return (req,res,next) =>{
        // req.user me pure user ki details h
        // console.log(req.user.role)
        if(!roles.includes(req.user.role)) {
            // 403 -> server ne samjh liya but refuse kar diya
            return next(
                new ErrorHandler(`Role ${req.user.role} is not allowed to access the resource`,403)
            )
        }
        next()
    }
}