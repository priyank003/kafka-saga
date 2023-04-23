const express = require("express");
const { ErrorHandler } = require("./utils/error");

const app = express();
app.use(express.json());

let WALLET_DATA = {
  "Test Two": 100000,
};

const PORT = 8002;

const service = "Billing";

const validatePayment = () => {
  return true;
};

app.post("/", (req, res) => {
  const paymentStatus = validatePayment();

  if (paymentStatus) {
    const orderBody = req.body;
    const { product, customer } = orderBody;

    WALLET_DATA[customer.name] -= product.price;
    console.log("Wallet Money after placing order", WALLET_DATA[customer.name]);

    orderBody.status = "PAYMENT_SUCCESS";
    res.send(orderBody);
  }
  //   process.exit();
  // throw new ErrorHandler(500, `Error encouintered by ${service} service`);
  // res.send(`${service} service running`);
});

app.post("/compensate", (req, res) => {
  console.log("in billing compensate", req.body);
  const { product, customer } = req.body;
  WALLET_DATA[customer.name] += product.price;
  console.log(
    "restoring wallet money due to compensation",
    WALLET_DATA[customer.name]
  );

  res.send(`${service} service rollback`);
});

app.listen(PORT, (req, res) => {
  console.log("Wallet Money", WALLET_DATA["Test Two"]);
  console.log(`${service} service listening on port ${PORT}`);
});
