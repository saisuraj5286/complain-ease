import { index, pgTableCreator, pgEnum, text, pgTable } from "drizzle-orm/pg-core";

/**
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `complain_ease_${name}`);

export const complaintCategory = pgEnum("complaint_category", [
  "on_campus",
  "hostel",
  "transport",
  "ragging",
  "other",
]);

export const complaintPriority = pgEnum("complaint_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

export const complaintStatus = pgEnum("complaint_status", [
  "pending",
  "in_progress",
  "resolved",
  "rejected",
]);

export const userRole = pgEnum("user_role", ["student", "admin"]);

export const complaints = createTable(
  "complaint",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    title: d.varchar({ length: 256 }).notNull(),
    description: d.text().notNull(),
    category: complaintCategory().notNull(),
    priority: complaintPriority().default("medium").notNull(),
    status: complaintStatus().default("pending").notNull(),
    mediaUrl: d.varchar({ length: 1024 }),
    filedBy: d.varchar({ length: 256 }).notNull(),
    filedAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    resolvedAt: d.timestamp({ withTimezone: true }),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("category_idx").on(t.category),
    index("status_idx").on(t.status),
    index("filed_by_idx").on(t.filedBy),
  ],
);

export const users = pgTable("user", {
	id: text("id").primaryKey(),
	username: text("username").notNull().unique(),
	roll_no: text("roll_no").notNull().unique(),
	password_hash: text("password_hash").notNull(),
	role: userRole("role").default("student").notNull(),
});

// Sessions table - for Lucia auth
export const sessions = createTable(
  "session",
  (d) => ({
    id: d.text().primaryKey(),
    userId: d.text().notNull().references(() => users.id, { onDelete: "cascade" }),
    expiresAt: d.timestamp({ withTimezone: true, mode: "date" }).notNull(),
  }),
);