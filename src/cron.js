import cron from "node-cron";
// import { calculateProfit } from "./profit.js";
import { db } from "./db.js";

cron.schedule(
  "59 23 * * *",
  async () => {
    console.log("⏰ Ежедневный расчёт прибыли...");
    // await calculateProfit(db);
  },
  {
    timezone: "Europe/Berlin",
  }
);
