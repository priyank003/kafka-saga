const mongoose = require("mongoose");

const MONGODB_URL = "mongodb://localhost:27017/orders";

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready !");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  try {
    return await mongoose.connect(MONGODB_URL);
  } catch (err) {
    console.log(`Could not connect to mongo ${err}`);
  }
}
async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
