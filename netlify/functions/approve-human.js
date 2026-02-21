import {
  consumeApprovalToken,
  createAdminSessionToken,
  setConversationStatus,
} from "./lib/conversationStore.js";

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

    const params = new URLSearchParams(event.queryStringParameters || {});
    const cid = params.get("cid");
    const approvalToken = params.get("at");

    if (!cid) {
      return { statusCode: 400, body: "Missing cid" };
    }

    if (!(await consumeApprovalToken(cid, approvalToken || ""))) {
      return { statusCode: 403, body: "Forbidden" };
    }

    await setConversationStatus(cid, "human_active");
    const adminSessionToken = await createAdminSessionToken(cid);
    const siteUrl =
      env.SITE_URL ||
      `https://${event.headers?.host || "yourdomain.com"}`;
    const adminUrl = `${siteUrl}/admin-chat?cid=${encodeURIComponent(
      cid
    )}&adminToken=${encodeURIComponent(adminSessionToken)}`;

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
