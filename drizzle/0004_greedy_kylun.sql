ALTER TABLE "linkedInProfile" ADD COLUMN "vector" vector(1536);--> statement-breakpoint
CREATE INDEX "linkedInProfile_embedding_idx" ON "linkedInProfile" USING hnsw ("vector" vector_cosine_ops);