ALTER TABLE "jobPost" ALTER COLUMN "department" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "jobPost" ALTER COLUMN "location" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "jobPost" ALTER COLUMN "type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "jobPost" ALTER COLUMN "status" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "jobPost" ALTER COLUMN "priority" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "jobPost" ALTER COLUMN "salary" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "jobPost" ALTER COLUMN "responsibilities" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "jobPost" ALTER COLUMN "requirements" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "jobPost" ALTER COLUMN "benefits" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "jobPost" ALTER COLUMN "tech_stack" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "jobPost" ALTER COLUMN "remote_policy" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "jobPost" ALTER COLUMN "vector" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "candidate" ADD COLUMN "eagerlyAdded" boolean DEFAULT false NOT NULL;