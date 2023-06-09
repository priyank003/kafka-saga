const express = require("express");
const { ErrorHandler } = require("./utils/error");
const morgan = require("morgan");
const {
  createWallet,
  validatePayment,
  updateWalletAmount,
} = require("./controller/billing.controller");
const { mongoConnect } = require("./services/mongo");
const { connectRedis } = require("./services/redis");

const app = express();
app.use(express.json());
app.use(morgan("dev"));

let WALLET_DATA = {
  "Test Two": 100000,
};

const PORT = 8002;

const service = "Billing";

app.post("/createWallet", createWallet);

app.post("/", async (req, res) => {
  const orderBody = req.body;
  const { product, customer } = orderBody;
  const paymentStatus = await validatePayment(customer, product);
  console.log("paymentStatus", paymentStatus);
  if (paymentStatus) {
    updateWalletAmount("-", product, customer.username);

    orderBody.status = "PAYMENT_SUCCESS";
    return res.send(orderBody);
  } else {
    return res.send({ status: "failed", msg: "not enough balance in wallet" });
  }
  //  else {
  //   throw new ErrorHandler(500, "Wallet balance is low");
  // }
  //   process.exit();
  // throw new ErrorHandler(500, `Error encouintered by ${service} service`);
  // res.send(`${service} service running`);
});

app.post("/compensate", (req, res) => {
  const { product, customer } = req.body;
  console.log(req.body);

  updateWalletAmount("+");

  return res.send(`${service} service rollback`);
});

app.listen(PORT, async (req, res) => {
  await mongoConnect();
  await connectRedis();
  console.log(`${service} service listening on port ${PORT}`);
});
