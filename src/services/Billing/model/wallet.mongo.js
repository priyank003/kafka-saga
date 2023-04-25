const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email");
      }
    },
  },
  userName: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
  },

  customerId: {
    type: String,
  },
  walletAmount: {
    type: Number,
    default: 100000,
  },
});

module.exports = mongoose.model("Wallet", walletSchema);
