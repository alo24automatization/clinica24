const { StatsionarPayment } = require("../models/Cashier/StatsionarPayment.js");
const { ObjectId } = require("mongodb");

require("../app.js");

(async () => {
  const payments = await StatsionarPayment.find();

  for (let payment of payments) {
    const oldTotalPayments = await StatsionarPayment.find({
      clinica: payment.clinica,
      client: payment.client,
      connector: payment.connector,
      createdAt: {
        $lt: payment.createdAt,
      },
    });

    let total = oldTotalPayments.reduce((acc, curr) => acc + curr.payment, 0);

    total += payment.payment;
    await StatsionarPayment.findByIdAndUpdate(
      { _id: payment.id },
      { totalWhileNow: total }
    );
  }

  console.log("done");
})();
