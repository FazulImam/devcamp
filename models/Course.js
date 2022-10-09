const mongoose = require("mongoose");
const Bootcamp = require("./Bootcamp");

const courseSchema = new mongoose.Schema({
    title : {
        type : String,
        trim : true,
        required : [true,"Please add a course title"]
    },
    description: {
        type : String,
        required : [true,"Please add a description"]
    },
    weeks : {
        type : String,
        required : [true,"Please add a number of weeks"]
    },
    tuition : {
        type : Number,
        required : [true,"Please add a tuition cost"]
    },
    minimumSki : {
        type : String,
        required : [true,"Please add a minimum skill"],
        enum : ['beginner','intermediate','advance']
    },
    scholarshipAvailable : {
        type : Boolean,
        default : false
    },
    bootcamp : {
        type : mongoose.Schema.Types.ObjectId,
        ref : Bootcamp,
        required : true
    }
},{timestamps : true})

module.exports = mongoose.model("Course",courseSchema);