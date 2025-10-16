// export default function registerBuy(bot, db) {
//   bot.onText(/\/buy/, async (msg) => {
//     const chatId = msg.chat.id;

//     await bot.sendMessage(
//       chatId,
//       "Пришлите ссылку на подарок (например https://t.me/nft/LolPop-39435) или напишите 'отмена', если передумали:"
//     );

//     bot.once("message", async (m1) => {
//       const link = m1.text.trim().toLowerCase();

//       // если пользователь отменил
//       if (link === "отмена" || link === "/cancel" || link === "cancel") {
//         return bot.sendMessage(chatId, "❌ Покупка отменена.");
//       }

//       const match = link.match(/t\.me\/nft\/([\w-]+)/);
//       if (!match) {
//         return bot.sendMessage(
//           chatId,
//           "❌ Неверная ссылка. Пришлите в формате https://t.me/nft/Имя-Номер"
//         );
//       }

//       const giftId = match[1]; // пример: LolPop-39435

//       await bot.sendMessage(chatId, "Введите цену покупки (или 'отмена'):");
//       bot.once("message", async (m2) => {
//         const text = m2.text.trim().toLowerCase();

//         // проверяем отмену на этом шаге
//         if (text === "отмена" || text === "/cancel" || text === "cancel") {
//           return bot.sendMessage(chatId, "❌ Покупка отменена.");
//         }

//         const price = parseFloat(m2.text);
//         if (isNaN(price)) {
//           return bot.sendMessage(chatId, "❌ Неверная цена. Покупка отменена.");
//         }

//         // записываем в базу
//         await db.execute(
//           'INSERT INTO transactions (user_id, number, type, price, date) VALUES (?, ?, "buy", ?, NOW())',
//           [msg.from.id, giftId, price]
//         );

//         bot.sendMessage(chatId, `✅ Куплен ${giftId} за ${price} 💎`);
//       });
//     });
//   });
// }

export default function registerBuy(bot, db) {
  bot.onText(/\/buy/, async (msg) => {
    const chatId = msg.chat.id;

    await bot.sendMessage(
      chatId,
      "Пришлите ссылку на подарок (например https://t.me/nft/LolPop-39435) или напишите 'отмена', если передумали:"
    );

    bot.once("message", async (m1) => {
      const link = m1.text.trim().toLowerCase();
      if (["отмена", "/cancel", "cancel"].includes(link))
        return bot.sendMessage(chatId, "❌ Покупка отменена.");

      const match = link.match(/t\.me\/nft\/([\w-]+)/);
      if (!match)
        return bot.sendMessage(
          chatId,
          "❌ Неверная ссылка. Пришлите в формате https://t.me/nft/Имя-Номер"
        );

      const giftId = match[1];

      await bot.sendMessage(chatId, "Введите цену покупки (или 'отмена'):");
      bot.once("message", async (m2) => {
        const text = m2.text.trim().toLowerCase();
        if (["отмена", "/cancel", "cancel"].includes(text))
          return bot.sendMessage(chatId, "❌ Покупка отменена.");

        const price = parseFloat(m2.text);
        if (isNaN(price))
          return bot.sendMessage(chatId, "❌ Неверная цена. Покупка отменена.");

        await db.run(
          'INSERT INTO transactions (user_id, number, type, price, date) VALUES (?, ?, "buy", ?, datetime("now", "localtime"))',
          [msg.from.id, giftId, price]
        );

        bot.sendMessage(chatId, `✅ Куплен ${giftId} за ${price} 💎`);
      });
    });
  });
}
