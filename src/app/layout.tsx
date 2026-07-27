import type { Metadata } from "next";
import { Outfit, Inter, Playfair_Display } from "next/font/google";
import { ProfileProvider } from "@/context/ProfileContext";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JodiMaker - Internal Matchmaker Dashboard",
  description: "Premium internal client management and compatibility engine matching dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fcfaf6]">
        <ProfileProvider>
          {children}
        </ProfileProvider>
      </body>
    </html>
  );
}
