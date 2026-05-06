import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "Galaxy Digital — Électroménager Agadir",
  description: "Électroménager, smartphones et plus à Agadir. Livraison partout au Maroc, paiement à la livraison (COD).",
  openGraph: {
    title: "Galaxy Digital — Électroménager Agadir",
    description: "Électroménager, smartphones et plus à Agadir. Livraison partout au Maroc, paiement à la livraison (COD).",
    url: "https://electromenager-agadir.ma",
    siteName: "Galaxy Digital",
    images: [
      {
        url: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Galaxy Digital — Électroménager Agadir",
      },
    ],
    locale: "fr_MA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Galaxy Digital — Électroménager Agadir",
    description: "Livraison partout au Maroc, paiement à la livraison.",
    images: ["https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=1200&h=630&q=80"],
  },
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
