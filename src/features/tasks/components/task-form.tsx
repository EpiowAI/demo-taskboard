"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreateTask } from "../hooks/use-tasks";
import { CreateTaskSchema, type CreateTaskInput } from "../schemas/task.schema";

export function TaskForm() {
	const t = useTranslations("tasks");
	const createTask = useCreateTask();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateTaskInput>({
		resolver: zodResolver(CreateTaskSchema),
		defaultValues: { title: "", priority: "medium" },
	});

	const onSubmit = handleSubmit(async (data) => {
		await createTask.mutateAsync(data);
		toast.success("Task created!");
		reset();
	});

	return (
		<motion.form
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			onSubmit={onSubmit}
			className="flex gap-3 items-end"
		>
			<div className="flex-1">
				<label htmlFor="task-title" className="block text-sm font-medium text-zinc-300 mb-1">
					{t("taskTitle")}
				</label>
				<input
					id="task-title"
					{...register("title")}
					placeholder="What needs doing?"
					className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				{errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
			</div>

			<div>
				<label htmlFor="task-priority" className="block text-sm font-medium text-zinc-300 mb-1">
					{t("priority")}
				</label>
				<select
					id="task-priority"
					{...register("priority")}
					className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="low">{t("priorities.low")}</option>
					<option value="medium">{t("priorities.medium")}</option>
					<option value="high">{t("priorities.high")}</option>
				</select>
			</div>

			<button
				type="submit"
				disabled={createTask.isPending}
				className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
			>
				{createTask.isPending ? "..." : t("addTask")}
			</button>
		</motion.form>
	);
}
