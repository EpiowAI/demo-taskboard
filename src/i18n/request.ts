import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
	const locale = (await requestLocale) || "en";

	const calendar = (await import(`./messages/${locale}/calendar/index.json`)).default;

	return {
		locale,
		messages: { calendar },
	};
});
