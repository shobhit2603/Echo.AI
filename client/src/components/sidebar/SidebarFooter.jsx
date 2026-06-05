import ThemeSelector from "./ThemeSelector";
import UserProfile from "./UserProfile";

export default function SidebarFooter() {
  return (
    <div className="p-4 pb-[calc(max(env(safe-area-inset-bottom),16px))] flex flex-col gap-3 shrink-0">
      <ThemeSelector />
      <UserProfile />
    </div>
  );
}
