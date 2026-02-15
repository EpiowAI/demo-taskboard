import { describe, expect, test } from "bun:test";
import { CreateEventSchema, UpdateEventSchema } from "../event.schema";

describe("CreateEventSchema", () => {
	test("validates valid input", () => {
		const result = CreateEventSchema.safeParse({
			title: "Team standup",
			startAt: "2026-03-01T09:00:00.000Z",
			endAt: "2026-03-01T09:30:00.000Z",
			color: "blue",
		});
		expect(result.success).toBe(true);
	});

	test("rejects empty title", () => {
		const result = CreateEventSchema.safeParse({
			title: "",
			startAt: "2026-03-01T09:00:00.000Z",
			endAt: "2026-03-01T09:30:00.000Z",
		});
		expect(result.success).toBe(false);
	});

	test("defaults color to blue", () => {
		const result = CreateEventSchema.parse({
			title: "Lunch",
			startAt: "2026-03-01T12:00:00.000Z",
			endAt: "2026-03-01T13:00:00.000Z",
		});
		expect(result.color).toBe("blue");
	});

	test("rejects missing start time", () => {
		const result = CreateEventSchema.safeParse({
			title: "Test",
			endAt: "2026-03-01T10:00:00.000Z",
		});
		expect(result.success).toBe(false);
	});
});

describe("UpdateEventSchema", () => {
	test("allows partial updates", () => {
		const result = UpdateEventSchema.safeParse({ color: "rose" });
		expect(result.success).toBe(true);
	});

	test("rejects invalid color", () => {
		const result = UpdateEventSchema.safeParse({ color: "rainbow" });
		expect(result.success).toBe(false);
	});
});
