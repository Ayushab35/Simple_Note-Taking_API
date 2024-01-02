const express = require('express');
const dotenv = require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
const {errorHandler} = require('./middleware/errorHandler');


const connectDB = require('./config/dbConnection');

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use('/api/notes', require('./routes/notesRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use(errorHandler);

app.listen(port, ()=>{
    console.log("Server running !");
})