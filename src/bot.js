import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();

import { db } from "./db.js";
import "./cron.js";

import registerBuy from "./commands/buy.js";
import registerSell from "./commands/sell.js";
import registerProfit from "./profit.js";
import registerStats from "./stats.js";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

registerBuy(bot, db);
registerSell(bot, db);
registerStats(bot, db);
registerProfit(bot, db);

console.log("🤖 Portal Profit Bot запущен...");
