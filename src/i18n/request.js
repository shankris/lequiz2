/* src/i18n/request.js */

import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  const messages = {
    common: (await import(`./${locale}/common.json`)).default,
    header: (await import(`./${locale}/header.json`)).default,
    navigation: (await import(`./${locale}/navigation.json`)).default,
    home: (await import(`./${locale}/home.json`)).default,
  };

  return {
    locale,
    messages,
  };
});
