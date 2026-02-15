"use client";

import { addMonths, endOfMonth, format, isSameDay, startOfMonth, subMonths } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { useEvents } from "../hooks/use-events";
import type { EventType } from "../schemas/event.schema";
import { DayDetail } from "./day-detail";
import { EventForm } from "./event-form";

const colorMap: Record<string, string> = {
	blue: "bg-accent",
	purple: "bg-purple-400",
	rose: "bg-rose-400",
	amber: "bg-amber-400",
	emerald: "bg-emerald-400",
	cyan: "bg-cyan-400",
};

export function CalendarView() {
	const t = useTranslations("calendar");
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [selectedDay, setSelectedDay] = useState<Date>(new Date());
	const [showForm, setShowForm] = useState(false);

	const from = startOfMonth(currentMonth).toISOString();
	const to = endOfMonth(currentMonth).toISOString();
	const { data: events = [] } = useEvents(from, to);

	// Group events by day
	const eventsByDay = useMemo(() => {
		const map = new Map<string, EventType[]>();
		for (const ev of events) {
			const key = format(new Date(ev.startAt), "yyyy-MM-dd");
			if (!map.has(key)) map.set(key, []);
			map.get(key)!.push(ev);
		}
		return map;
	}, [events]);

	const selectedDayKey = format(selectedDay, "yyyy-MM-dd");
	const selectedEvents = eventsByDay.get(selectedDayKey) || [];

	return (
		<div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
			{/* Calendar */}
			<div className="glass rounded-3xl p-6">
				{/* Month navigation */}
				<div className="flex items-center justify-between mb-6">
					<button
						type="button"
						onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
						className="p-2 rounded-xl hover:bg-surface-overlay/60 text-text-secondary hover:text-text-primary transition-colors"
					>
						<svg
							className="w-5 h-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
						</svg>
					</button>
					<h2 className="text-lg font-semibold text-text-primary">
						{format(currentMonth, "MMMM yyyy")}
					</h2>
					<button
						type="button"
						onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
						className="p-2 rounded-xl hover:bg-surface-overlay/60 text-text-secondary hover:text-text-primary transition-colors"
					>
						<svg
							className="w-5 h-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
						</svg>
					</button>
				</div>

				{/* Day picker grid */}
				<DayPicker
					mode="single"
					selected={selectedDay}
					onSelect={(day) => day && setSelectedDay(day)}
					month={currentMonth}
					onMonthChange={setCurrentMonth}
					showOutsideDays
					classNames={{
						months: "w-full",
						month_grid: "w-full border-collapse",
						weekdays: "flex",
						weekday:
							"flex-1 text-center text-xs font-medium text-text-muted uppercase tracking-wider pb-3",
						week: "flex",
						day: "flex-1 relative",
						day_button:
							"w-full aspect-square flex flex-col items-center justify-center rounded-2xl text-sm transition-all hover:bg-surface-overlay/40 focus:outline-none focus:ring-2 focus:ring-accent/30",
						selected: "!bg-accent/15 !text-accent font-semibold ring-2 ring-accent/30",
						today: "font-bold text-accent",
						outside: "text-text-muted/30",
						hidden: "invisible",
						nav: "hidden",
						month_caption: "hidden",
					}}
					components={{
						DayButton: ({ day, ...props }) => {
							const key = format(day.date, "yyyy-MM-dd");
							const dayEvents = eventsByDay.get(key) || [];
							const isSelected = isSameDay(day.date, selectedDay);
							return (
								<button {...props}>
									<span>{day.date.getDate()}</span>
									{dayEvents.length > 0 && (
										<span className="flex gap-0.5 mt-0.5">
											{dayEvents.slice(0, 3).map((ev) => (
												<span
													key={ev.id}
													className={`h-1 w-1 rounded-full ${colorMap[ev.color] || "bg-accent"} ${isSelected ? "opacity-100" : "opacity-70"}`}
												/>
											))}
										</span>
									)}
								</button>
							);
						},
					}}
				/>
			</div>

			{/* Right panel — selected day */}
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-xs text-text-muted uppercase tracking-wider">
							{format(selectedDay, "EEEE")}
						</p>
						<p className="text-2xl font-bold text-text-primary">{format(selectedDay, "d MMM")}</p>
					</div>
					<button
						type="button"
						onClick={() => setShowForm(true)}
						className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 active:scale-[0.97]"
					>
						+ {t("addEvent")}
					</button>
				</div>

				<DayDetail events={selectedEvents} />

				{/* Event form modal */}
				<AnimatePresence>
					{showForm && <EventForm defaultDate={selectedDay} onClose={() => setShowForm(false)} />}
				</AnimatePresence>
			</div>
		</div>
	);
}
