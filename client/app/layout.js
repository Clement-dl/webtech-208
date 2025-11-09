import "./globals.css";
import Nav from "@/components/Nav";

export const metadata = {
  title: "Alt-Endings",
  description: "Réécris la fin de tes œuvres préférées",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-black text-white">
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-neutral-800">
            <Nav />
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-neutral-800 mt-8 py-4 text-center text-xs text-neutral-500">
            © 2025 Alt-Endings
          </footer>
        </div>
      </body>
    </html>
  );
}
