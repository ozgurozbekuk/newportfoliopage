import { getStore } from "@netlify/blobs";

const DEFAULT_STATUS = "ai_active";
const MEMORY_STORE = new Map();

const token = () =>
  `${Math.random().toString(36).slice(2)}${Math.random()
    .toString(36)
    .slice(2)}`;

const nowIso = () => new Date().toISOString();
const toKey = (conversationId) => `conversation:${conversationId}`;

const createConversationRecord = (conversationId) => ({
  id: conversationId,
  status: DEFAULT_STATUS,
  messages: [],
  updatedAt: nowIso(),
  participantToken: "",
  adminSessionToken: "",
  approvalToken: "",
});

const getBlobStore = () => getStore("chat-conversations");

const readFromPersistentStore = async (conversationId) => {
  try {
    const store = getBlobStore();
    return await store.get(toKey(conversationId), { type: "json" });
  } catch {
    return null;
  }
};

const writeToPersistentStore = async (conversationId, value) => {
  try {
    const store = getBlobStore();
    await store.setJSON(toKey(conversationId), value);
    return true;
  } catch {
    return false;
  }
};

export const getConversation = async (conversationId) => {
  const memoryExisting = MEMORY_STORE.get(conversationId);
  if (memoryExisting) {
    return memoryExisting;
  }

  const persistent = await readFromPersistentStore(conversationId);
  if (persistent) {
    MEMORY_STORE.set(conversationId, persistent);
    return persistent;
  }

  const created = createConversationRecord(conversationId);
  MEMORY_STORE.set(conversationId, created);
  await writeToPersistentStore(conversationId, created);
  return created;
};

const saveConversation = async (conversation) => {
  MEMORY_STORE.set(conversation.id, conversation);
  await writeToPersistentStore(conversation.id, conversation);
  return conversation;
};

export const getConversationStatus = async (conversationId) => {
  return (await getConversation(conversationId)).status;
};

export const setConversationStatus = async (conversationId, status) => {
  const convo = await getConversation(conversationId);
  convo.status = status;
  convo.updatedAt = nowIso();
  return saveConversation(convo);
};

export const bindParticipantToken = async (conversationId, participantToken) => {
  const convo = await getConversation(conversationId);
  if (!participantToken) return convo;
  if (!convo.participantToken) {
    convo.participantToken = participantToken;
    convo.updatedAt = nowIso();
    await saveConversation(convo);
  }
  return convo;
};

export const hasParticipantAccess = async (conversationId, participantToken) => {
  const convo = await getConversation(conversationId);
  if (!convo.participantToken) return false;
  return convo.participantToken === participantToken;
};

export const createApprovalToken = async (conversationId) => {
  const convo = await getConversation(conversationId);
  convo.approvalToken = token();
  convo.updatedAt = nowIso();
  await saveConversation(convo);
  return convo.approvalToken;
};

export const consumeApprovalToken = async (conversationId, approvalToken) => {
  const convo = await getConversation(conversationId);
  if (!approvalToken || !convo.approvalToken) return false;
  if (convo.approvalToken !== approvalToken) return false;
  convo.approvalToken = "";
  convo.updatedAt = nowIso();
  await saveConversation(convo);
  return true;
};

export const createAdminSessionToken = async (conversationId) => {
  const convo = await getConversation(conversationId);
  convo.adminSessionToken = token();
  convo.updatedAt = nowIso();
  await saveConversation(convo);
  return convo.adminSessionToken;
};

export const hasAdminAccess = async (conversationId, adminSessionToken) => {
  const convo = await getConversation(conversationId);
  if (!convo.adminSessionToken) return false;
  return convo.adminSessionToken === adminSessionToken;
};

export const appendMessage = async (conversationId, message) => {
  const convo = await getConversation(conversationId);
  convo.messages.push({
    ...message,
    createdAt: nowIso(),
  });
  convo.updatedAt = nowIso();
  return saveConversation(convo);
};

export const getConversationMessages = async (conversationId) => {
  return (await getConversation(conversationId)).messages;
};
