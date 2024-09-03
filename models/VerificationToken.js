const mongoose = require("mongoose");

// verify token schema
const VerificationTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);


// Verification Token Mdel;
const VerificationToken = mongoose.model("VerificationToken", VerificationTokenSchema);



module.exports = VerificationToken;

