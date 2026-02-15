"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import type { TaskType } from "../schemas/task.schema";
import { useUpdateTask, useDeleteTask } from "../hooks/use-tasks";

const priorityConfig = {
	low: { label: "Low", color: "text-text-muted", bg: "bg-text-muted/10" },
	medium: { label: "Med", color: "text-warning", bg: "bg-warning/10" },
	high: { label: "High", color: "text-danger", bg: "bg-danger/10" },
} as const;

const nextStatus = {
	todo: "in_progress",
	in_progress: "done",
	done: "todo",
} as const;

export function TaskCard({ task }: { task: TaskType }) {
	const t = useTranslations("tasks");
	const updateTask = useUpdateTask();
	const deleteTask = useDeleteTask();
	const priority = priorityConfig[task.priority];

	return (
		<motion.div
			layout
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
			whileHover={{ y: -1 }}
			className="group relative rounded-xl bg-surface-overlay/50 border border-border-subtle/20 p-3.5 hover:border-border-subtle/50 transition-colors cursor-default"
		>
			{/* Priority badge */}
			<div className="flex items-center justify-between mb-2">
				<span className={`text-[10px] font-semibold uppercase tracking-widest ${priority.color} ${priority.bg} rounded-md px-1.5 py-0.5`}>
					{t(`priorities.${task.priority}`)}
				</span>
				<button
					type="button"
					onClick={() =>
						deleteTask.mutate(task.id, {
							onSuccess: () => toast.success("Task removed"),
						})
					}
					className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-danger text-xs p-0.5"
					aria-label={t("delete")}
				>
					<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
						<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			{/* Title */}
			<p className="text-sm font-medium text-text-primary leading-snug mb-3">
				{task.title}
			</p>
			{task.description && (
				<p className="text-xs text-text-muted line-clamp-2 mb-3">{task.description}</p>
			)}

			{/* Move action */}
			<button
				type="button"
				onClick={() =>
					updateTask.mutate(
						{ id: task.id, status: nextStatus[task.status as keyof typeof nextStatus] },
						{ onSuccess: () => toast.success("Moved!") },
					)
				}
				className="w-full text-center text-[11px] font-medium text-accent/70 hover:text-accent bg-accent/[0.04] hover:bg-accent/[0.08] rounded-lg py-1.5 transition-colors"
			>
				{task.status === "done"
					? "↺ Reopen"
					: task.status === "in_progress"
						? "✓ Complete"
						: "→ Start"}
			</button>
		</motion.div>
	);
}
