const Course = require("../models/Course");
const AsyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc    get courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public

exports.getCourses = AsyncHandler(async(req,res,next) => {
    let query;
    if(req.params.bootcampId) {
        query = Course.find({bootcamp : req.params.bootcampId})
    } else {
        query = Course.find()
    }

    const courses = await query;
    res.status(200).json({
        succes : true, data : courses, count : courses.length
    })
})