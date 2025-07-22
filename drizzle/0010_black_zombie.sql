CREATE TABLE "waitlist" (
	"email" text PRIMARY KEY NOT NULL,
	"firstName" text,
	"lastName" text,
	"company" text,
	"companySize" text,
	"role" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
