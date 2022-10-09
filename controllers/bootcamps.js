const Bootcamp = require("../models/Bootcamp");
const AsyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const geoCoder = require("../utils/geocoder");

// @desc    get all the bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public

exports.getBootcamps = AsyncHandler(async (req, res) => {

  let query;

  let reqQuery = {...req.query};

  const removeFields = ['select','sort','page','limit'];

  removeFields.forEach(param => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);
  
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/,match => `$${match}`);

  query = Bootcamp.find(JSON.parse(queryStr));

  // select fields
  if(req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // sort fields
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy)
  } else {
    query = query.sort("-createdAt");
  }

  // pagination
  const page = parseInt(req.query.page,10) || 1;
  const limit = parseInt(req.query.limit,10) || 100;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = Bootcamp.countDocuments();
   
  query.skip(startIndex).limit(limit);

  const bootcamps = await query;

  // pagination results
  const pagination = {};

  if(endIndex < total) {
    pagination.next = {
      page : page + 1,
      limit
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page : page - 1,
      limit
    }
  } 

  res.status(200).json({
    success: true,
    pagination,
    count: bootcamps.length,
    data: bootcamps,
  });  
});

// @desc    get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public

exports.getBootcamp = AsyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse("NO Bootcamp found of ID " + req.params.id),
      404
    );
  }
  res.status(200).json({
    success: true,
    message: bootcamp,
  });
});

// @desc    create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private

exports.createBootcmap = AsyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

// @desc    update bootcamps
// @route   PUT /api/v1/bootcamps/:id
// @access  Private

exports.updateBootcamp = AsyncHandler(async (req, res) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ status: true, data: bootcamp });
});

// @desc    delete bootcamps
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private

exports.deleteBootcamp = AsyncHandler(async (req, res) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if(!bootcamp) {
    return new ErrorResponse(`No bootcamp found of id ${req.params.id}`,404);
  }
  res.status(200).json({ status: true, data: bootcamp });
});

// @desc    Get bootcamps within a radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private

exports.getBootcampsInRadius = AsyncHandler(async (req, res) => {
    const {zipCode, distance} = req.params;

    // Get lat and log from geocoder
    const loc = await geoCoder.geocode(zipCode);
    const lat = loc[0].latitude;
    const log = loc[0].longitude;
    // Earth Radius is 3963 miles
    const radius = distance / 3963;
    const bootcamps =  await Bootcamp.find({
      location : {
        $geoWithin : {$centerSphere: [[log,lat],radius]}
      }
    })
    res.status(200).json({
      success : true, count :bootcamps.length, data : bootcamps
    })
});
