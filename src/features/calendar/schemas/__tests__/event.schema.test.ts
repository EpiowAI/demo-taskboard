import { describe, expect, test } from "bun:test";
import { CreateEventSchema, EventSchema, UpdateEventSchema } from "../event.schema";

describe("EventSchema", () => {
	test("parses a valid event", () => {
		const data = {
			id: "550e8400-e29b-41d4-a716-446655440000",
			title: "Team standup",
			description: null,
			startAt: "2025-03-01T09:00:00.000Z",
			endAt: "2025-03-01T09:30:00.000Z",
			color: "blue",
			createdAt: "2025-03-01T00:00:00.000Z",
			updatedAt: "2025-03-01T00:00:00.000Z",
		};
		const result = EventSchema.safeParse(data);
		expect(result.success).toBe(true);
	});

	test("rejects invalid uuid", () => {
		const data = {
			id: "not-a-uuid",
			title: "Test",
			description: null,
			startAt: "2025-03-01T09:00:00.000Z",
			endAt: "2025-03-01T09:30:00.000Z",
			color: "blue",
			createdAt: "2025-03-01T00:00:00.000Z",
			updatedAt: "2025-03-01T00:00:00.000Z",
		};
		const result = EventSchema.safeParse(data);
		expect(result.success).toBe(false);
	});
});

describe("CreateEventSchema", () => {
	test("parses valid input", () => {
		const data = {
			title: "Meeting",
			startAt: "2025-03-01T09:00:00.000Z",
			endAt: "2025-03-01T10:00:00.000Z",
		};
		const result = CreateEventSchema.safeParse(data);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.color).toBe("blue");
		}
	});

	test("rejects empty title", () => {
		const data = {
			title: "",
			startAt: "2025-03-01T09:00:00.000Z",
			endAt: "2025-03-01T10:00:00.000Z",
		};
		const result = CreateEventSchema.safeParse(data);
		expect(result.success).toBe(false);
	});

	test("accepts all valid colors", () => {
		for (const color of ["blue", "purple", "rose", "amber", "emerald", "cyan"]) {
			const data = {
				title: "Test",
				startAt: "2025-03-01T09:00:00.000Z",
				endAt: "2025-03-01T10:00:00.000Z",
				color,
			};
			const result = CreateEventSchema.safeParse(data);
			expect(result.success).toBe(true);
		}
	});

	test("rejects invalid color", () => {
		const data = {
			title: "Test",
			startAt: "2025-03-01T09:00:00.000Z",
			endAt: "2025-03-01T10:00:00.000Z",
			color: "red",
		};
		const result = CreateEventSchema.safeParse(data);
		expect(result.success).toBe(false);
	});

	test("rejects missing start time", () => {
		const result = CreateEventSchema.safeParse({
			title: "Test",
			endAt: "2025-03-01T10:00:00.000Z",
		});
		expect(result.success).toBe(false);
	});
});

describe("UpdateEventSchema", () => {
	test("allows partial update", () => {
		const result = UpdateEventSchema.safeParse({ title: "New title" });
		expect(result.success).toBe(true);
	});

	test("allows empty object", () => {
		const result = UpdateEventSchema.safeParse({});
		expect(result.success).toBe(true);
	});

	test("rejects invalid color", () => {
		const result = UpdateEventSchema.safeParse({ color: "invalid" });
		expect(result.success).toBe(false);
	});
});
