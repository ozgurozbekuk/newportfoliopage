import { setConversationStatus } from "./lib/conversationStore.js";

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const getEnv = () =>
  globalThis?.process?.env ||
  (typeof import.meta !== "undefined" && import.meta?.env) ||
  {};

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Only POST" }),
    };
  }

  try {
    const { conversationId } = JSON.parse(event.body || "{}");
    if (!conversationId || typeof conversationId !== "string") {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: "conversationId required" }),
      };
    }

    const env = getEnv();
    const botToken = env.BOT_TOKEN || globalThis?.Deno?.env?.get?.("BOT_TOKEN");
    const telegramChatId =
      env.TELEGRAM_CHAT_ID || globalThis?.Deno?.env?.get?.("TELEGRAM_CHAT_ID");
    const adminSecret =
      env.ADMIN_SECRET || globalThis?.Deno?.env?.get?.("ADMIN_SECRET");
    const siteUrl =
      env.SITE_URL ||
      `https://${event.headers?.host || "yourdomain.com"}`;

    setConversationStatus(conversationId, "waiting_for_ozgur");

    if (botToken && telegramChatId && adminSecret) {
      const approveUrl = `${siteUrl}/.netlify/functions/approve-human?cid=${encodeURIComponent(
        conversationId
      )}&token=${encodeURIComponent(adminSecret)}`;

      const text = [
        "New human request 🚨",
        `Conversation: ${conversationId}`,
        "",
        "Approve:",
        approveUrl,
        "",
        "Reply from Telegram:",
        `/reply ${conversationId} your message`,
        "",
        "Tip: You can also reply directly to this message after approval.",
      ].join("\n");

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text,
        }),
      });
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Server error", error: String(error) }),
    };
  }
};
