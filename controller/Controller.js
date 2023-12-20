const Course = require("../model/Course");
const User = require("../model/User");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
require('dotenv').config();

const signup = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(200).send({ msg: "This Email is already registered, Please use new Email" })
    }

    const saltRound = await bcrypt.genSalt(10)
    const hashPass = await bcrypt.hash(password, saltRound)

    const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "24h" })

    const temp = { name, phone, email, password: hashPass }
    const user = await User.create(temp)

    return res.status(200).send({
      msg: "User is registered, Successfully!!",
      token: token,
      user,
    })
  }

  catch (error) {
    return res.status(500).send({ msg: "User has not registered,please try again", error: error })
  }
}


const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email }).populate('cart.productId')
    if (!existingUser) {
      return res.status(401).send({ msg: "User is not registered" })
    }

    const validate = await bcrypt.compare(password, existingUser.password)
    if (!validate) {
      return res.status(403).send({ msg: "Password is Wrong" })
    }

    const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "24h" })

    return res.status(200).send({
      msg: "User has logged in successfully",
      token: token,
      user: existingUser,
    })
  }

  catch (error) {
    return res.status(500).send({ msg: "User has not logged in,please try again", error })
  }

}

const courses = async (req, res) => {
  try {
    const Data = await Course.find({}).lean();
    res.send(Data);
  }
  catch (err) {
    console.log("Error on fetching data from db:", err);
  }
}

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

    res.status(200).json({ msg: 'Courses bought and stored successfully' });
  } catch (error) {
    console.error('Error storing courses bought:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

const orders = async (req, res) => {
  const { userID } = req.params;
  try {
    const user = await User.findOne({ email: userID });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const order = user.boughtCourses || [];

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Error fetching bought courses:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = {
  courses,
  login,
  signup,
  coursePurchase,
  orders
}