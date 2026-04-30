import { Agenda } from "agenda";
import { MongoBackend } from "@agendajs/mongo-backend";
import env from "./env.js";

const agenda = new Agenda({
  backend: new MongoBackend({ address: env.MONGO_URI, collection: "jobs" }),
  processEvery: "1 minute",
});

export default agenda;
