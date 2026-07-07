import "./globals.css";
import { Inter } from "next/font/google";
import QueryProvider from "../providers/QueryProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "ReeRoute — AI-Powered Customer Support Dashboard",
  description: "Advanced AI assistance for support agents",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex bg-slate-50 text-brand-black">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
