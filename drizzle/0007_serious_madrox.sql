ALTER TABLE "linkedInProfile" ADD COLUMN "profileImageB64" text;--> statement-breakpoint
ALTER TABLE "linkedInProfile" ADD CONSTRAINT "linkedInProfile_url_unique" UNIQUE("url");