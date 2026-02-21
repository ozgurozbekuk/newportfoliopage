import {
  bindParticipantToken,
  getConversationStatus,
  hasAdminAccess,
  hasParticipantAccess,
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

const readPayload = (event) => {
  if (event.httpMethod === "GET") {
    return {
      conversationId: event.queryStringParameters?.conversationId || "",
      participantToken: event.queryStringParameters?.participantToken || "",
      adminToken:
        event.queryStringParameters?.adminToken ||
        event.headers?.["x-admin-token"] ||
        "",
    };
  }

  try {
    const parsed = JSON.parse(event.body || "{}");
    return {
      conversationId: parsed?.conversationId || "",
      participantToken: parsed?.participantToken || "",
      adminToken:
        parsed?.adminToken ||
        event.headers?.["x-admin-token"] ||
        event.headers?.["X-Admin-Token"] ||
        "",
    };
  } catch {
    return { conversationId: "", participantToken: "", adminToken: "" };
  }
};

export const handler = async (event) => {
  const env = getEnv();
  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": getCorsOrigin(event, env),
    "Access-Control-Allow-Headers": "Content-Type, x-admin-token",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "GET" && event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Only GET or POST" }),
    };
  }

  const { conversationId, participantToken, adminToken } = readPayload(event);
  if (!conversationId || typeof conversationId !== "string") {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ message: "conversationId required" }),
    };
  }

  await bindParticipantToken(conversationId, participantToken || "");
  const canAccess =
    (await hasParticipantAccess(conversationId, participantToken || "")) ||
    (await hasAdminAccess(conversationId, adminToken || ""));

  if (!canAccess) {
    return {
      statusCode: 403,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Forbidden" }),
    };
  }

  const status = await getConversationStatus(conversationId);

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ status }),
  };
};
