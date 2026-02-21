import {
  getConversationMessages,
  getConversationStatus,
} from "./lib/conversationStore.js";

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const readConversationId = (event) => {
  if (event.httpMethod === "GET") {
    return event.queryStringParameters?.conversationId || "";
  }

  try {
    const parsed = JSON.parse(event.body || "{}");
    return parsed?.conversationId || "";
  } catch {
    return "";
  }
};

export const handler = async (event) => {
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

  const conversationId = readConversationId(event);
  if (!conversationId || typeof conversationId !== "string") {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ message: "conversationId required" }),
    };
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      status: getConversationStatus(conversationId),
      messages: getConversationMessages(conversationId),
    }),
  };
};
