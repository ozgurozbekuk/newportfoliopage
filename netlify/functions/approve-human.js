import {
  consumeApprovalToken,
  createAdminSessionToken,
  getConversation,
  setConversationStatus,
} from "./lib/conversationStore.js";

const getEnv = () =>
  globalThis?.process?.env ||
  (typeof import.meta !== "undefined" && import.meta?.env) ||
  {};

const getBaseSiteUrl = (event, env) => {
  const raw = env.SITE_URL || `https://${event.headers?.host || "yourdomain.com"}`;
  return raw.replace(/\/+$/, "");
};

export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Only GET" };
  }

  try {
    const env = getEnv();

    const params = new URLSearchParams(event.queryStringParameters || {});
    const cid = params.get("cid");
    const approvalToken = params.get("at");

    if (!cid) {
      return { statusCode: 400, body: "Missing cid" };
    }

    let convo = await getConversation(cid);
    const consumed = await consumeApprovalToken(cid, approvalToken || "");

    if (!consumed) {
      if (convo.status !== "human_active") {
        return {
          statusCode: 403,
          body: "Forbidden: invalid or already-used approval token",
        };
      }

      if (!convo.adminSessionToken) {
        await createAdminSessionToken(cid);
        convo = await getConversation(cid);
      }
    } else {
      await setConversationStatus(cid, "human_active");
      await createAdminSessionToken(cid);
      convo = await getConversation(cid);
    }

    const siteUrl = getBaseSiteUrl(event, env);
    const adminUrl = `${siteUrl}/admin-chat?cid=${encodeURIComponent(
      cid
    )}&adminToken=${encodeURIComponent(convo.adminSessionToken || "")}`;

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
