import { Inter } from "next/font/google";
import "@/app/globals.css";
import Navbar from "./components/home/Navbar";
import AuthProvider from "./components/auth/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PropertyPulse | Find The Perfect Rental Property",
  description: "Find your dream rental  property ",
  keyword: "rental,property,find property, find rentals",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
        <main>
          <Navbar />
          {children}
        </main>
        </AuthProvider>
      </body>
    </html>
  );
}
