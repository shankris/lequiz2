import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";

import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
// import Sidebar from "@/components/layout/Sidebar/Sidebar";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata = {
  title: "Le Quiz",
  description: "Rapid French Language Learning",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${montserrat.variable} ${openSans.variable}`}>
        <Header />

        <div className='app-shell'>
          {/* <Sidebar /> */}
          <main className='app-main'>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
