const mongoose = require("../config/database");

const CourseSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  instructor: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  lectures: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  offerPrice: {
    type: Number,
    required: true
  },
  point1: {
    type: String,
    required: true
  },
  point2: {
    type: String,
    required: false
  },
  point3: {
    type: String,
    required: false
  }
})

const Course = mongoose.model("courses", CourseSchema);

module.exports = Course;