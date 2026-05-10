const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export async function fetchSidebarChatsApi() {
  const res = await fetch(`${API_URL}/api/chat`, {
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
  const res = await fetch(`${API_URL}/api/chat/${chatId}`, {
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
  const res = await fetch(`${API_URL}/api/chat/${chatId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to delete chat");
  }

  return await res.json();
}