import { useTranslations } from "next-intl";
import { CalendarView } from "@/features/calendar/components/calendar-view";

export default function HomePage() {
	const t = useTranslations("calendar");

	return (
		<main className="mx-auto max-w-6xl px-6 py-12">
			<header className="mb-10">
				<div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3.5 py-1.5 text-xs font-medium text-accent mb-4">
					<span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
					Live
				</div>
				<h1 className="text-4xl font-bold tracking-tight text-text-primary">{t("title")}</h1>
				<p className="mt-2 text-text-secondary text-lg">{t("subtitle")}</p>
			</header>
			<CalendarView />
		</main>
	);
}
