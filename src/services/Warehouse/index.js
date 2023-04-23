require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const { mongoConnect } = require("./services/mongo");
const { connectRedis } = require("./services/redis");

const { Kafka } = require("kafkajs");

const kafka = new Kafka({ brokers: ["localhost:9092"] });

const consumer = kafka.consumer({ groupId: "warehouse" });

const { loadWarehouseData } = require("./models/warehouse.modal");

const {
  warehouseCheck,
  commitData,
  cacheData,
  compensateAction,
} = require("./controllers/warehouse.controller");

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

const app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(morgan("dev"));
app.use(express.json());

const PORT = 8000;

const service = "Warehouse";

const wareHouseRouter = require("./routes/warehouse.router");

app.use("/warehouse", wareHouseRouter);

app.listen(PORT, async (req, res) => {
  await mongoConnect();
  await connectRedis();
  loadWarehouseData();
  console.log(`${service} service listening on port ${PORT}`);
});
init();
