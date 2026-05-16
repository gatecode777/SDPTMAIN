import { Providers } from "@/components/Providers";
import Header from "@/components/frontend/Header";
import Footer from "@/components/frontend/Footer";
import ScrollToTop from "@/components/frontend/ScrollToTop";

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="frontend-body">
      <Providers>
        <ScrollToTop />
        <Header />
        <main>{children}</main>
        <Footer />
      </Providers>
    </div>
  );
}
