const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

const APP_URL = "https://nihongo-learn-gg.vercel.app";

/**
 * Streak Reminder — runs every hour from 20:00–23:00 CET.
 * Checks all users with FCM tokens who haven't reached their daily XP goal,
 * and sends them a push notification.
 *
 * Uses the v2 scheduler API (firebase-functions v5).
 */
exports.streakReminder = onSchedule(
  {
    // Remind at 12:00, 18:00, 20:00, 21:00, 22:00, 23:00 (Europe/Berlin) —
    // but only users who haven't reached their daily XP goal yet (filtered below).
    schedule: "0 18,20,21,22,23 * * *",
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
      "POWER!!! Mach deine Aufgabe du Mensch! 💧",
      "Du bist doch ein Macher, also mach deine Dailys! 💪",
      "Deswegen ist Böse's Arsch am Arsch! Mach die Dailys! 🔥",
    ];

    try {
      // Read ALL users and filter in code. A Firestore `where("fcmToken","!=",null)`
      // query silently EXCLUDES documents where the field is missing or null —
      // which is exactly the set of users we still want to consider (and it made
      // notifications only ever reach the app creator). Filtering in code avoids
      // that trap; the user base is small so a full read is fine.
      const usersSnap = await db.collection("users").get();

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

      const appUrl = APP_URL;

      // DATA-ONLY message (same reliable path as sendNudge): the service
      // worker's onBackgroundMessage handler shows the notification.
      const response = await admin.messaging().sendEachForMulticast({
        data: {
          title: "NihonGo",
          body: body,
          tag: "streak-reminder", // replaces previous, prevents duplicates
          link: appUrl,
        },
        webpush: {
          headers: { Urgency: "high" },
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

/**
 * Nudge / reminder — when a group member writes a nudge request document,
 * send a one-time push notification to the target user.
 *
 * Nudge doc shape (written by the client in social.ts):
 *   nudges/{targetUid}_{fromUid}_{date}
 *   { targetUid, fromUid, fromName, groupName, date, sent }
 *
 * Deterministic doc id (target_from_date) means the same person can only
 * nudge the same target once per day — repeated writes reuse the same doc.
 */
exports.sendNudge = onDocumentCreated(
  // No explicit region: let Firebase use the Firestore database's region.
  // Forcing a region that differs from the Firestore location makes the
  // Firestore (Eventarc) trigger fail to deploy.
  "nudges/{nudgeId}",
  async (event) => {
    const snap = event.data;
    if (!snap) return;
    const nudge = snap.data();
    if (!nudge || nudge.sent) return;

    try {
      const targetSnap = await db.collection("users").doc(nudge.targetUid).get();
      if (!targetSnap.exists) {
        logger.info("Nudge target not found:", nudge.targetUid);
        return;
      }
      const token = targetSnap.data().fcmToken;
      const tokenUpdatedAt = targetSnap.data().fcmTokenUpdatedAt || "unknown";
      if (!token) {
        logger.info("Nudge target has no FCM token:", nudge.targetUid);
        return;
      }
      logger.info(
        `Nudge → target ${nudge.targetUid}, token …${String(token).slice(-12)}, updated ${tokenUpdatedAt}`
      );

      const fromName = nudge.fromName || "Ein Freund";
      const groupName = nudge.groupName
        ? ` aus \"${nudge.groupName}\"`
        : "";
      const body = `${fromName}${groupName} erinnert dich an deine tägliche Lektion! 🔔`;

      try {
        // DATA-ONLY message: no `notification` block. The service worker's
        // onBackgroundMessage handler builds and shows the notification. This
        // is the reliable path on Android/Chrome — a top-level `notification`
        // block gets handled by the OS and can silently drop for a PWA.
        await admin.messaging().send({
          token,
          data: {
            title: "NihonGo",
            body,
            tag: "nudge",
            link: APP_URL,
          },
          webpush: {
            headers: { Urgency: "high" },
            fcmOptions: { link: APP_URL },
          },
        });
        logger.info(`Nudge SENT OK to ${nudge.targetUid} from ${nudge.fromUid}`);
      } catch (sendErr) {
        // Token is invalid/expired → remove it so the user gets prompted to
        // re-register on next app open. This is the common "sent but never
        // arrives" cause.
        logger.error(`Nudge send FAILED (${sendErr.code}) for ${nudge.targetUid}:`, sendErr.message);
        if (
          sendErr.code === "messaging/registration-token-not-registered" ||
          sendErr.code === "messaging/invalid-registration-token" ||
          sendErr.code === "messaging/invalid-argument"
        ) {
          await db.collection("users").doc(nudge.targetUid).update({ fcmToken: null });
          logger.info(`Removed dead token for ${nudge.targetUid}`);
        }
      }

      // Mark as sent so it can't fire twice
      await snap.ref.update({ sent: true, sentAt: admin.firestore.FieldValue.serverTimestamp() });
    } catch (error) {
      logger.error("Nudge handler error:", error);
    }
  }
);

/**
 * Reset broken streaks at midnight (Europe/Berlin).
 * For every user whose last active day is older than "yesterday", set their
 * currentStreak to 0. Runs server-side so it works even if the user never
 * opens the app.
 */
exports.resetStreaks = onSchedule(
  {
    schedule: "5 0 * * *", // 00:05 every day
    timeZone: "Europe/Berlin",
    region: "europe-west1",
  },
  async () => {
    // Compute "yesterday" in Europe/Berlin as a YYYY-MM-DD string.
    const now = new Date();
    const berlinNow = new Date(
      now.toLocaleString("en-US", { timeZone: "Europe/Berlin" })
    );
    const yesterday = new Date(berlinNow);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    try {
      const usersSnap = await db.collection("users").get();
      let resetCount = 0;
      const batch = db.batch();

      usersSnap.forEach((doc) => {
        const data = doc.data();
        const lastActive = data.lastActiveDate || "";
        const streak = data.currentStreak || 0;
        // Streak is broken if it's non-zero and the last active day is
        // strictly before yesterday (i.e. the user missed all of yesterday).
        if (streak > 0 && lastActive && lastActive < yesterdayStr) {
          batch.update(doc.ref, { currentStreak: 0 });
          resetCount++;
        }
      });

      if (resetCount > 0) {
        await batch.commit();
      }
      logger.info(`resetStreaks: reset ${resetCount} broken streak(s).`);
    } catch (error) {
      logger.error("resetStreaks error:", error);
    }
  }
);
