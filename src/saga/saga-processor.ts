import { Kafka, ITopicConfig } from "kafkajs";
import {
  SagaDefinition,
  SagaMessage,
  STEP_PHASE,
} from "./saga-definition-builder";

import { redisClient } from "../redis.config";

const kafka = new Kafka({ brokers: ["localhost:9092"] });
const admin = kafka.admin();

export class SagaProcessor {
  producer = kafka.producer();
  consumer = kafka.consumer({ groupId: "saga" });

  constructor(private sagaDefinitions: SagaDefinition[]) {}

  async init() {
    await admin.connect();
    await this.consumer.connect();

    const stepTopics = this.sagaDefinitions.map(
      (definition) => definition.channelName
    );

    const kafkaTopics = stepTopics.map((topic): ITopicConfig => ({ topic }));

    await admin.createTopics({ topics: kafkaTopics });
    console.log("Saga topics created successfully");

    for (let topic of stepTopics) {
      await this.consumer.subscribe({ topic });
    }

    await this.consumer.run({
      eachMessage: async ({ topic, message, heartbeat, partition }) => {
        const sagaMessage = JSON.parse(
          message.value!.toString()
        ) as SagaMessage;

        const { saga, payload } = sagaMessage;
        const { index, phase } = saga;

        console.log("===> message received", saga, "payload", payload);

        switch (phase) {
          case STEP_PHASE.STEP_FORWARD: {
            const stepForward =
              this.sagaDefinitions[index].phases[STEP_PHASE.STEP_FORWARD]!
                .command;
            try {
              const res: any = await stepForward(payload);
              console.log("res", res.data);
              if (res.data.status === "failed") {
                throw new Error(res.data.msg);
              }

              await this.makeStepForward(index + 1, res.data);
            } catch (e) {
              console.log("in catch block", stepTopics[index]);
              await this.makeStepBackward(index - 1, {
                status: "failed",
                msg: e.message,
              });
            }
            return;
          }
          case STEP_PHASE.STEP_BACKWARD: {
            const stepBackward =
              this.sagaDefinitions[index].phases[STEP_PHASE.STEP_BACKWARD]!
                .command;
            await stepBackward(payload);
            await this.makeStepBackward(index - 1, payload);
            return;
          }
          default: {
            console.log("UNAVAILBLE SAGA PHASE");
          }
        }
        await heartbeat();
      },
    });
  }

  async makeStepForward(index: number, payload: any) {
    if (index >= this.sagaDefinitions.length) {
      console.log("====> Saga finished and transaction successful");
      await this.producer.send({
        topic: "order-complete",
        messages: [
          {
            value: JSON.stringify({
              order_status: "complete",
              order_data: payload,
            }),
          },
        ],
      });

      await redisClient.set("curr-trans", "success");

      return;
    }
    const message = {
      payload,
      saga: { index, phase: STEP_PHASE.STEP_FORWARD },
    };
    await this.producer.send({
      topic: this.sagaDefinitions[index].channelName,
      messages: [{ value: JSON.stringify(message) }],
    });
  }

  async makeStepBackward(index: number, payload: any) {
    if (index < 0) {
      console.log("===> Saga finished and transaction rolled back");
      console.log("final rollback payload", payload);

      await this.producer.send({
        topic: "order-failed",
        messages: [
          {
            value: JSON.stringify({
              order_status: "failed",
              msg: payload.msg,
              // order_data: payload,
            }),
          },
        ],
      });

      await redisClient.set("curr-trans", "failed");
      return;
    }
    await this.producer.send({
      topic: this.sagaDefinitions[index].channelName,
      messages: [
        {
          value: JSON.stringify({
            payload,
            saga: { index, phase: STEP_PHASE.STEP_BACKWARD },
          }),
        },
      ],
    });
  }

  async start(payload: any) {
    const currentTransaction = await redisClient.get("curr-trans");
    console.log(currentTransaction);
    console.log("start", payload);
    await this.producer.connect();
    await this.producer.send({
      topic: "order-complete",
      messages: [
        {
          value: JSON.stringify({
            order_status: "pending",
          }),
        },
      ],
    });
    await this.producer.send({
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

    if (currentTransaction === null || "success" || "failed") {
      await redisClient.set("curr-trans", "pending");
      await this.makeStepForward(0, payload);
      console.log("Saga started");
    }
  }
}
