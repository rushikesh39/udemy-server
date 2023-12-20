const mongoose = require("../config/database");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: Number
  },
  courses: []
});

const User = mongoose.model("users", UserSchema);

module.exports = User;