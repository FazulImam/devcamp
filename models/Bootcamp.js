const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name Can't be longer then 50 character"],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [500, "Description Can't be longer then 500 character"],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Please add a valid url with HTTP or HTTPS",
    ],
  },
  phone: {
    type: String,
    maxlength: [20, "Please add a valid number"],
  },
  email: {
    type: String,
    match: [
      /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      "Please add a valid email",
    ],
  },
  address : {
    type : String,
    required : [true,"Please add an address"]
  },
  location : {
    // GeoJSON point
    type : {
        type : String,
        enum : ["Point"],
        required : true
    },
    coordinates : {
        type : [Number],
        required : true,
        index : '2dsphere'
    },
    formattedAddress : String,
    street : String,
    city : String,
    state : String,
    zipcode : String,
    country : String
},
careers : {
    type : [String],
    required : true,
    enum : [
        "Web Development",
        "Data Science",
        "Mobile Development",
        "UX/UI",
        "Business",
        "Other"
    ]
},
averageRating : {
    type : Number,
    minLength : [1,"Rating must be at least 1"],
    maxlength : [10, "Rating can't be more than 10"]
},
averageCost : Number,
photo : {
    type : String,
    default : "no_photo.jpg"
},
housing : {
    type : Boolean,
    default : false
},
jobAssistance : {
    type : Boolean,
    default : false
},
jobGuarantee : {
    type : Boolean,
    default : false
},
acceptGi : {
    type : Boolean,
    default : false
}
},{timestamps: true});


// to create slug from name
BootcampSchema.pre("save",function(next) {
  this.slug = slugify(this.name,{lower:true});
  next();
})

// Geocode and create location

BootcampSchema.pre("save", async function(next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type : "Point",
    coordinates : [loc[0].longitude,loc[0].latitude],
    formattedAddress : loc[0].formattedAddress,
    street : loc[0].streetName,
    city : loc[0].city,
    state : loc[0].stateCode,
    zipcode : loc[0].zipcode,
    country : loc[0].countryCode
  }
  this.address = undefined;
  next();
})

module.exports = mongoose.model("Bootcamp",BootcampSchema);
