/* src/i18n/request.js */

import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  const messages = {
    header: (await import(`./${locale}/header.json`)).default,
    footer: (await import(`./${locale}/footer.json`)).default,
    navigation: (await import(`./${locale}/navigation.json`)).default,
    home: (await import(`./${locale}/home.json`)).default,
    learn: (await import(`./${locale}/learn.json`)).default,

    learning: {
      nounGender: (await import(`./${locale}/learning/noun-gender.json`)).default,
    },

    practice: (await import(`./${locale}/practice.json`)).default,
    progress: (await import(`./${locale}/progress.json`)).default,
  };

  return {
    locale,
    messages,
  };
});
