// import dayjs from "dayjs";
// import utc from "dayjs/plugin/utc.js";
// import timezone from "dayjs/plugin/timezone.js";

// dayjs.extend(utc);
// dayjs.extend(timezone);
// dayjs.tz.setDefault("Europe/Berlin");

// export default function registerProfit(bot, db) {
//   bot.onText(/\/profit/, async (msg) => {
//     const chatId = msg.chat.id;
//     const today = dayjs().tz().format("YYYY-MM-DD");
//     const monthStart = dayjs().tz().startOf("month").format("YYYY-MM-DD");
//     const monthEnd = dayjs().tz().endOf("month").format("YYYY-MM-DD");

//     // 👉 прибыль за сегодня
//     const [todaySells] = await db.execute(
//       'SELECT number, price FROM transactions WHERE user_id=? AND type="sell" AND DATE(date)=?',
//       [msg.from.id, today]
//     );

//     let dailyProfit = 0;

//     for (const sell of todaySells) {
//       const [buyRows] = await db.execute(
//         'SELECT price FROM transactions WHERE user_id=? AND number=? AND type="buy" LIMIT 1',
//         [msg.from.id, sell.number]
//       );
//       if (buyRows.length) {
//         dailyProfit += sell.price - buyRows[0].price;
//       }
//     }

//     // 👉 прибыль за месяц
//     const [monthSells] = await db.execute(
//       'SELECT number, price, date FROM transactions WHERE user_id=? AND type="sell" AND DATE(date) BETWEEN ? AND ?',
//       [msg.from.id, monthStart, monthEnd]
//     );

//     let monthlyProfit = 0;

//     for (const sell of monthSells) {
//       const [buyRows] = await db.execute(
//         'SELECT price FROM transactions WHERE user_id=? AND number=? AND type="buy" LIMIT 1',
//         [msg.from.id, sell.number]
//       );
//       if (buyRows.length) {
//         monthlyProfit += sell.price - buyRows[0].price;
//       }
//     }

//     bot.sendMessage(
//       chatId,
//       `📅 Прибыль за сегодня: ${dailyProfit.toFixed(
//         3
//       )} 💎\n📆 За месяц: ${monthlyProfit.toFixed(3)} 💎`
//     );
//   });
// }
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Berlin");

export default function registerProfit(bot, db) {
  bot.onText(/\/profit/, async (msg) => {
    const chatId = msg.chat.id;
    const today = dayjs().format("YYYY-MM-DD");
    const monthStart = dayjs().startOf("month").format("YYYY-MM-DD");
    const monthEnd = dayjs().endOf("month").format("YYYY-MM-DD");

    // прибыль за сегодня
    const todaySells = await db.all(
      'SELECT number, price FROM transactions WHERE user_id=? AND type="sell" AND DATE(date)=?',
      [msg.from.id, today]
    );

    let dailyProfit = 0;
    for (const sell of todaySells) {
      const buyRows = await db.all(
        'SELECT price FROM transactions WHERE user_id=? AND number=? AND type="buy" LIMIT 1',
        [msg.from.id, sell.number]
      );
      if (buyRows.length) dailyProfit += sell.price - buyRows[0].price;
    }

    // прибыль за месяц
    const monthSells = await db.all(
      'SELECT number, price FROM transactions WHERE user_id=? AND type="sell" AND DATE(date) BETWEEN ? AND ?',
      [msg.from.id, monthStart, monthEnd]
    );

    let monthlyProfit = 0;
    for (const sell of monthSells) {
      const buyRows = await db.all(
        'SELECT price FROM transactions WHERE user_id=? AND number=? AND type="buy" LIMIT 1',
        [msg.from.id, sell.number]
      );
      if (buyRows.length) monthlyProfit += sell.price - buyRows[0].price;
    }

    bot.sendMessage(
      chatId,
      `📅 Прибыль за сегодня: ${dailyProfit.toFixed(
        3
      )} 💎\n📆 За месяц: ${monthlyProfit.toFixed(3)} 💎`
    );
  });
}
