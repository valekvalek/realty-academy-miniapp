import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Realty Academy",
  description: "Интерактивная академия недвижимости внутри Telegram",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" />
      </head>
      <body>{children}</body>
    </html>
  );
}
