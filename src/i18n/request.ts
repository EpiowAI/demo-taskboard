import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
	const locale = (await requestLocale) || "en";

	// Merge per-feature message files
	const tasks = (await import(`./messages/${locale}/tasks/index.json`)).default;

	return {
		locale,
		messages: { tasks },
	};
});
