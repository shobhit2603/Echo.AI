export async function fetchSidebarChatsApi() {
  const res = await fetch("/api/chat", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch sidebar chats");
  }

  const data = await res.json();
  return data.chats;
}

export async function fetchChatHistoryApi(chatId) {
  const res = await fetch(`/api/chat/${chatId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch chat history");
  }

  const data = await res.json();
  return data.chat;
}

export async function deleteChatApi(chatId) {
  const res = await fetch(`/api/chat/${chatId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to delete chat");
  }

  return await res.json();
}