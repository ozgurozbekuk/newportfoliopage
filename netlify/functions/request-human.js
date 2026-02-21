import {
  bindParticipantToken,
  createApprovalToken,
  hasParticipantAccess,
  setConversationStatus,
} from "./lib/conversationStore.js";

const getEnv = () =>
  globalThis?.process?.env ||
  (typeof import.meta !== "undefined" && import.meta?.env) ||
  {};

const getCorsOrigin = (event, env) => {
  const requestOrigin = event.headers?.origin || "";
  if (requestOrigin) return requestOrigin;

  const siteUrl = env.SITE_URL || "";
  try {
    return siteUrl ? new URL(siteUrl).origin : "*";
  } catch {
    return "*";
  }
};

export const handler = async (event) => {
  const env = getEnv();
  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": getCorsOrigin(event, env),
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

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
    const { conversationId, participantToken } = JSON.parse(event.body || "{}");
    if (!conversationId || typeof conversationId !== "string") {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: "conversationId required" }),
      };
    }

    await bindParticipantToken(conversationId, participantToken || "");
    if (!(await hasParticipantAccess(conversationId, participantToken || ""))) {
      return {
        statusCode: 403,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Forbidden" }),
      };
    }

    const botToken = env.BOT_TOKEN || globalThis?.Deno?.env?.get?.("BOT_TOKEN");
    const telegramChatId =
      env.TELEGRAM_CHAT_ID || globalThis?.Deno?.env?.get?.("TELEGRAM_CHAT_ID");
    const siteUrl =
      env.SITE_URL ||
      `https://${event.headers?.host || "yourdomain.com"}`;
    const approvalToken = await createApprovalToken(conversationId);

    await setConversationStatus(conversationId, "waiting_for_ozgur");

    if (botToken && telegramChatId && approvalToken) {
      const approveUrl = `${siteUrl}/.netlify/functions/approve-human?cid=${encodeURIComponent(
        conversationId
      )}&at=${encodeURIComponent(approvalToken)}`;

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
      body: JSON.stringify({ success: true, status: "waiting_for_ozgur" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Server error", error: String(error) }),
    };
  }
};
