"use client";

import { addMonths, endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import {
	useCreateEvent,
	useDeleteEvent,
	useEvents,
	useUpdateEvent,
} from "@/features/calendar/hooks/use-events";
import type { CreateEventInput, EventType } from "@/features/calendar/schemas/event.schema";
import { DayDetail } from "./day-detail";
import { getColorClasses } from "./event-card";
import { EventForm } from "./event-form";

export function CalendarView() {
	const t = useTranslations("calendar");
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
	const [formOpen, setFormOpen] = useState(false);
	const [editEvent, setEditEvent] = useState<EventType | null>(null);

	const from = startOfMonth(currentMonth).toISOString();
	const to = endOfMonth(currentMonth).toISOString();
	const { data: events = [], isLoading } = useEvents(from, to);

	const createMutation = useCreateEvent();
	const updateMutation = useUpdateEvent();
	const deleteMutation = useDeleteEvent();

	// Map days to their event colors for dots
	const dayEventMap = useMemo(() => {
		const map = new Map<string, string[]>();
		for (const event of events) {
			const key = format(new Date(event.startAt), "yyyy-MM-dd");
			const colors = map.get(key) ?? [];
			if (!colors.includes(event.color)) colors.push(event.color);
			map.set(key, colors);
		}
		return map;
	}, [events]);

	const handleDayClick = useCallback((day: Date) => {
		setSelectedDate(day);
	}, []);

	const handleAddEvent = useCallback(() => {
		setEditEvent(null);
		setFormOpen(true);
	}, []);

	const handleEditEvent = useCallback((event: EventType) => {
		setEditEvent(event);
		setFormOpen(true);
	}, []);

	const handleDeleteEvent = useCallback(
		(id: string) => {
			deleteMutation.mutate(id);
		},
		[deleteMutation],
	);

	const handleFormSubmit = useCallback(
		(data: CreateEventInput) => {
			if (editEvent) {
				updateMutation.mutate(
					{ id: editEvent.id, ...data },
					{ onSuccess: () => setFormOpen(false) },
				);
			} else {
				createMutation.mutate(data, {
					onSuccess: () => setFormOpen(false),
				});
			}
		},
		[editEvent, createMutation, updateMutation],
	);

	const handlePrevMonth = () => setCurrentMonth((prev) => subMonths(prev, 1));
	const handleNextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1));
	const handleToday = () => {
		const today = new Date();
		setCurrentMonth(today);
		setSelectedDate(today);
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
			{/* Calendar panel */}
			<div className="glass rounded-3xl p-6">
				{/* Month navigation */}
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold text-text-primary">
						{format(currentMonth, "MMMM yyyy")}
					</h2>
					<div className="flex items-center gap-1">
						<button
							type="button"
							onClick={handleToday}
							className="rounded-lg px-2.5 py-1 text-xs font-medium text-accent hover:bg-accent/10 transition-colors"
						>
							{t("today")}
						</button>
						<button
							type="button"
							onClick={handlePrevMonth}
							className="rounded-lg p-1.5 text-text-muted hover:text-text-primary hover:bg-surface-overlay transition-colors"
							aria-label="Previous month"
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
								<path d="m15 18-6-6 6-6" />
							</svg>
						</button>
						<button
							type="button"
							onClick={handleNextMonth}
							className="rounded-lg p-1.5 text-text-muted hover:text-text-primary hover:bg-surface-overlay transition-colors"
							aria-label="Next month"
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
								<path d="m9 18 6-6-6-6" />
							</svg>
						</button>
					</div>
				</div>

				{/* Calendar grid */}
				<DayPicker
					mode="single"
					month={currentMonth}
					onMonthChange={setCurrentMonth}
					selected={selectedDate}
					onSelect={(day) => day && handleDayClick(day)}
					showOutsideDays
					fixedWeeks
					classNames={{
						root: "w-full",
						months: "w-full",
						month: "w-full",
						month_caption: "hidden",
						nav: "hidden",
						month_grid: "w-full border-collapse",
						weekdays: "flex w-full",
						weekday:
							"flex-1 text-center text-[11px] font-medium text-text-muted pb-2 uppercase tracking-wider",
						week: "flex w-full",
						day: "flex-1 relative",
						day_button:
							"w-full aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all duration-150 hover:bg-surface-overlay text-text-secondary font-medium",
						selected: "!bg-accent/15 !text-accent font-semibold ring-1 ring-accent/30",
						today: "!text-accent font-bold",
						outside: "!text-text-muted/40",
						disabled: "!text-text-muted/20",
					}}
					components={{
						DayButton: ({ day, ...props }) => {
							const key = format(day.date, "yyyy-MM-dd");
							const colors = dayEventMap.get(key);
							return (
								<button type="button" {...props}>
									<span>{day.date.getDate()}</span>
									{colors && colors.length > 0 && (
										<span className="absolute bottom-1 flex gap-0.5">
											{colors.slice(0, 3).map((color) => (
												<span
													key={color}
													className={`h-1 w-1 rounded-full ${getColorClasses(color).dot}`}
												/>
											))}
										</span>
									)}
								</button>
							);
						},
					}}
				/>

				{/* Loading */}
				{isLoading && (
					<div className="mt-4 flex justify-center">
						<div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
					</div>
				)}
			</div>

			{/* Day detail panel */}
			<div className="glass rounded-3xl p-6 min-h-[400px]">
				<AnimatePresence mode="wait">
					<DayDetail
						key={selectedDate.toISOString()}
						date={selectedDate}
						events={events}
						onAddEvent={handleAddEvent}
						onEditEvent={handleEditEvent}
						onDeleteEvent={handleDeleteEvent}
					/>
				</AnimatePresence>
			</div>

			{/* Event form modal */}
			<EventForm
				open={formOpen}
				onClose={() => {
					setFormOpen(false);
					setEditEvent(null);
				}}
				onSubmit={handleFormSubmit}
				initialDate={selectedDate}
				editEvent={editEvent}
				isPending={createMutation.isPending || updateMutation.isPending}
			/>
		</div>
	);
}
