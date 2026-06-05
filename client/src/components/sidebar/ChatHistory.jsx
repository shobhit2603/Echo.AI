import ChatHistoryItem from "./ChatHistoryItem";

export default function ChatHistory({
  sidebarChats,
  currentChat,
  activeDropdown,
  setActiveDropdown,
  loadChat,
  setIsOpen,
  togglePinChat,
  removeChat,
}) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-4 px-2">
        Recent Chats
      </p>

      {sidebarChats.length === 0 ? (
        <p className="text-sm text-muted px-2 font-light">No conversations yet.</p>
      ) : (
        sidebarChats.map((chat) => (
          <ChatHistoryItem
            key={chat._id}
            chat={chat}
            currentChat={currentChat}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
            loadChat={loadChat}
            setIsOpen={setIsOpen}
            togglePinChat={togglePinChat}
            removeChat={removeChat}
          />
        ))
      )}
    </div>
  );
}
