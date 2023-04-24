const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
// const isEmail = require("validator/es/lib/isEmail");

const userSchema = new mongoose.Schema({
    name : {
        type:String,
        required:[true,"Please enter your name"],
        maxLength:[30,"Name cannot exceed 30 characters"],
        minLength:[4,"Name should have more than 4 characters"]
    },
    email: {
        type:String,
        required: [true,"Please enter email"],
        unique:true,
        validate : [validator.isEmail,"Please enter a valid email"]
    },
    password: {
        type:String,
        required:[true,"Please enter your password"],
        minLength:[8,"Name should have more than 8 characters"],
        select:false
        // jab bhi find wale function se data denge to password na mile
    },
    avatar : {
        // we will use cloudinary
        public_id : {
            type:String,
            required:true
        },
        url : {
            type:String,
            required:true
        }
    },
    role : {
        type:String,
        default : "user",
    },
    resetPasswordToken : String,
    resetPasswordExpire:Date
})

userSchema.pre("save" , async function(next){
    // function use kara as this use karna h
    // this hum arrow function me use nahi kar sakte

    if(!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password,10)
    // 10 is strongness of password // 10 charcaters ka
})

// jwt token
// we want register karte hi log in ho jae user
// token banega then cookie me sab=ve hoga
userSchema.methods.getJWTToken = function() {
    return jwt.sign({id: this._id},process.env.JWT_SECRET , {
        expiresIn: process.env.JWT_EXPIRE,
    })
}

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password);
}

// generating pasword reset token
userSchema.methods.getResetPasswordToken = function () {

    // generating token
    const resetToken = crypto.randomBytes(20).toString("hex")

    // hashing and add resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15*60*1000;
    return resetToken;

}


module.exports = mongoose.model("User",userSchema)