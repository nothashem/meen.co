ALTER TABLE "linkedInProfile" RENAME COLUMN "url" TO "handle";--> statement-breakpoint
ALTER TABLE "linkedInProfile" DROP CONSTRAINT "linkedInProfile_url_unique";--> statement-breakpoint
ALTER TABLE "linkedInProfile" ADD CONSTRAINT "linkedInProfile_handle_unique" UNIQUE("handle");