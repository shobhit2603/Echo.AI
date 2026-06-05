import Image from "next/image";
import { SignOutIcon } from "@phosphor-icons/react";
import useAuth from "@/features/auth/useAuth";

export default function UserProfile() {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center justify-between p-3 bg-background rounded-xl">
      <div className="flex items-center gap-3 overflow-hidden">
        {user?.profilePicture ? (
          <Image
            src={user.profilePicture}
            width={32}
            height={32}
            alt={user.name}
            className="w-8 h-8 rounded-full bg-zinc-200 shrink-0 object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-xs shrink-0">
            {user?.name?.charAt(0) || "U"}
          </div>
        )}
        <span className="text-sm font-medium truncate text-foreground">
          {user?.name || "User"}
        </span>
      </div>
      <button
        onClick={logout}
        className="p-2 text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors shrink-0 cursor-pointer"
        title="Logout"
      >
        <SignOutIcon weight="bold" className="w-5 h-5" />
      </button>
    </div>
  );
}
