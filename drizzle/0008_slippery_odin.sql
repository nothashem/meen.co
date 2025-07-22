CREATE TABLE "candidate" (
	"id" text PRIMARY KEY NOT NULL,
	"jobPostId" text NOT NULL,
	"linkedInProfileId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "candidate" ADD CONSTRAINT "candidate_jobPostId_jobPost_id_fk" FOREIGN KEY ("jobPostId") REFERENCES "public"."jobPost"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidate" ADD CONSTRAINT "candidate_linkedInProfileId_linkedInProfile_id_fk" FOREIGN KEY ("linkedInProfileId") REFERENCES "public"."linkedInProfile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "candidate_jobPostId_idx" ON "candidate" USING btree ("jobPostId");--> statement-breakpoint
CREATE INDEX "candidate_linkedInProfileId_idx" ON "candidate" USING btree ("linkedInProfileId");