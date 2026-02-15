"use client";

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useDeleteTask, useTasks, useUpdateTask } from "../hooks/use-tasks";
import type { TaskType } from "../schemas/task.schema";

const col = createColumnHelper<TaskType>();

const statusColors = {
	todo: "bg-zinc-600",
	in_progress: "bg-yellow-600",
	done: "bg-green-600",
} as const;

const priorityColors = {
	low: "text-zinc-400",
	medium: "text-yellow-400",
	high: "text-red-400",
} as const;

export function TaskTable() {
	const t = useTranslations("tasks");
	const { data: tasks = [], isLoading } = useTasks();
	const updateTask = useUpdateTask();
	const deleteTask = useDeleteTask();

	const columns = [
		col.accessor("title", {
			header: () => t("taskTitle"),
			cell: (info) => <span className="font-medium">{info.getValue()}</span>,
		}),
		col.accessor("priority", {
			header: () => t("priority"),
			cell: (info) => (
				<span className={`text-xs font-semibold ${priorityColors[info.getValue()]}`}>
					{t(`priorities.${info.getValue()}`)}
				</span>
			),
		}),
		col.accessor("status", {
			header: () => t("status"),
			cell: (info) => {
				const status = info.getValue();
				return (
					<select
						value={status}
						onChange={(e) => {
							updateTask.mutate(
								{ id: info.row.original.id, status: e.target.value as TaskType["status"] },
								{ onSuccess: () => toast.success("Status updated") },
							);
						}}
						className={`rounded-md px-2 py-1 text-xs font-medium text-white ${statusColors[status]} border-0 focus:ring-2 focus:ring-blue-500`}
					>
						<option value="todo">{t("statuses.todo")}</option>
						<option value="in_progress">{t("statuses.in_progress")}</option>
						<option value="done">{t("statuses.done")}</option>
					</select>
				);
			},
		}),
		col.display({
			id: "actions",
			header: () => t("actions"),
			cell: (info) => (
				<button
					type="button"
					onClick={() => {
						deleteTask.mutate(info.row.original.id, {
							onSuccess: () => toast.success("Task deleted"),
						});
					}}
					className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-400/10 transition-colors"
				>
					{t("delete")}
				</button>
			),
		}),
	];

	const table = useReactTable({
		data: tasks,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	if (isLoading) {
		return <div className="text-center text-zinc-400 py-8">Loading...</div>;
	}

	if (tasks.length === 0) {
		return <div className="text-center text-zinc-500 py-8">{t("noTasks")}</div>;
	}

	return (
		<div className="overflow-hidden rounded-xl border border-zinc-700">
			<table className="w-full">
				<thead className="bg-zinc-800/50">
					{table.getHeaderGroups().map((hg) => (
						<tr key={hg.id}>
							{hg.headers.map((header) => (
								<th
									key={header.id}
									className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400"
								>
									{flexRender(header.column.columnDef.header, header.getContext())}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					<AnimatePresence>
						{table.getRowModel().rows.map((row) => (
							<motion.tr
								key={row.id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 20 }}
								className="border-t border-zinc-700/50 hover:bg-zinc-800/30 transition-colors"
							>
								{row.getVisibleCells().map((cell) => (
									<td key={cell.id} className="px-4 py-3 text-sm text-zinc-200">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</motion.tr>
						))}
					</AnimatePresence>
				</tbody>
			</table>
		</div>
	);
}
