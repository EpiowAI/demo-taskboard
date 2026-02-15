import { z } from "zod";

export const TaskStatus = z.enum(["todo", "in_progress", "done"]);
export const TaskPriority = z.enum(["low", "medium", "high"]);

export const TaskSchema = z.object({
	id: z.string().uuid(),
	title: z.string().min(1, "Title is required"),
	description: z.string().nullable(),
	status: TaskStatus,
	priority: TaskPriority,
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
});

export const CreateTaskSchema = z.object({
	title: z.string().min(1, "Title is required").max(200),
	description: z.string().max(2000).optional(),
	priority: TaskPriority.default("medium"),
});

export const UpdateTaskSchema = z.object({
	title: z.string().min(1).max(200).optional(),
	description: z.string().max(2000).nullable().optional(),
	status: TaskStatus.optional(),
	priority: TaskPriority.optional(),
});

export type TaskType = z.infer<typeof TaskSchema>;
export type CreateTaskInput = z.input<typeof CreateTaskSchema>;
export type CreateTaskType = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskType = z.infer<typeof UpdateTaskSchema>;
