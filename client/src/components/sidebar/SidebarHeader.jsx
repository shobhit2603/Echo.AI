import { ShootingStarIcon, PlusIcon, SidebarSimpleIcon } from "@phosphor-icons/react";

export default function SidebarHeader({ clearCurrentChat, setIsOpen }) {
  return (
    <div className="p-4 pt-[calc(max(env(safe-area-inset-top),16px))] flex items-center justify-between">
      <button
        onClick={() => {
          clearCurrentChat();
          if (window.innerWidth < 768) setIsOpen(false);
        }}
        className="flex-1 flex items-center justify-between p-2 bg-background hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-xl transition-colors group mr-2 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg group-hover:scale-105 transition-transform">
            <ShootingStarIcon weight="fill" className="text-white h-5 w-5" />
          </div>
          <span className="font-medium text-foreground tracking-tight">Echo.AI</span>
        </div>
        <PlusIcon weight="bold" className="text-muted w-4 h-4" />
      </button>
      <button
        onClick={() => setIsOpen(false)}
        className="p-2 text-muted hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-xl transition-colors shrink-0 cursor-pointer"
        title="Close Sidebar"
      >
        <SidebarSimpleIcon weight="bold" className="w-5 h-5" />
      </button>
    </div>
  );
}
