import express, { Request, Response, Application } from "express";
const app: Application = express();
import { Kafka, ITopicConfig } from "kafkajs";
import { redisClient } from "./redis.config";

const kafka = new Kafka({ brokers: ["localhost:9092"] });

app.use(express.json());

const PORT = 9000;

import { SagaDefinitionBuilder } from "./saga/saga-definition-builder";
import axios from "axios";
import { connectRedis } from "./redis.config";
const configReply = [
  {
    method: "post",
    url: "http://localhost:8000/warehouse",
  },
  {
    method: "post",
    url: "http://localhost:8001/",
  },
  {
    method: "post",
    url: "http://localhost:8002/",
  },
  {
    method: "post",
    url: "http://localhost:8003/",
  },
];

const configCompensate = [
  {
    method: "post",
    url: "http://localhost:8000/warehouse/compensate",
  },
  {
    method: "post",
    url: "http://localhost:8001/compensate",
  },
  {
    method: "post",
    url: "http://localhost:8002/compensate",
  },
  {
    method: "post",
    url: "http://localhost:8003/compensate",
  },
];

async function run(data: any) {
  const sagaDefinitionBuilder = new SagaDefinitionBuilder()
    .step("Warehouse-service")
    .onReply(async (P: any) => {
      // invoke ware house Service API to fetch item
      console.log("STEP1 FORWARD");

      return await axios.post(configReply[0].url, P);

      // console.log("STEP1 DATA", res.data);
    })
    .withCompensation(async (P: any) => {
      // invoke warehouse Service API to roll back previosly reserved ticket
      console.log("STEP1 COMPENSATION");

      return await axios.post(configCompensate[0].url, P);
      // const res = await axios(configCompensate[0]);
      // console.log("STEP 1 COMPENSATE", res.data);
    })
    .step("Order-service")
    .onReply(async (P: any) => {
      // invoke Order service  to initialize prder
      console.log("STEP2 FORWARD");
      return await axios.post(configReply[1].url, P);

      // console.log("STEP 2 DATA", res.data);
    })
    .withCompensation(async (P: any) => {
      // invoke Order service API to roll back previously created order

      console.log("STEP2 COMPENSATION");
      return await axios.post(configCompensate[1].url, P);

      // const res = await axios(configCompensate[1]);
      // console.log("STEP 2 COMPENSATE", res.data);
    })
    .step("Billing-service")
    .onReply(async (P: any) => {
      // invoke Billing  service for
      console.log("STEP3 FORWARD");

      return await axios.post(configReply[2].url, P);
    })
    .withCompensation(async (P: any) => {
      // invoke Payment Service API to roll back previously reserved money
      console.log("STEP3 COMPENSATION");
      return await axios.post(configCompensate[2].url, P);
    })
    .step("Shipping-service")
    .onReply(async (P: any) => {
      // invoke Shipping  service for
      console.log("STEP4 FORWARD");

      return await axios.post(configReply[3].url, P);
    })
    .withCompensation(async () => {
      // invoke shipping Service API to roll back previously reserved money
      console.log("STEP4 COMPENSATION");
    });
  const sagaProcessor = await sagaDefinitionBuilder.build();

  // sagaProcessor.start({
  //   product: {
  //     pid: "p1",
  //     name: "iphone",
  //     price: 50000,
  //     quantity: 1,
  //   },
  //   customer: {
  //     name: "Priyank Patil",
  //     username: "priyank003",
  //     address: "Pune",
  //   },
  // });
  // return new Promise((resolve) => sagaProcessor.start(data));
  return sagaProcessor.start(data);
}

app.post("/", async (req: Request, res: Response) => {
  const orderData = req.body;
  const producer = kafka.producer();
  await producer.connect();
  await producer.send({
    topic: "order-complete",
    messages: [
      {
        value: JSON.stringify({
          order_status: "pending",
        }),
      },
    ],
  });
  await producer.send({
    topic: "order-failed",
    messages: [
      {
        value: JSON.stringify({
          order_status: "pending",
          // order_data: payload,
        }),
      },
    ],
  });

  await run(orderData).then(async () => {
    const consumer = kafka.consumer({ groupId: "saga-consumer" });
    await consumer.connect();
    const orderStatusTopics = ["order-complete", "order-failed"];
    orderStatusTopics.map(async (item) => {
      await consumer.subscribe({ topic: item, fromBeginning: true });
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const orderResponse = JSON.parse(String(message.value));

        const currentTransaction = await redisClient.get("curr-trans");
        if (
          orderResponse.order_status === "complete" &&
          currentTransaction === "success"
        ) {
          res.send({
            order: "ok",
            data: orderResponse.data,
          });

          return await consumer.disconnect();
        } else if (
          orderResponse.order_status === "failed" &&
          currentTransaction === "failed"
        ) {
          res.send({
            order: "failed",
            msg: orderResponse.msg,
          });

          return await consumer.disconnect();
        }
      },
    });
  });

  // await consumeTopic();

  // consumeTopic();
});

app.listen(PORT, async () => {
  await connectRedis();
  console.log(`Server Running here 👉 https://localhost:${PORT}`);
});
