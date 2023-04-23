require("dotenv").config();
const express = require("express");
const session = require("express-session");

const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const { jwtStrategy } = require("./config/passport");
const { mongoConnect } = require("./services/mongo");

const service = "auth";

const app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(morgan("dev"));

app.use(express.json());
app.use(session({ secret: "notagoodsecret" }));

app.use(passport.initialize());
app.use(passport.session());

const PORT = 8004;

const authRouter = require("./routes/auth.router");
const warehouseRouter = require("./routes/warehouse.router");
const orderRouter = require("./routes/order.router");

app.use("/api/warehouse", warehouseRouter);
app.use("/api/order", orderRouter);
app.use("/api/auth", authRouter);













app.listen(PORT, async (req, res) => {
  await mongoConnect();

  console.log(`${service} service listening on port ${PORT}`);
});
