"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateEventInput, EventType, UpdateEventType } from "../schemas/event.schema";

function eventsKey(from?: string, to?: string) {
	return ["events", { from, to }] as const;
}

export function useEvents(from: string, to: string) {
	return useQuery({
		queryKey: eventsKey(from, to),
		queryFn: async (): Promise<EventType[]> => {
			const res = await fetch(`/api/events?from=${from}&to=${to}`);
			const data = await res.json();
			return data.events;
		},
	});
}

export function useCreateEvent() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (input: CreateEventInput) => {
			const res = await fetch("/api/events", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(input),
			});
			return res.json() as Promise<EventType>;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
	});
}

export function useUpdateEvent() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, ...data }: UpdateEventType & { id: string }) => {
			const res = await fetch(`/api/events/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			return res.json() as Promise<EventType>;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
	});
}

export function useDeleteEvent() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			await fetch(`/api/events/${id}`, { method: "DELETE" });
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
	});
}
