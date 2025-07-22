CREATE TABLE "proxyCurlCache" (
	"id" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"data" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"expiresAt" timestamp NOT NULL
);
