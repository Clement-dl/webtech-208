import "./globals.css";
import Nav from "@/components/Nav";

export const metadata = {
  title: "Alt-Endings",
  description: "Réécris la fin de tes œuvres préférées",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-[var(--background)] text-[var(--foreground)] font-sans">
        <div className="min-h-screen flex flex-col">
          
          <header className="sticky top-0 z-50">
            <Nav />
          </header>
      
          <main className="flex-1 container mx-auto px-4 py-10 md:py-8 sm:py-6">
            {children}
          </main>

          <footer className="mt-10 py-6 text-center text-sm text-neutral-400 rounded-t-2xl">
            © 2025 Alt-Endings
          </footer>
        </div>
      </body>
    </html>
  );
}
