const express = require('express')
const cors = require('cors');
const Router = require('./routes/Routes');
require('dotenv').config();

const app = express()

app.use(express.json());
app.use(cors({
  origin: "*"
}))

app.use(Router)


app.listen(process.env.PORT)

console.log(`server is running on port ${process.env.PORT}`)
