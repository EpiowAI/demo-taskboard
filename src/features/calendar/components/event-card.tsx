"use client";

import { format } from "date-fns";
import * as m from "motion/react-m";
import { useTranslations } from "next-intl";
import type { EventType } from "@/features/calendar/schemas/event.schema";

const colorMap: Record<string, { dot: string; bg: string; border: string; text: string }> = {
	blue: {
		dot: "bg-[oklch(0.7_0.18_265)]",
		bg: "bg-[oklch(0.7_0.18_265/0.08)]",
		border: "border-[oklch(0.7_0.18_265/0.2)]",
		text: "text-[oklch(0.8_0.14_265)]",
	},
	purple: {
		dot: "bg-[oklch(0.65_0.2_300)]",
		bg: "bg-[oklch(0.65_0.2_300/0.08)]",
		border: "border-[oklch(0.65_0.2_300/0.2)]",
		text: "text-[oklch(0.78_0.14_300)]",
	},
	rose: {
		dot: "bg-[oklch(0.65_0.2_10)]",
		bg: "bg-[oklch(0.65_0.2_10/0.08)]",
		border: "border-[oklch(0.65_0.2_10/0.2)]",
		text: "text-[oklch(0.78_0.14_10)]",
	},
	amber: {
		dot: "bg-[oklch(0.78_0.15_80)]",
		bg: "bg-[oklch(0.78_0.15_80/0.08)]",
		border: "border-[oklch(0.78_0.15_80/0.2)]",
		text: "text-[oklch(0.85_0.12_80)]",
	},
	emerald: {
		dot: "bg-[oklch(0.72_0.17_155)]",
		bg: "bg-[oklch(0.72_0.17_155/0.08)]",
		border: "border-[oklch(0.72_0.17_155/0.2)]",
		text: "text-[oklch(0.82_0.12_155)]",
	},
	cyan: {
		dot: "bg-[oklch(0.75_0.14_200)]",
		bg: "bg-[oklch(0.75_0.14_200/0.08)]",
		border: "border-[oklch(0.75_0.14_200/0.2)]",
		text: "text-[oklch(0.85_0.1_200)]",
	},
};

export function getColorClasses(color: string) {
	return colorMap[color] ?? colorMap.blue;
}

interface EventCardProps {
	event: EventType;
	onEdit?: (event: EventType) => void;
	onDelete?: (id: string) => void;
}

export function EventCard({ event, onEdit, onDelete }: EventCardProps) {
	const t = useTranslations("calendar");
	const c = getColorClasses(event.color);
	const start = new Date(event.startAt);
	const end = new Date(event.endAt);

	return (
		<m.div
			layout
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -8, scale: 0.95 }}
			transition={{ type: "spring", stiffness: 400, damping: 30 }}
			className={`group relative rounded-2xl border ${c.border} ${c.bg} p-4 backdrop-blur-sm transition-colors hover:border-opacity-40`}
		>
			{/* Color accent line */}
			<div className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full ${c.dot}`} />

			<div className="ml-3">
				<div className="flex items-start justify-between gap-2">
					<h3 className="font-semibold text-text-primary text-sm leading-snug">{event.title}</h3>
					<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
						{onEdit && (
							<button
								type="button"
								onClick={() => onEdit(event)}
								className="rounded-lg p-1.5 text-text-muted hover:text-text-primary hover:bg-surface-overlay transition-colors"
								aria-label={t("editEvent")}
							>
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									role="img"
									aria-hidden="true"
								>
									<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
									<path d="m15 5 4 4" />
								</svg>
							</button>
						)}
						{onDelete && (
							<button
								type="button"
								onClick={() => onDelete(event.id)}
								className="rounded-lg p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
								aria-label={t("delete")}
							>
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									role="img"
									aria-hidden="true"
								>
									<path d="M3 6h18" />
									<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
									<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
								</svg>
							</button>
						)}
					</div>
				</div>

				{event.description && (
					<p className="mt-1 text-xs text-text-secondary line-clamp-2">{event.description}</p>
				)}

				<div className={`mt-2 flex items-center gap-1.5 text-xs ${c.text}`}>
					<svg
						width="12"
						height="12"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						role="img"
						aria-hidden="true"
					>
						<circle cx="12" cy="12" r="10" />
						<polyline points="12 6 12 12 16 14" />
					</svg>
					<span>
						{format(start, "HH:mm")} – {format(end, "HH:mm")}
					</span>
				</div>
			</div>
		</m.div>
	);
}
