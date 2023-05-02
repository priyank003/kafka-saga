const Wallet = require("../model/wallet.mongo");
const { ErrorHandler } = require("../utils/error");
const { redisClient } = require("../services/redis");

const createWallet = async (req, res) => {
  await Wallet.updateOne(
    { userName: req.body.userName },
    { ...req.body },
    { upsert: true }
  );
};

const getWalletAmount = async (username) => {
  const userWallet = await Wallet.findOne({ userName: username });

  return userWallet.walletAmount;
};

const updateWalletAmount = async (operation, products, username) => {
  if (operation === "-") {
    const totalPrice = calculateTotalPrice(products);
    await redisClient.set(
      "trans-data",
      JSON.stringify({
        money: totalPrice,
        username: username,
      })
    );
    await Wallet.updateOne(
      { userName: username },
      { $inc: { walletAmount: -totalPrice } }
    );

    const wallet = await getWalletAmount(username);
    console.log("wallet amount after purchase", wallet);
  } else if (operation === "+") {
    const cacheData = await redisClient.get("trans-data");
    const data = JSON.parse(cacheData);
    await Wallet.updateOne(
      { userName: data.username },
      { $inc: { walletAmount: data.money } }
    );

    const wallet = await getWalletAmount(data.username);
    console.log("wallet amount after compensating restore", wallet);
  }
};

const validatePayment = async (user, products) => {
  const walletAmount = await getWalletAmount(user.username);

  const totalPrice = calculateTotalPrice(products);
  console.log("current wallet amount before purchase", walletAmount);

  if (Number(walletAmount) >= Number(totalPrice)) {
    return true;
  } else {
    return false;
    // throw new ErrorHandler(500, "low amount in wallet");
  }
};

function calculateTotalPrice(products) {
  let totalPrice = 0;

  products.map((item) => {
    totalPrice += item.quantity * item.price;
  });

  return totalPrice;
}
module.exports = {
  createWallet,
  getWalletAmount,
  validatePayment,
  updateWalletAmount,
};
