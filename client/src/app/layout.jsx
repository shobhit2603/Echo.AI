import "./globals.css";
import { Outfit } from "next/font/google";
import { ReduxProvider } from "@/store/provider";
import AuthProvider from "@/features/auth/AuthProvider";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "Echo.AI",
  description: "Your Personal AI Assistant - Learn, Create, and Explore",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`h-full antialiased ${outfit.className}`}>
      <body className="min-h-full flex flex-col dark bg-background text-foreground">
        <ReduxProvider>
          <AuthProvider>{children}</AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
