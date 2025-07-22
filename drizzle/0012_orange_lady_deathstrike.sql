ALTER TABLE "jobPost" RENAME COLUMN "name" TO "title";--> statement-breakpoint
ALTER TABLE "jobPost" ADD COLUMN "department" text NOT NULL;--> statement-breakpoint
ALTER TABLE "jobPost" ADD COLUMN "location" text NOT NULL;--> statement-breakpoint
ALTER TABLE "jobPost" ADD COLUMN "type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "jobPost" ADD COLUMN "status" text NOT NULL;--> statement-breakpoint
ALTER TABLE "jobPost" ADD COLUMN "priority" text NOT NULL;--> statement-breakpoint
ALTER TABLE "jobPost" ADD COLUMN "salary" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "jobPost" ADD COLUMN "responsibilities" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "jobPost" ADD COLUMN "requirements" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "jobPost" ADD COLUMN "benefits" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "jobPost" ADD COLUMN "tech_stack" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "jobPost" ADD COLUMN "remote_policy" text NOT NULL;