import app from "./app.js";
import { connectDB } from "./config/database.js";
import env from "./config/env.js";
import { startRecurringPaymentJob } from "./jobs/processRecurringPayments.js";

const start = async () => {
  await connectDB();
  await startRecurringPaymentJob();
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });
};

start();
