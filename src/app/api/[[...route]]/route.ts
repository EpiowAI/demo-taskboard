import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { and, eq, gte, lte } from "drizzle-orm";
import { handle } from "hono/vercel";
import { db } from "@/db";
import { events } from "@/db/schema";
import {
	CreateEventSchema,
	EventSchema,
	UpdateEventSchema,
} from "@/features/calendar/schemas/event.schema";

const app = new OpenAPIHono().basePath("/api");

// ── List Events (with date range) ──────────────────────
const listRoute = createRoute({
	method: "get",
	path: "/events",
	request: {
		query: z.object({
			from: z.string().optional(),
			to: z.string().optional(),
		}),
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: z.object({ events: z.array(EventSchema) }),
				},
			},
			description: "List events",
		},
	},
});

app.openapi(listRoute, async (c) => {
	const { from, to } = c.req.valid("query");
	const conditions = [];
	if (from) conditions.push(gte(events.endAt, new Date(from)));
	if (to) conditions.push(lte(events.startAt, new Date(to)));

	const result = await db
		.select()
		.from(events)
		.where(conditions.length > 0 ? and(...conditions) : undefined)
		.orderBy(events.startAt);

	return c.json({ events: result }, 200);
});

// ── Create Event ────────────────────────────────────────
const createRoute_ = createRoute({
	method: "post",
	path: "/events",
	request: {
		body: {
			content: { "application/json": { schema: CreateEventSchema } },
		},
	},
	responses: {
		201: {
			content: { "application/json": { schema: EventSchema } },
			description: "Event created",
		},
	},
});

app.openapi(createRoute_, async (c) => {
	const body = c.req.valid("json");
	const [event] = await db
		.insert(events)
		.values({
			...body,
			startAt: new Date(body.startAt),
			endAt: new Date(body.endAt),
		})
		.returning();
	return c.json(event, 201);
});

// ── Update Event ────────────────────────────────────────
const updateRoute = createRoute({
	method: "patch",
	path: "/events/{id}",
	request: {
		params: z.object({ id: z.string().uuid() }),
		body: {
			content: { "application/json": { schema: UpdateEventSchema } },
		},
	},
	responses: {
		200: {
			content: { "application/json": { schema: EventSchema } },
			description: "Event updated",
		},
	},
});

app.openapi(updateRoute, async (c) => {
	const { id } = c.req.valid("param");
	const body = c.req.valid("json");
	const updates: Record<string, unknown> = { updatedAt: new Date() };
	if (body.title !== undefined) updates.title = body.title;
	if (body.description !== undefined) updates.description = body.description;
	if (body.color !== undefined) updates.color = body.color;
	if (body.startAt) updates.startAt = new Date(body.startAt);
	if (body.endAt) updates.endAt = new Date(body.endAt);

	const [event] = await db.update(events).set(updates).where(eq(events.id, id)).returning();
	return c.json(event, 200);
});

// ── Delete Event ────────────────────────────────────────
const deleteRoute = createRoute({
	method: "delete",
	path: "/events/{id}",
	request: {
		params: z.object({ id: z.string().uuid() }),
	},
	responses: {
		204: { description: "Event deleted" },
	},
});

app.openapi(deleteRoute, async (c) => {
	const { id } = c.req.valid("param");
	await db.delete(events).where(eq(events.id, id));
	return c.body(null, 204);
});

// ── OpenAPI Doc ─────────────────────────────────────────
app.doc("/doc", {
	openapi: "3.1.0",
	info: { title: "Calendar API", version: "0.1.0" },
});

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
