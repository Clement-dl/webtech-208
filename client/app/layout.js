import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RequireAuth from "@/components/RequireAuth";
import Nav from "@/components/Nav";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "Alt-Endings",
  description: "Réécris la fin. Vote pour la meilleure.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-black text-neutral-100`}>
        <div className="max-w-3xl mx-auto px-4 py-6">
          <header className="mb-4">
            <h1 className="text-3xl font-semibold">Alt-Endings</h1>
            <Nav />
            <hr className="border-neutral-600 mt-2" />
          </header>

          <RequireAuth>
            <main className="min-h-[60vh]">{children}</main>
          </RequireAuth>

          <footer className="mt-10 text-sm text-neutral-400">
            © {new Date().getFullYear()} Alt-Endings
          </footer>
        </div>
      </body>
    </html>
  );
}
