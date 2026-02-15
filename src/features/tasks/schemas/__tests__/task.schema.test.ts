import { describe, expect, test } from "bun:test";
import { CreateTaskSchema, UpdateTaskSchema } from "../task.schema";

describe("CreateTaskSchema", () => {
	test("validates valid input", () => {
		const result = CreateTaskSchema.safeParse({
			title: "Fix the bug",
			priority: "high",
		});
		expect(result.success).toBe(true);
	});

	test("rejects empty title", () => {
		const result = CreateTaskSchema.safeParse({ title: "" });
		expect(result.success).toBe(false);
	});

	test("defaults priority to medium", () => {
		const result = CreateTaskSchema.parse({ title: "Test task" });
		expect(result.priority).toBe("medium");
	});
});

describe("UpdateTaskSchema", () => {
	test("allows partial updates", () => {
		const result = UpdateTaskSchema.safeParse({ status: "done" });
		expect(result.success).toBe(true);
	});

	test("rejects invalid status", () => {
		const result = UpdateTaskSchema.safeParse({ status: "invalid" });
		expect(result.success).toBe(false);
	});
});
