// const nodemailer = require("nodemailer")
//
// const sendEmail = async (options)=> {
//     const transporter = nodemailer.createTransport({
//         host:process.env.SMPT_HOST,
//         port:process.env.SMPT_PORT,
//         service:process.env.SMPT_SERVICE,
//         auth:{
//             user:process.env.SMPT_MAIL,
//             pass:process.env.SMPT_MAIL,
//         }
//     })
//
//     const mailOptions = {
//         from : process.env.SMPT_MAIL,
//         to:options.email,
//         subject:options.subject,
//         text:options.message
//     }
//     // console.log("email hu mai")
//     await transporter.sendMail(mailOptions, function(error, info){
//         if (error) {
//             console.log(error);
//         } else {
//             console.log('Email sent: ' + info.response);
//         }
//     })
//     // console.log("email bhejdi hu mai")
// }

const nodemailer = require("nodemailer")

const sendEmail = async (options)=> {
    const transporter = nodemailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        service: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD, // <-- set to correct password
        }
    } , )

    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    try {
        const info = await transporter.sendMail(mailOptions)
        console.log('Email sent: ' + info.response)
    } catch (error) {
        console.log(error)
    }
}

module.exports = sendEmail;
