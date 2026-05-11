const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export async function fetchSidebarChatsApi() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API_URL}/api/chat`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch sidebar chats");
  }

  const data = await res.json();
  return data.chats;
}

export async function fetchChatHistoryApi(chatId) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API_URL}/api/chat/${chatId}`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch chat history");
  }

  const data = await res.json();
  return data.chat;
}

export async function deleteChatApi(chatId) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API_URL}/api/chat/${chatId}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to delete chat");
  }

  return await res.json();
}

export async function togglePinChatApi(chatId, isPinned) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API_URL}/api/chat/${chatId}/pin`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ isPinned }),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to toggle pin status");
  }

  return await res.json();
}