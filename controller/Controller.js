const Course = require("../model/Course");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const secretkey = "@123";
const saltround = 10;

const signup = async (req, res) => {
  const details = req.body;
  const email = details.email;
  console.log(details);
  const hashpassword = bcrypt.hashSync(details.password, saltround);
  const temp = {
    name: details.name,
    email: details.email,
    password: hashpassword,
  }

  try {
    const find = await User.findOne({ email: email });
    if (find) {
      return res.send({ msg: "User already exists" });
    }

    const result = await User.create(temp);
    const token = jwt.sign(
      { email: details.email, userName: details.userName },
      secretkey,
      {
        expiresIn: "2d",
      }
    );
    return res.send({ msg: "User registered successfully", token: token });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("Internal Server Error");
  }
};


const login = async (req, res) => {
  const data = req.body;
  const email = data.email;
  const user = await User.findOne({ email: email });
  console.log("user data",user)
  if (user) {
    const password = bcrypt.compareSync(data.password, user.password);
    if (password) {
      const token = jwt.sign({ email: data.email,userName:user.userName }, secretkey, {expiresIn: "5d"});
      return res.send({ msg: "Success", token: token });
    } else {
      return res.send({ msg: "password is wrong" });
    }
  } else {
    return res.send({ msg: "user Not exist" });
  }
};

const courses = async (req, res) => {
  try {
    const Data = await Course.find({}).lean();
    res.send(Data);
  } catch (err) {
    console.log("Error on fetching data from db:", err);
  }
};

const coursePurchase = async (req, res) => {
  const { cartData, userData } = req.body;

  try {
    let userAccount = await User.findOne({ email: userData });

    if (!userAccount) {
      userAccount = new User({
        email: userData,
        boughtCourses: cartData,
      });

      await userAccount.save();
    } else {
      userAccount.boughtCourses = [...userAccount.boughtCourses, ...cartData];
      await userAccount.save();
    }

    res.status(200).json({ msg: "Courses bought and stored successfully" });
  } catch (error) {
    console.error("Error storing courses bought:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const orders = async (req, res) => {
  const { userID } = req.params;
  try {
    const user = await User.findOne({ email: userID });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const order = user.boughtCourses || [];

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error fetching bought courses:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  courses,
  login,
  signup,
  coursePurchase,
  orders,
};
