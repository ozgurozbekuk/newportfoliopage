import { appendMessage, setConversationStatus } from "./lib/conversationStore.js";

const getEnv = () =>
  globalThis?.process?.env ||
  (typeof import.meta !== "undefined" && import.meta?.env) ||
  {};

const readConversationIdFromText = (text) => {
  const match = String(text || "").match(/Conversation:\s*([^\s]+)/i);
  return match?.[1] || "";
};

const sendTelegramMessage = async (botToken, chatId, text) => {
  if (!botToken || !chatId) return;
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  });
};

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Only POST" };
  }

  try {
    const env = getEnv();
    const botToken = env.BOT_TOKEN || globalThis?.Deno?.env?.get?.("BOT_TOKEN");
    const allowedChatId =
      env.TELEGRAM_CHAT_ID || globalThis?.Deno?.env?.get?.("TELEGRAM_CHAT_ID");
    const webhookSecret =
      env.TELEGRAM_WEBHOOK_SECRET ||
      globalThis?.Deno?.env?.get?.("TELEGRAM_WEBHOOK_SECRET") ||
      "";

    const incomingSecret =
      event.headers?.["x-telegram-bot-api-secret-token"] ||
      event.headers?.["X-Telegram-Bot-Api-Secret-Token"] ||
      "";

    if (!webhookSecret || !allowedChatId) {
      return { statusCode: 500, body: "Webhook misconfigured" };
    }

    if (webhookSecret && incomingSecret !== webhookSecret) {
      return { statusCode: 403, body: "Forbidden" };
    }

    const update = JSON.parse(event.body || "{}");
    const msg = update?.message || update?.edited_message;
    const chatId = msg?.chat?.id ? String(msg.chat.id) : "";
    const text = String(msg?.text || "").trim();

    if (!msg || !text) {
      return { statusCode: 200, body: "ok" };
    }

    if (allowedChatId && chatId !== String(allowedChatId)) {
      return { statusCode: 200, body: "ignored" };
    }

    const replyCmd = text.match(/^\/reply\s+([^\s]+)\s+([\s\S]+)/i);
    if (replyCmd) {
      const cid = replyCmd[1];
      const replyText = replyCmd[2].trim();

      if (!cid || !replyText) {
        await sendTelegramMessage(
          botToken,
          chatId,
          "Usage: /reply <conversationId> <message>"
        );
        return { statusCode: 200, body: "ok" };
      }

      await setConversationStatus(cid, "human_active");
      await appendMessage(cid, {
        sender: "ozgur",
        role: "human",
        content: replyText,
      });

      await sendTelegramMessage(botToken, chatId, `Sent to ${cid}.`);
      return { statusCode: 200, body: "ok" };
    }

    const approveCmd = text.match(/^\/approve\s+([^\s]+)/i);
    if (approveCmd) {
      const cid = approveCmd[1];
      await setConversationStatus(cid, "human_active");
      await sendTelegramMessage(botToken, chatId, `Approved ${cid}.`);
      return { statusCode: 200, body: "ok" };
    }

    const aiCmd = text.match(/^\/ai\s+([^\s]+)/i);
    if (aiCmd) {
      const cid = aiCmd[1];
      await setConversationStatus(cid, "ai_active");
      await sendTelegramMessage(botToken, chatId, `AI re-enabled for ${cid}.`);
      return { statusCode: 200, body: "ok" };
    }

    const closeCmd = text.match(/^\/close\s+([^\s]+)/i);
    if (closeCmd) {
      const cid = closeCmd[1];
      await setConversationStatus(cid, "closed");
      await sendTelegramMessage(botToken, chatId, `Closed ${cid}.`);
      return { statusCode: 200, body: "ok" };
    }

    const helpRequested = /^\/help$/i.test(text) || /^\/start$/i.test(text);
    if (helpRequested) {
      await sendTelegramMessage(
        botToken,
        chatId,
        [
          "Commands:",
          "/approve <conversationId>",
          "/reply <conversationId> <message>",
          "/ai <conversationId>",
          "/close <conversationId>",
        ].join("\n")
      );
      return { statusCode: 200, body: "ok" };
    }

    const repliedTo = msg?.reply_to_message?.text || "";
    const cidFromReply = readConversationIdFromText(repliedTo);
    if (cidFromReply) {
      await setConversationStatus(cidFromReply, "human_active");
      await appendMessage(cidFromReply, {
        sender: "ozgur",
        role: "human",
        content: text,
      });
      await sendTelegramMessage(botToken, chatId, `Sent to ${cidFromReply}.`);
      return { statusCode: 200, body: "ok" };
    }

    await sendTelegramMessage(
      botToken,
      chatId,
      "Unknown command. Use /help for usage."
    );

    return { statusCode: 200, body: "ok" };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Server error: ${String(error)}`,
    };
  }
};
