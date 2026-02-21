import { setConversationStatus } from "./lib/conversationStore.js";

const getEnv = () =>
  globalThis?.process?.env ||
  (typeof import.meta !== "undefined" && import.meta?.env) ||
  {};

export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Only GET" };
  }

  try {
    const env = getEnv();
    const adminSecret =
      env.ADMIN_SECRET || globalThis?.Deno?.env?.get?.("ADMIN_SECRET");

    const params = new URLSearchParams(event.queryStringParameters || {});
    const cid = params.get("cid");
    const token = params.get("token");

    if (!cid) {
      return { statusCode: 400, body: "Missing cid" };
    }

    if (!adminSecret || token !== adminSecret) {
      return { statusCode: 403, body: "Forbidden" };
    }

    setConversationStatus(cid, "human_active");
    const siteUrl =
      env.SITE_URL ||
      `https://${event.headers?.host || "yourdomain.com"}`;
    const adminUrl = `${siteUrl}/admin-chat?cid=${encodeURIComponent(cid)}`;

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      body: `Conversation approved. Human takeover is now active.\nOpen admin chat: ${adminUrl}`,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Server error: ${String(error)}`,
    };
  }
};
