import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WhaleRadar",
  description: "Пульт відстеження ончейн-угод китів",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className="antialiased">{children}</body>
    </html>
  );
}
