const Wallet = require("../model/wallet.mongo");
const { ErrorHandler } = require("../utils/error");

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

const updateWalletAmount = async (operation, q, username) => {
  if (operation === "-") {
    await Wallet.updateOne(
      { userName: username },
      { $inc: { walletAmount: -q } }
    );

    const wallet = await getWalletAmount(username);
    console.log("wallet amount after purchase", wallet);
  } else if (operation === "+") {
    await Wallet.updateOne(
      { userName: username },
      { $inc: { walletAmount: q } }
    );

    const wallet = await getWalletAmount(username);
    console.log("wallet amount after compensating restore", wallet);
  }
};

const validatePayment = async (user, price) => {
  const walletAmount = await getWalletAmount(user.username);

  console.log("current wallet amount before purchase", walletAmount);
  console.log(walletAmount, price);
  if (Number(walletAmount) >= Number(price)) {
    return true;
  } else {
    throw new ErrorHandler(500, "low amount in wallet");
  }

  //   return false;
};
module.exports = {
  createWallet,
  getWalletAmount,
  validatePayment,
  updateWalletAmount,
};
