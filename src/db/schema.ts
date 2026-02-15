import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const eventColorEnum = pgEnum("event_color", [
	"blue",
	"purple",
	"rose",
	"amber",
	"emerald",
	"cyan",
]);

export const events = pgTable("events", {
	id: uuid("id").defaultRandom().primaryKey(),
	title: text("title").notNull(),
	description: text("description"),
	startAt: timestamp("start_at", { withTimezone: true }).notNull(),
	endAt: timestamp("end_at", { withTimezone: true }).notNull(),
	color: eventColorEnum("color").notNull().default("blue"),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type CalendarEvent = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
