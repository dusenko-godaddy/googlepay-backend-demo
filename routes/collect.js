const router = require("express").Router();
const poynt = require("../lib/poynt");
const util = require("util");

const cors = require('cors');

const corsOptions = {
  origin: 'https://pay-demo-9577e.web.app'
};

router.options("/charge", cors(corsOptions));
router.post("/charge", cors(corsOptions), async (req, res) => {
  var charge;
  try {
    const asyncChargeToken = util.promisify(poynt.chargeToken).bind(poynt);
    charge = await asyncChargeToken({
      businessId: global.configs.businessId,
      action: "SALE",
      amounts: {
        transactionAmount: req.body.amount,
        orderAmount: req.body.amount,
      },
      currency: "USD",
      nonce: req.body.nonce,
      emailReceipt: !!req.body.emailAddress,
      partialAuthEnabled: false,
      receiptEmailAddress: req.body.emailAddress,
    });
  } catch (err) {
    console.log("Charge failed", err);
    return res.status(400).send(err);
  }

  res.status(200).send(charge);
});

module.exports = router;
