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
			initial={{ opacity: 0, y: -8 }}
			animate={{ opacity: 1, y: 0 }}
			onSubmit={onSubmit}
			className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-end"
		>
			<div className="flex-1 w-full">
				<label htmlFor="task-title" className="block text-xs font-medium text-text-secondary mb-1.5 pl-1">
					{t("taskTitle")}
				</label>
				<input
					id="task-title"
					{...register("title")}
					placeholder="What needs to be done?"
					autoComplete="off"
					className="w-full rounded-xl border border-border-subtle/40 bg-surface/60 px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/30 transition-all"
				/>
				{errors.title && (
					<p className="mt-1.5 text-xs text-danger pl-1">{errors.title.message}</p>
				)}
			</div>

			<div className="w-full sm:w-auto">
				<label htmlFor="task-priority" className="block text-xs font-medium text-text-secondary mb-1.5 pl-1">
					{t("priority")}
				</label>
				<select
					id="task-priority"
					{...register("priority")}
					className="w-full sm:w-auto rounded-xl border border-border-subtle/40 bg-surface/60 px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/30 transition-all appearance-none pr-8"
				>
					<option value="low">{t("priorities.low")}</option>
					<option value="medium">{t("priorities.medium")}</option>
					<option value="high">{t("priorities.high")}</option>
				</select>
			</div>

			<button
				type="submit"
				disabled={createTask.isPending}
				className="w-full sm:w-auto rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50 transition-all shadow-lg shadow-accent/20 hover:shadow-accent/30 active:scale-[0.98]"
			>
				{createTask.isPending ? (
					<span className="inline-flex items-center gap-1.5">
						<span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
						Creating...
					</span>
				) : (
					t("addTask")
				)}
			</button>
		</motion.form>
	);
}
