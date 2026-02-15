"use client";

import { format, isSameDay } from "date-fns";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useTranslations } from "next-intl";
import type { EventType } from "@/features/calendar/schemas/event.schema";
import { EventCard } from "./event-card";

interface DayDetailProps {
	date: Date;
	events: EventType[];
	onAddEvent: () => void;
	onEditEvent: (event: EventType) => void;
	onDeleteEvent: (id: string) => void;
}

export function DayDetail({
	date,
	events,
	onAddEvent,
	onEditEvent,
	onDeleteEvent,
}: DayDetailProps) {
	const t = useTranslations("calendar");
	const isToday = isSameDay(date, new Date());
	const dayEvents = events
		.filter((e) => {
			const s = new Date(e.startAt);
			return isSameDay(s, date);
		})
		.sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

	return (
		<m.div
			key={date.toISOString()}
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
			className="flex flex-col"
		>
			{/* Day header */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-3">
					<span className="text-3xl font-bold text-text-primary tabular-nums">
						{format(date, "d")}
					</span>
					<div>
						<p className="text-sm font-medium text-text-primary">{format(date, "EEEE")}</p>
						<p className="text-xs text-text-muted">{format(date, "MMMM yyyy")}</p>
					</div>
					{isToday && (
						<span className="ml-1 rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
							{t("today")}
						</span>
					)}
				</div>
				<button
					type="button"
					onClick={onAddEvent}
					className="flex items-center gap-2 rounded-xl bg-accent/10 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/20 transition-colors"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						role="img"
						aria-hidden="true"
					>
						<path d="M12 5v14" />
						<path d="M5 12h14" />
					</svg>
					{t("addEvent")}
				</button>
			</div>

			{/* Events list */}
			<div className="flex flex-col gap-3">
				<AnimatePresence mode="popLayout">
					{dayEvents.length > 0 ? (
						dayEvents.map((event) => (
							<EventCard
								key={event.id}
								event={event}
								onEdit={onEditEvent}
								onDelete={onDeleteEvent}
							/>
						))
					) : (
						<m.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="flex flex-col items-center justify-center py-16 text-text-muted"
						>
							<svg
								width="48"
								height="48"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="mb-4 opacity-30"
								role="img"
								aria-hidden="true"
							>
								<rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
								<line x1="16" x2="16" y1="2" y2="6" />
								<line x1="8" x2="8" y1="2" y2="6" />
								<line x1="3" x2="21" y1="10" y2="10" />
							</svg>
							<p className="text-sm">{t("noEvents")}</p>
							<button
								type="button"
								onClick={onAddEvent}
								className="mt-3 text-xs text-accent hover:text-accent-hover transition-colors"
							>
								{t("addEvent")}
							</button>
						</m.div>
					)}
				</AnimatePresence>
			</div>
		</m.div>
	);
}
