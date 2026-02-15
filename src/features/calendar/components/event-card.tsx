"use client";

import { format } from "date-fns";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useDeleteEvent } from "../hooks/use-events";
import type { EventType } from "../schemas/event.schema";

const colorAccent: Record<string, { border: string; bg: string; text: string }> = {
	blue: { border: "border-l-blue-400", bg: "bg-blue-400/8", text: "text-blue-400" },
	purple: { border: "border-l-purple-400", bg: "bg-purple-400/8", text: "text-purple-400" },
	rose: { border: "border-l-rose-400", bg: "bg-rose-400/8", text: "text-rose-400" },
	amber: { border: "border-l-amber-400", bg: "bg-amber-400/8", text: "text-amber-400" },
	emerald: { border: "border-l-emerald-400", bg: "bg-emerald-400/8", text: "text-emerald-400" },
	cyan: { border: "border-l-cyan-400", bg: "bg-cyan-400/8", text: "text-cyan-400" },
};

export function EventCard({ event }: { event: EventType }) {
	const deleteEvent = useDeleteEvent();
	const colors = colorAccent[event.color] || colorAccent.blue;
	const start = new Date(event.startAt);
	const end = new Date(event.endAt);

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
			className={`group relative rounded-xl ${colors.bg} border-l-[3px] ${colors.border} p-3.5 hover:shadow-md transition-shadow cursor-default`}
		>
			<div className="flex items-start justify-between gap-2">
				<div className="flex-1 min-w-0">
					<p className="text-sm font-semibold text-text-primary truncate">{event.title}</p>
					<p className={`text-xs ${colors.text} font-medium mt-0.5`}>
						{format(start, "HH:mm")} — {format(end, "HH:mm")}
					</p>
					{event.description && (
						<p className="text-xs text-text-muted line-clamp-2 mt-1.5">{event.description}</p>
					)}
				</div>

				<button
					type="button"
					onClick={() =>
						deleteEvent.mutate(event.id, {
							onSuccess: () => toast.success("Event removed"),
						})
					}
					className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-surface-overlay/60 text-text-muted hover:text-danger shrink-0"
					aria-label="Delete"
				>
					<svg
						className="w-3.5 h-3.5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		</motion.div>
	);
}
