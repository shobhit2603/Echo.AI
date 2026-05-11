import "./globals.css";
import { Outfit } from "next/font/google";
import { ReduxProvider } from "@/store/provider";
import AuthProvider from "@/features/auth/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

const outfit = Outfit({ subsets: ["latin"] });

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export const metadata = {
  title: "Echo.AI",
  description: "Your Personal AI Assistant - Learn, Create, and Explore",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`h-full antialiased ${outfit.className}`}>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <ThemeProvider>
          <ReduxProvider>
            <AuthProvider>{children}</AuthProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
