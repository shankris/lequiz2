/* src/app/[locale]/layout.js */

import { Montserrat, Open_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import "../globals.css";

import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";

// --------------------------------------------------
// Fonts
// --------------------------------------------------

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

// --------------------------------------------------
// Layout
// --------------------------------------------------

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${montserrat.variable} ${openSans.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <Header />

          <div className='app-shell'>
            {/* <Sidebar /> */}

            <main className='app-main'>{children}</main>

            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
