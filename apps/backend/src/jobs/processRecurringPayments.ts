import agenda from "../config/agenda.js";
import { RecurringPaymentModel, TransactionModel } from "../models/index.js";

const JOB_NAME = "process recurring payments";

function advanceDate(date: Date, cycle: "weekly" | "monthly" | "yearly"): Date {
  const next = new Date(date);
  if (cycle === "weekly") next.setDate(next.getDate() + 7);
  else if (cycle === "monthly") next.setMonth(next.getMonth() + 1);
  else next.setFullYear(next.getFullYear() + 1);
  return next;
}

agenda.define(JOB_NAME, async () => {
  const now = new Date();

  const due = await RecurringPaymentModel.find({
    isActive: true,
    nextDueDate: { $lte: now },
  });

  for (const payment of due) {
    await TransactionModel.create({
      user: payment.user,
      account: payment.account,
      category: payment.category,
      amount: payment.amount,
      type: "expense",
      description: payment.name,
      date: payment.nextDueDate,
    });

    payment.nextDueDate = advanceDate(payment.nextDueDate, payment.billingCycle);
    await payment.save();
  }
});

export async function startRecurringPaymentJob() {
  await agenda.start();
  await agenda.every("0 0 * * *", JOB_NAME);
}
