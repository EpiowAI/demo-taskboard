"use client";

import { AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import type { EventType } from "../schemas/event.schema";
import { EventCard } from "./event-card";

export function DayDetail({ events }: { events: EventType[] }) {
	const t = useTranslations("calendar");

	if (events.length === 0) {
		return (
			<div className="flex-1 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-subtle/30 py-16 text-center">
				<div className="text-3xl mb-3">📅</div>
				<p className="text-sm text-text-muted">{t("noEvents")}</p>
				<p className="text-xs text-text-muted/60 mt-1">{t("clickToAdd")}</p>
			</div>
		);
	}

	return (
		<div className="flex-1 space-y-2.5 overflow-y-auto">
			<AnimatePresence mode="popLayout">
				{events
					.sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
					.map((event) => (
						<EventCard key={event.id} event={event} />
					))}
			</AnimatePresence>
		</div>
	);
}
