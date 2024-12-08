import { ThemeProvider } from "@/components/theme/theme-provider";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI-Powered Search Bar with Suggestions",
  description:
    "This project features an AI-powered search bar that provides intelligent suggestions, developed as part of an interview task.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
