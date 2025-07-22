ALTER TABLE "proxyCurlCache" RENAME TO "linkedInProfile";--> statement-breakpoint
ALTER TABLE "candidate" ADD COLUMN "linkedInProfileId" text NOT NULL;--> statement-breakpoint
CREATE INDEX "candidate_linkedInProfileId_idx" ON "candidate" USING hash ("linkedInProfileId");