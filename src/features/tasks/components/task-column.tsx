"use client";

import { motion, AnimatePresence } from "motion/react";
import type { TaskType } from "../schemas/task.schema";
import { TaskCard } from "./task-card";

const statusStyle = {
	todo: { dot: "bg-text-muted", ring: "ring-text-muted/20" },
	in_progress: { dot: "bg-warning", ring: "ring-warning/20" },
	done: { dot: "bg-success", ring: "ring-success/20" },
} as const;

interface TaskColumnProps {
	status: "todo" | "in_progress" | "done";
	label: string;
	tasks: TaskType[];
}

export function TaskColumn({ status, label, tasks }: TaskColumnProps) {
	const style = statusStyle[status];

	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: status === "todo" ? 0 : status === "in_progress" ? 0.05 : 0.1 }}
			className="flex flex-col rounded-2xl bg-surface-raised/40 border border-border-subtle/30 p-4 min-h-[320px]"
		>
			{/* Column header */}
			<div className="flex items-center gap-2.5 mb-4 px-1">
				<span className={`h-2 w-2 rounded-full ${style.dot} ring-4 ${style.ring}`} />
				<span className="text-sm font-semibold text-text-primary">{label}</span>
				<span className="ml-auto text-xs font-medium text-text-muted tabular-nums bg-surface-overlay/60 rounded-full px-2 py-0.5">
					{tasks.length}
				</span>
			</div>

			{/* Cards */}
			<div className="flex-1 space-y-2.5 overflow-y-auto">
				<AnimatePresence mode="popLayout">
					{tasks.map((task) => (
						<TaskCard key={task.id} task={task} />
					))}
				</AnimatePresence>

				{tasks.length === 0 && (
					<div className="flex items-center justify-center h-24 text-xs text-text-muted/60 rounded-xl border border-dashed border-border-subtle/30">
						No tasks
					</div>
				)}
			</div>
		</motion.div>
	);
}
