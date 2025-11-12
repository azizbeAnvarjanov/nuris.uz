import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import * as kv from "./kv_store";

const app = new Hono();

app.use("*", cors());
app.use("*", logger(console.log));

// Get masterclass data
app.get("/make-server-9d7867d5/masterclass-data", async (c) => {
  try {
    const data = await kv.get("masterclass_data");

    if (!data) {
      // Return default data if nothing is stored
      return c.json({
        title: "BEPUL ONLINE MASTERCLASS",
        subtitle: "«SO'ROVNOMA TUZISH VA NATIJALARNI TAHLIL QILISH»",
        date: "12-noyabr",
        time: "19:00",
        description:
          "Ozbekistonda birinchi marta marketing va biznes sohasi bo'yicha marketing hamjamiyati tomonidan tashkil etilayotgan bepul online masterclass!",
        points: [
          "So'rovnoma turlari va ularning afzalliklari hamda kamchiliklari haqida bilib olasiz",
          "So'rovnomani qanday tuzish va qayerda e'lon qilish haqida ma'lumot olasiz",
          "So'rovnoma natijalarini tahlil qilish va ulardan qanday foydalanish haqida bilib olasiz",
        ],
        buttonText: "BEPUL QATNASHISH",
        telegramLink: "https://t.me/",
        giftTitle: "ISHTIROKCHILARIMIZGA SOVG'A",
        giftDescription:
          "Masterklassda qatnashgan barcha ishtirokchilar uchun qo'shimcha bonuslar va materiallar taqdim etiladi!",
        countdownMinutes: 2,
      });
    }

    return c.json(data);
  } catch (error) {
    console.log("Error fetching masterclass data:", error);
    return c.json({ error: "Failed to fetch data" }, 500);
  }
});

// Save/update masterclass data
app.post("/make-server-9d7867d5/masterclass-data", async (c) => {
  try {
    const body = await c.req.json();

    await kv.set("masterclass_data", body);

    return c.json({ success: true });
  } catch (error) {
    console.log("Error saving masterclass data:", error);
    return c.json({ error: "Failed to save data" }, 500);
  }
});

Deno.serve(app.fetch);
