import { index, pgTableCreator, pgEnum } from "drizzle-orm/pg-core";

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
