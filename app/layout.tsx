import type { Metadata } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import { SiteChrome } from "@/components/SiteChrome";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import "./globals.css";

export const metadata: Metadata = {
  title: "FastDeal Rwanda | Sell your car faster, safely, smartly",
  description:
    "FastDeal Rwanda helps car owners sell faster with free valuation, verification, professional marketing, buyer screening, negotiation support, and closing assistance."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SiteChrome
            header={<SiteHeader />}
            footer={<SiteFooter />}
            whatsapp={<WhatsAppFloat />}
          >
            {children}
          </SiteChrome>
        </AuthProvider>
      </body>
    </html>
  );
}
