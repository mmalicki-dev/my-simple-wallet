import agenda from "../config/agenda.js";
import { TransactionModel, AccountModel } from "../models/index.js";

const JOB_NAME = "process scheduled transactions";

agenda.define(JOB_NAME, async () => {
  const now = new Date();

  const due = await TransactionModel.find({
    status: "scheduled",
    date: { $lte: now },
  });

  for (const transaction of due) {
    const delta =
      transaction.type === "income" ? transaction.amount : -transaction.amount;

    await Promise.all([
      TransactionModel.findByIdAndUpdate(transaction._id, {
        status: "posted",
      }),
      AccountModel.findByIdAndUpdate(transaction.account, {
        $inc: { balance: delta },
      }),
    ]);
  }
});

export async function startScheduledTransactionJob() {
  await agenda.start();
  await agenda.every("0 0 * * *", JOB_NAME);
}
