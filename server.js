require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(express.json());
app.use(express.static("public"));

const items = new Map([
  [1, { productName: "Laptop", price: 1000 }],
  [2, { productName: "Samsung A71 5G", price: 399 }],
]);

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.URL}success.html`,
      cancel_url: `${process.env.URL}error.html`,
      line_items: req.body.items.map((item) => {
        const storeItem = items.get(item.id);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.productName,
            },
            unit_amount: storeItem.price * 100,
          },
          quantity: item.quantity,
        };
      }),
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000);
