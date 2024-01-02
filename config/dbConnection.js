const mongoose = require('mongoose');
// process.env.CONNECTION_STRING
const connectDB = async() => {
    try{
        const connect = await mongoose.connect("mongodb+srv://AyushB:<password>@cluster0.fp2si7o.mongodb.net/");
        console.log("Database connected ", connect.connection.host, connect.connection.name);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;
