require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(express.json());
app.use(express.static("public"));

const items = new Map([
  [
    1,
    {
      productName: "Razor Gaming Pc",
      price: 1000,
      image:
        "https://assets2.razerzone.com/images/pnx.assets/381e915d58d2b9759725c30a9f2c3a0f/razer-blade-16-2023-laptop-500x500.jpg",
    },
  ],
  [
    2,
    {
      productName: "Samsung A71 5G",
      price: 399,
      image:
        "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a71-5g-1.jpg",
    },
  ],
]);

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `https://strip-trail.onrender.com/success.html`,
      cancel_url: `https://strip-trail.onrender.com/error.html`,
      line_items: req.body.items.map((item) => {
        const storeItem = items.get(item.id);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.productName,
              images: [storeItem.image],
            },
            unit_amount: storeItem.price * 100,
          },
          quantity: item.quantity,
        };
      }),
    });

    console.log(session);
    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use("/sometxt", (req, res) => {
  res.status(200).send("<h1>HEYYYY!</h1>");
});

app.listen(3000);
