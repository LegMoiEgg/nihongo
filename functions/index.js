const { onSchedule } = require("firebase-functions/v2/scheduler");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

/**
 * Streak Reminder — runs every hour from 20:00–23:00 CET.
 * Checks all users with FCM tokens who haven't reached their daily XP goal,
 * and sends them a push notification.
 *
 * Uses the v2 scheduler API (firebase-functions v5).
 */
exports.streakReminder = onSchedule(
  {
    schedule: "0 20,21,22,23 * * *",
    timeZone: "Europe/Berlin",
    region: "europe-west1",
  },
  async () => {
    const today = new Date().toISOString().split("T")[0];
    const DAILY_XP_GOAL = 100;

    const messages = [
      "Dein Streak wartet auf dich! 🔥",
      "Noch eine kurze Lektion? Du schaffst das! 💪",
      "Vergiss nicht deine tägliche Lektion! 📚",
      "Dein Japanisch wartet auf dich! 🇯🇵",
      "Nur ein paar Minuten — dein Streak ist es wert! ⭐",
    ];

    try {
      const usersSnap = await db
        .collection("users")
        .where("fcmToken", "!=", null)
        .get();

      const tokensToNotify = [];

      for (const doc of usersSnap.docs) {
        const data = doc.data();
        if (!data.fcmToken) continue;

        const dailyLog = data.dailyLog || [];
        const todayEntry = dailyLog.find((d) => d.date === today);
        const todayXp = todayEntry ? todayEntry.xpEarned : 0;

        if (todayXp < DAILY_XP_GOAL) {
          tokensToNotify.push(data.fcmToken);
        }
      }

      if (tokensToNotify.length === 0) {
        logger.info("No users to notify.");
        return;
      }

      const body = messages[Math.floor(Math.random() * messages.length)];

      const appUrl = "https://nihongo-learn-gg.vercel.app";

      const response = await admin.messaging().sendEachForMulticast({
        notification: {
          title: "NihonGo",
          body: body,
        },
        webpush: {
          notification: {
            title: "NihonGo",
            body: body,
            icon: "/favicon.svg",
            badge: "/favicon.svg",
            tag: "streak-reminder", // replaces previous, prevents duplicates
          },
          fcmOptions: {
            link: appUrl, // makes notification clickable → opens app
          },
        },
        tokens: tokensToNotify,
      });

      logger.info(
        `Sent ${response.successCount} notifications, ${response.failureCount} failures`
      );

      // Clean up invalid tokens
      if (response.failureCount > 0) {
        const cleanups = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            const token = tokensToNotify[idx];
            cleanups.push(
              db
                .collection("users")
                .where("fcmToken", "==", token)
                .get()
                .then((snap) =>
                  Promise.all(
                    snap.docs.map((doc) => doc.ref.update({ fcmToken: null }))
                  )
                )
            );
          }
        });
        await Promise.all(cleanups);
      }
    } catch (error) {
      logger.error("Streak reminder error:", error);
    }
  }
);
