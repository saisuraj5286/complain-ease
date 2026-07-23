import { relations } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  pgEnum,
  text,
  pgTable,
  boolean,
} from "drizzle-orm/pg-core";

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

export const complaintEventType = pgEnum("complaint_event_type", [
  "created",
  "status_changed",
  "commented",
]);

export const notificationType = pgEnum("notification_type", [
  "status_changed",
  "new_comment",
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

export const users = pgTable("user", {
	id: text("id").primaryKey(),
	// Email is the login identifier and the notification address.
	email: text("email").notNull().unique(),
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

// Two-way discussion thread attached to a complaint.
export const complaintComments = createTable(
  "complaint_comment",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    complaintId: d
      .integer()
      .notNull()
      .references(() => complaints.id, { onDelete: "cascade" }),
    authorId: d
      .text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    body: d.text().notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
  }),
  (t) => [index("comment_complaint_idx").on(t.complaintId)],
);

// Append-only audit/history of everything that happens to a complaint; drives
// the timeline on the detail page.
export const complaintEvents = createTable(
  "complaint_event",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    complaintId: d
      .integer()
      .notNull()
      .references(() => complaints.id, { onDelete: "cascade" }),
    actorId: d
      .text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: complaintEventType().notNull(),
    fromStatus: complaintStatus(),
    toStatus: complaintStatus(),
    note: d.text(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
  }),
  (t) => [index("event_complaint_idx").on(t.complaintId)],
);

// In-app notifications delivered to a single recipient.
export const notifications = createTable(
  "notification",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: d
      .text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    complaintId: d
      .integer()
      .references(() => complaints.id, { onDelete: "cascade" }),
    type: notificationType().notNull(),
    message: d.text().notNull(),
    read: boolean().default(false).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
  }),
  (t) => [index("notification_user_read_idx").on(t.userId, t.read)],
);

// Relations. `complaints.filedBy` holds a user id but has no DB-level FK, so it
// is wired up here manually for query-time joins.
export const usersRelations = relations(users, ({ many }) => ({
  complaints: many(complaints),
  comments: many(complaintComments),
  notifications: many(notifications),
}));

export const complaintsRelations = relations(complaints, ({ one, many }) => ({
  filer: one(users, {
    fields: [complaints.filedBy],
    references: [users.id],
  }),
  comments: many(complaintComments),
  events: many(complaintEvents),
}));

export const complaintCommentsRelations = relations(
  complaintComments,
  ({ one }) => ({
    complaint: one(complaints, {
      fields: [complaintComments.complaintId],
      references: [complaints.id],
    }),
    author: one(users, {
      fields: [complaintComments.authorId],
      references: [users.id],
    }),
  }),
);

export const complaintEventsRelations = relations(
  complaintEvents,
  ({ one }) => ({
    complaint: one(complaints, {
      fields: [complaintEvents.complaintId],
      references: [complaints.id],
    }),
    actor: one(users, {
      fields: [complaintEvents.actorId],
      references: [users.id],
    }),
  }),
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  complaint: one(complaints, {
    fields: [notifications.complaintId],
    references: [complaints.id],
  }),
}));