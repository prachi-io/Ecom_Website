const User = require("../models/userModels")
const ErrorHandler = require("../utils/errorhandler")
const catchAsyncErrors = require("../middleware/catchAsyncError")
const sentToken = require("../utils/jwtToken")
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto");

// Register a user
exports.registerUser = catchAsyncErrors(async(req,res,next) => {
    const {name,email,password} = req.body;
    const user = await User.create({
        name,email,password,
        avatar:{
            public_id: "this is a sample id",
            url: "profilepicurl"
        }
    })

    sentToken(user,201,res);

    // const token = user.getJWTToken();
    //
    // res.status(201).json({
    //     success:true,
    //     token,
    // })
})

// Login
exports.loginUser = catchAsyncErrors(async (req,res,next) => {
    const {email,password} = req.body;

    // checking if user has given password and email both
    if(!email || !password) {
        return next(new ErrorHandler("Please enter email and password" ,400))
    }

    const user = await User.findOne({email}).select("+password");

    if(!user) {
        return next(new ErrorHandler("invalid email or password",401));
    }

    const isPasswordMatched = user.comparePassword(password);
    if(!isPasswordMatched) {
        return next(new ErrorHandler("invalid email or password",401));
    }

    sentToken(user,200,res);
    // const token = user.getJWTToken();
    //
    // res.status(200).json({
    //     success:true,
    //     token,
    // })
})

exports.logout = catchAsyncErrors(async (req,res,next)=> {

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly: true,
    })

    res.status(200).json({
        success:true,
        message:"Logout"

    })
})

// forget password
exports.forgotPassword = catchAsyncErrors(async (req,res,next) => {
    const user = await User.findOne({email:req.body.email})
    if(!user)
    {
        return next(new ErrorHandler("User not found" , 404))
    }

    // get resetPasswordToken
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave:false})

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it`

    try{


        await sendEmail({
            email:user.email,
            subject:`Ecommerce Password Recovery `,
            message:message,
        })
        // console.log("balle balle")

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully\n ${message}`
        })
        console.log("balle")

    } catch(error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        console.log("errir")
        await user.save({validateBeforeSave:false})

        return next(new ErrorHandler(error.message , 500))
    }

})

// reset password
exports.resetPassword = catchAsyncErrors(async (req,res,next) => {

    // creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire : { $gt : Date.now()}
    })

    if(!user)
    {
        return next(new ErrorHandler("reset password token is invalid or has been expired" , 404))
    }

    if(req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("password not match" , 404))
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sentToken(user,800,res);

})