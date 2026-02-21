const DEFAULT_STATUS = "ai_active";

const getMap = () => {
  if (!globalThis.__conversationStore) {
    globalThis.__conversationStore = new Map();
  }
  return globalThis.__conversationStore;
};

const nowIso = () => new Date().toISOString();

export const getConversation = (conversationId) => {
  const store = getMap();
  const existing = store.get(conversationId);

  if (existing) {
    return existing;
  }

  const created = {
    id: conversationId,
    status: DEFAULT_STATUS,
    messages: [],
    updatedAt: nowIso(),
  };

  store.set(conversationId, created);
  return created;
};

export const getConversationStatus = (conversationId) => {
  return getConversation(conversationId).status;
};

export const setConversationStatus = (conversationId, status) => {
  const convo = getConversation(conversationId);
  convo.status = status;
  convo.updatedAt = nowIso();
  return convo;
};

export const appendMessage = (conversationId, message) => {
  const convo = getConversation(conversationId);
  convo.messages.push({
    ...message,
    createdAt: nowIso(),
  });
  convo.updatedAt = nowIso();
  return convo;
};

export const getConversationMessages = (conversationId) => {
  return getConversation(conversationId).messages;
};
