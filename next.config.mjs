/* next.config.mjs */

import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */

const withNextIntl = createNextIntlPlugin("./src/i18n/request.js");

const nextConfig = {
  /* config options here */
};

export default withNextIntl(nextConfig);
