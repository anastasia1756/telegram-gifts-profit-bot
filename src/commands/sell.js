// export default function registerSell(bot, db) {
//   bot.onText(/\/sell/, async (msg) => {
//     const chatId = msg.chat.id;

//     await bot.sendMessage(
//       chatId,
//       "Пришлите ссылку на подарок (или напишите 'отмена', если передумали):"
//     );

//     bot.once("message", async (m1) => {
//       const link = m1.text.trim().toLowerCase();
//       if (link === "отмена" || link === "/cancel" || link === "cancel") {
//         return bot.sendMessage(chatId, "❌ Продажа отменена.");
//       }

//       const match = link.match(/t\.me\/nft\/([\w-]+)/);
//       if (!match)
//         return bot.sendMessage(
//           chatId,
//           "❌ Неверная ссылка. Пришлите в формате https://t.me/nft/Имя-Номер"
//         );

//       const giftId = match[1];

//       await bot.sendMessage(chatId, "Введите цену продажи (или 'отмена'):");
//       bot.once("message", async (m2) => {
//         const text = m2.text.trim().toLowerCase();
//         if (text === "отмена" || text === "/cancel" || text === "cancel") {
//           return bot.sendMessage(chatId, "❌ Продажа отменена.");
//         }

//         const sellPrice = parseFloat(m2.text);
//         if (isNaN(sellPrice)) {
//           return bot.sendMessage(chatId, "❌ Неверная цена. Продажа отменена.");
//         }

//         const [rows] = await db.execute(
//           'SELECT * FROM transactions WHERE user_id=? AND number=? AND type="buy" LIMIT 1',
//           [msg.from.id, giftId]
//         );

//         if (!rows.length) {
//           return bot.sendMessage(
//             chatId,
//             `❌ Покупка ${giftId} не найдена. Сначала добавьте покупку через /buy.`
//           );
//         }

//         const buy = rows[0];
//         const profit = (sellPrice - buy.price).toFixed(3);

//         await db.execute(
//           'INSERT INTO transactions (user_id, number, type, price, date) VALUES (?, ?, "sell", ?, NOW())',
//           [msg.from.id, giftId, sellPrice]
//         );

//         bot.sendMessage(
//           chatId,
//           `💰 Продажа ${giftId}: прибыль ${
//             profit > 0 ? "🟢 +" : "🔴 "
//           }${profit} 💎`
//         );
//       });
//     });
//   });
// }
export default function registerSell(bot, db) {
  bot.onText(/\/sell/, async (msg) => {
    const chatId = msg.chat.id;

    await bot.sendMessage(
      chatId,
      "Пришлите ссылку на подарок (или напишите 'отмена', если передумали):"
    );

    bot.once("message", async (m1) => {
      const link = m1.text.trim().toLowerCase();
      if (["отмена", "/cancel", "cancel"].includes(link))
        return bot.sendMessage(chatId, "❌ Продажа отменена.");

      const match = link.match(/t\.me\/nft\/([\w-]+)/);
      if (!match)
        return bot.sendMessage(
          chatId,
          "❌ Неверная ссылка. Пришлите в формате https://t.me/nft/Имя-Номер"
        );

      const giftId = match[1];

      await bot.sendMessage(chatId, "Введите цену продажи (или 'отмена'):");
      bot.once("message", async (m2) => {
        const text = m2.text.trim().toLowerCase();
        if (["отмена", "/cancel", "cancel"].includes(text))
          return bot.sendMessage(chatId, "❌ Продажа отменена.");

        const sellPrice = parseFloat(m2.text);
        if (isNaN(sellPrice))
          return bot.sendMessage(chatId, "❌ Неверная цена. Продажа отменена.");

        const buyRows = await db.all(
          'SELECT * FROM transactions WHERE user_id=? AND number=? AND type="buy" LIMIT 1',
          [msg.from.id, giftId]
        );

        if (!buyRows.length)
          return bot.sendMessage(
            chatId,
            `❌ Покупка ${giftId} не найдена. Сначала добавьте покупку через /buy.`
          );

        const buy = buyRows[0];
        const profit = (sellPrice - buy.price).toFixed(3);

        await db.run(
          'INSERT INTO transactions (user_id, number, type, price, date) VALUES (?, ?, "sell", ?, datetime("now", "localtime"))',
          [msg.from.id, giftId, sellPrice]
        );

        bot.sendMessage(
          chatId,
          `💰 Продажа ${giftId}: прибыль ${
            profit > 0 ? "🟢 +" : "🔴 "
          }${profit} 💎`
        );
      });
    });
  });
}
