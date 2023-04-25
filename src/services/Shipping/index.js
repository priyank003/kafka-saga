const express = require("express");
const { ErrorHandler } = require("./utils/error");
const { randomBytes } = require("crypto");
const { Kafka } = require("kafkajs");
const kafka = new Kafka({
  brokers: ["localhost:9092"],
  clientId: "shiiping-producer",
});
const producer = kafka.producer();

const app = express();

app.use(express.json());

const PORT = 8003;

const service = "Shipping";

app.post("/", async (req, res) => {
  //   process.exit();
  // throw new ErrorHandler(500, `Error encouintered by ${service} service`);
  var orderBody = req.body;

  // if (orderBody.status === "PAYMENT_SUCCESS") {
  //   orderBody["shipping_id"] = randomBytes(8).toString("hex");
  //   orderBody["shipping_status"] = "DISPATCHED";
  //   // await producer.connect();
  //   // await producer.send({
  //   //   topic: "Order-status",
  //   //   messages: [{ value: JSON.stringify(orderBody) }],
  //   // });

  //   // await producer.disconnect();
  //   res.send(orderBody);
  // }
  orderBody["shipping_id"] = randomBytes(8).toString("hex");
  orderBody["shipping_status"] = "DISPATCHED";
  return res.send(orderBody);
});

app.get("/compensate", (req, res) => {
  return res.send(`${service} service rollback`);
});

app.listen(PORT, (req, res) => {
  console.log(`${service} service listening on port ${PORT}`);
});
