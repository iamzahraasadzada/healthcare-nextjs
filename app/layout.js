import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CarePulse",
  description:
    "A healthcare patient management System designed to streamline patient registration, appointment scheduling, and medical records management for healthcare providers.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
``;
