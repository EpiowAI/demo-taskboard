import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
	// Turbopack is default in dev via --turbopack flag
};

export default withNextIntl(nextConfig);
