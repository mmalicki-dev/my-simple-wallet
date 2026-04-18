import Agenda from "agenda";
import env from "./env.js";

const agenda = new Agenda({
  db: { address: env.MONGO_URI, collection: "jobs" },
  processEvery: "1 minute",
});

export default agenda;
