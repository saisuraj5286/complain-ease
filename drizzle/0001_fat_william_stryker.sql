CREATE TABLE "complain_ease_session" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"roll_no" text NOT NULL,
	"password_hash" text NOT NULL,
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_roll_no_unique" UNIQUE("roll_no")
);
--> statement-breakpoint
ALTER TABLE "complain_ease_session" ADD CONSTRAINT "complain_ease_session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public"."complain_ease_complaint" ALTER COLUMN "category" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."complaint_category";--> statement-breakpoint
CREATE TYPE "public"."complaint_category" AS ENUM('on_campus', 'hostel', 'transport', 'ragging', 'other');--> statement-breakpoint
ALTER TABLE "public"."complain_ease_complaint" ALTER COLUMN "category" SET DATA TYPE "public"."complaint_category" USING "category"::"public"."complaint_category";