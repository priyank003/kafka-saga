const express = require("express");

const { ErrorHandler } = require("./utils/error");

const { mongoConnect } = require("./services/mongo");
const { connectRedis } = require("./services/redis");

const {
  createOrder,
  cacheOrder,
  commitData,
  compensateAction,
} = require("./controllers/order.controller");

const { Kafka } = require("kafkajs");
const kafka = new Kafka({ brokers: ["localhost:9092"] });

const consumer = kafka.consumer({ groupId: "order" });

const app = express();
app.use(express.json());

const PORT = 8001;
const service = "Order";

const init = async () => {
  await consumer.connect();
  console.log("consumer connected");
  await consumer.subscribe({ topic: "Order-status", fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("order service  status");

      const orderResponse = JSON.parse(message.value);
      console.log("order res", orderResponse);
      if (orderResponse.order_status === "success") {
        await commitData(consumer);
      }
    },
  });
};

app.post("/", async (req, res) => {
  // throw new ErrorHandler(500, "internal server error");

  const data = req.body;

  const createdOrder = createOrder(data);

  cacheOrder(createdOrder);

  res.send(createdOrder);
});

app.get("/compensate", async (req, res) => {
  await compensateAction();
  res.send(`${service} service rollback`);
});
app.listen(PORT, async (req, res) => {
  await mongoConnect();
  await connectRedis();

  console.log(`${service} service listening on port ${PORT}`);
});

init();
