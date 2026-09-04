import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EU4Food Safety — Sistemi i Menaxhimit",
  description: "Sistemi i menaxhimit të projektit EU4Food Safety (Shqipëri)",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sq" className="h-full antialiased">
      <body className="min-h-full flex flex-col text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
