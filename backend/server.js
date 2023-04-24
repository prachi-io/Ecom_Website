const app = require("./app")

const dotenv = require("dotenv")
const connectDatabase = require("./config/database")

// handling uncaught exception
// console.log(youtube)
// error dega as is naam ka koi variable ni h
process.on("uncaughtException",(err)=> {
    console.log(`Error ${err.message}`);
    console.log(`Shutting down server due to unhandled promise rejection`);
    process.exit(1);
})

// config
dotenv.config({path:"backend/config/config.env"});

// connect databse
connectDatabase()

const server = app.listen(process.env.PORT,()=> {
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
})

// console.log(youtube)

// MongoParseError: Invalid scheme, expected connection string to start with "mongodb://" or "mongodb+srv://"
// jab mongo db url galat hocxxcxcg
// unhandled promise rejection -> that time we want to shut down server
process.on("unhandledRejection" , err=> {
    console.log(`Error ${err.message}`);
    console.log(`Shutting down server due to unhandled promise rejection`);

    server.close(() => {
        process.exit(1);
    });
})
