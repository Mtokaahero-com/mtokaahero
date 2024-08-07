import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/context";

const inter = Inter({ subsets: ["latin"] });
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "MtokaaHero",
  description: "A web application for boking a repair services for your car",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <Toaster
            richColors
            expand={true}
            position="top-center"
            className="font-primary"
          />
        </body>
      </html>
    </AuthProvider>
  );
}
