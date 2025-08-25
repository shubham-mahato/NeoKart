import "./global.css";
import Header from "../shared/widgets/header";
import { Poppins, Roboto } from "next/font/google";
export const metadata = {
  title: "NeoKart",
  description:
    "NeoKart is a multi-vendor e-commerce SaaS platform inspired by Shopify and Amazon, built with a Microservices Architecture to ensure scalability, modularity, and high availability. It enables entrepreneurs and businesses to seamlessly set up and manage their online stores while providing a unified marketplace experience for customers.",
};

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${poppins.variable}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
