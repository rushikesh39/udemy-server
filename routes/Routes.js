const express = require('express');
const Controller = require('../controller/Controller')

const Router = express.Router();

Router.get('/courses', Controller.courses);

Router.post("/login", Controller.login);
Router.post("/register", Controller.signup);

Router.get("/order", Controller.coursePurchase);
Router.post("/cart/:userID", Controller.orders);

module.exports = Router;