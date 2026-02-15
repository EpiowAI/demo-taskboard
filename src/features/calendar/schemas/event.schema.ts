import { z } from "zod";

export const EventColor = z.enum(["blue", "purple", "rose", "amber", "emerald", "cyan"]);

export const EventSchema = z.object({
	id: z.string().uuid(),
	title: z.string(),
	description: z.string().nullable(),
	startAt: z.string().datetime(),
	endAt: z.string().datetime(),
	color: EventColor,
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
});

export const CreateEventSchema = z.object({
	title: z.string().min(1, "Title is required").max(200),
	description: z.string().max(2000).optional(),
	startAt: z.string().min(1, "Start time is required"),
	endAt: z.string().min(1, "End time is required"),
	color: EventColor.default("blue"),
});

export const UpdateEventSchema = z.object({
	title: z.string().min(1).max(200).optional(),
	description: z.string().max(2000).nullable().optional(),
	startAt: z.string().optional(),
	endAt: z.string().optional(),
	color: EventColor.optional(),
});

export type EventType = z.infer<typeof EventSchema>;
export type CreateEventInput = z.input<typeof CreateEventSchema>;
export type CreateEventType = z.infer<typeof CreateEventSchema>;
export type UpdateEventType = z.infer<typeof UpdateEventSchema>;
