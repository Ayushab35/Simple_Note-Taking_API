const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User",
    },
    title:{
        type: String,
        required : [true, "Please enter title"],
    },
    content:{
        type: String,
        required: [true, "Please enter content id"]
    },
},{
    timestamps: true,
});

module.exports = mongoose.model("Note", noteSchema);