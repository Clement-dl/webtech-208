import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "WebTech Blog",
  description: "Lab4 – Squelette Next.js + navigation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{ maxWidth: 820, margin: "0 auto", padding: "16px" }}
      >
        <h1>WebTech-208 – Blog</h1>
        <Nav />
        <hr />
        <main style={{ minHeight: "60vh" }}>{children}</main>
        <hr />
        <footer>{new Date().getFullYear()}</footer>
      </body>
    </html>
  );
}
