"use client";

import { useTranslations } from "next-intl";
import { useTasks } from "../hooks/use-tasks";
import { TaskForm } from "./task-form";
import { TaskColumn } from "./task-column";
import type { TaskType } from "../schemas/task.schema";

const COLUMNS = ["todo", "in_progress", "done"] as const;

export function TaskBoard() {
	const t = useTranslations("tasks");
	const { data: tasks = [], isLoading } = useTasks();

	const grouped = COLUMNS.reduce(
		(acc, status) => {
			acc[status] = tasks.filter((t) => t.status === status);
			return acc;
		},
		{} as Record<string, TaskType[]>,
	);

	return (
		<div className="space-y-8">
			{/* Create task */}
			<TaskForm />

			{/* Kanban columns */}
			{isLoading ? (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{[0, 1, 2].map((i) => (
						<div
							key={i}
							className="h-64 rounded-2xl bg-surface-raised/50 animate-pulse border border-border-subtle/30"
						/>
					))}
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{COLUMNS.map((status) => (
						<TaskColumn
							key={status}
							status={status}
							label={t(`statuses.${status}`)}
							tasks={grouped[status] || []}
						/>
					))}
				</div>
			)}

			{/* Stats bar */}
			{!isLoading && tasks.length > 0 && (
				<div className="flex items-center justify-center gap-8 text-xs text-text-muted pt-4">
					<span>{tasks.length} total</span>
					<span className="h-3 w-px bg-border-subtle" />
					<span>{grouped.done?.length || 0} completed</span>
					<span className="h-3 w-px bg-border-subtle" />
					<span>
						{tasks.length > 0
							? Math.round(((grouped.done?.length || 0) / tasks.length) * 100)
							: 0}
						% done
					</span>
				</div>
			)}
		</div>
	);
}
