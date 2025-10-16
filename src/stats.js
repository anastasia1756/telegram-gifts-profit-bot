import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Berlin");

export default function registerStats(bot, db) {
  bot.onText(/\/stats/, async (msg) => {
    const chatId = msg.chat.id;
    const today = dayjs().tz().format("YYYY-MM-DD");

    const [sells] = await db.execute(
      'SELECT * FROM transactions WHERE user_id=? AND type="sell" AND DATE(date)=? ORDER BY id',
      [msg.from.id, today]
    );

    if (!sells.length) {
      return bot.sendMessage(chatId, "❌ Сегодня продаж ещё не было.");
    }

    let totalProfit = 0;
    let message = "💰 Сегодняшние продажи:\n";

    for (const sell of sells) {
      const [buyRows] = await db.execute(
        'SELECT * FROM transactions WHERE user_id=? AND number=? AND type="buy" LIMIT 1',
        [msg.from.id, sell.number]
      );
      if (buyRows.length) {
        const buy = buyRows[0];
        const profit = sell.price - buy.price;
        totalProfit += profit;
        message += `№${sell.number} → +${profit.toFixed(3)} 💎\n`;
      }
    }

    message += "———————————————\n";
    message += `📅 Итого: +${totalProfit.toFixed(3)} 💎`;

    bot.sendMessage(chatId, message);
  });
}
