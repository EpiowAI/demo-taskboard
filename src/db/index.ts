import { neon } from "@neondatabase/serverless";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let _db: NeonHttpDatabase<typeof schema> | null = null;

export function getDb() {
	if (!_db) {
		const url = process.env.DATABASE_URL;
		if (!url) throw new Error("DATABASE_URL is required");
		_db = drizzle({ client: neon(url), schema });
	}
	return _db;
}

/** @deprecated Use getDb() for lazy init */
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
	get(_, prop) {
		return (getDb() as any)[prop];
	},
});
