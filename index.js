const express = require("express");
const cors = require("cors");
const Router = require("./routes/Routes");
const stripe = require("stripe")(
  "sk_test_51OFa7xSI55uByng4ykFMInzewhC3lSJ2f9ElSCaYIgNjcOPZ50mpcmB7t9jf8QzLeUBcv3egMxRpmL3KlyX7hEfW00Y2yKHXqS"
);
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use(Router);
app.post("/api/create-checkout-session", async (req, res) => {
  const { products } = req.body;
  console.log(products);

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: product.topic,
      },
      unit_amount: product.price * 100,
    },
    quantity: product.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:3000/",
    cancel_url: "http://localhost:3000/",
  });
  res.send({ id: session.id });
});

app.listen(process.env.PORT);

console.log(`server is running on port ${process.env.PORT}`);
