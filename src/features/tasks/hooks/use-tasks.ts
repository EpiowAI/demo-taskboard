"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateTaskType, TaskType, UpdateTaskType } from "../schemas/task.schema";

const TASKS_KEY = ["tasks"] as const;

async function fetchTasks(): Promise<TaskType[]> {
	const res = await fetch("/api/tasks");
	const data = await res.json();
	return data.tasks;
}

export function useTasks() {
	return useQuery({ queryKey: TASKS_KEY, queryFn: fetchTasks });
}

export function useCreateTask() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (input: CreateTaskType) => {
			const res = await fetch("/api/tasks", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(input),
			});
			return res.json() as Promise<TaskType>;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: TASKS_KEY }),
	});
}

export function useUpdateTask() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, ...data }: UpdateTaskType & { id: string }) => {
			const res = await fetch(`/api/tasks/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			return res.json() as Promise<TaskType>;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: TASKS_KEY }),
	});
}

export function useDeleteTask() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			await fetch(`/api/tasks/${id}`, { method: "DELETE" });
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: TASKS_KEY }),
	});
}
