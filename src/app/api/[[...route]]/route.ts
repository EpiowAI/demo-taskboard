import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { handle } from "hono/vercel";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import {
	CreateTaskSchema,
	TaskSchema,
	UpdateTaskSchema,
} from "@/features/tasks/schemas/task.schema";

const app = new OpenAPIHono().basePath("/api");

// ── List Tasks ──────────────────────────────────────────
const listRoute = createRoute({
	method: "get",
	path: "/tasks",
	responses: {
		200: {
			content: { "application/json": { schema: z.object({ tasks: z.array(TaskSchema) }) } },
			description: "List all tasks",
		},
	},
});

app.openapi(listRoute, async (c) => {
	const allTasks = await db.select().from(tasks).orderBy(tasks.createdAt);
	return c.json({ tasks: allTasks }, 200);
});

// ── Create Task ─────────────────────────────────────────
const createRoute_ = createRoute({
	method: "post",
	path: "/tasks",
	request: {
		body: { content: { "application/json": { schema: CreateTaskSchema } } },
	},
	responses: {
		201: {
			content: { "application/json": { schema: TaskSchema } },
			description: "Task created",
		},
	},
});

app.openapi(createRoute_, async (c) => {
	const body = c.req.valid("json");
	const [task] = await db.insert(tasks).values(body).returning();
	return c.json(task, 201);
});

// ── Update Task ─────────────────────────────────────────
const updateRoute = createRoute({
	method: "patch",
	path: "/tasks/{id}",
	request: {
		params: z.object({ id: z.string().uuid() }),
		body: { content: { "application/json": { schema: UpdateTaskSchema } } },
	},
	responses: {
		200: {
			content: { "application/json": { schema: TaskSchema } },
			description: "Task updated",
		},
	},
});

app.openapi(updateRoute, async (c) => {
	const { id } = c.req.valid("param");
	const body = c.req.valid("json");
	const [task] = await db
		.update(tasks)
		.set({ ...body, updatedAt: new Date() })
		.where(eq(tasks.id, id))
		.returning();
	return c.json(task, 200);
});

// ── Delete Task ─────────────────────────────────────────
const deleteRoute = createRoute({
	method: "delete",
	path: "/tasks/{id}",
	request: {
		params: z.object({ id: z.string().uuid() }),
	},
	responses: {
		204: { description: "Task deleted" },
	},
});

app.openapi(deleteRoute, async (c) => {
	const { id } = c.req.valid("param");
	await db.delete(tasks).where(eq(tasks.id, id));
	return c.body(null, 204);
});

// ── OpenAPI Doc ─────────────────────────────────────────
app.doc("/doc", {
	openapi: "3.1.0",
	info: { title: "Taskboard API", version: "0.1.0" },
});

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
