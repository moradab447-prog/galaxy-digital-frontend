import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "Galaxy Digital — Électroménager Agadir",
  description: "Livraison partout au Maroc, paiement à la livraison",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <Header />
          <AuthModal />
          <main>{children}</main>
          <WhatsAppButton />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
