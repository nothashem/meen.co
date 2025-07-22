CREATE TABLE "chat" (
	"id" text PRIMARY KEY NOT NULL,
	"jobPostId" text NOT NULL,
	"title" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chatMessage" (
	"id" text PRIMARY KEY NOT NULL,
	"chatId" text NOT NULL,
	"role" text NOT NULL,
	"content" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "toolcall" (
	"id" text PRIMARY KEY NOT NULL,
	"chatMessageId" text NOT NULL,
	"name" text NOT NULL,
	"args" jsonb,
	"result" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_jobPostId_jobPost_id_fk" FOREIGN KEY ("jobPostId") REFERENCES "public"."jobPost"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chatMessage" ADD CONSTRAINT "chatMessage_chatId_chat_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."chat"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "toolcall" ADD CONSTRAINT "toolcall_chatMessageId_chatMessage_id_fk" FOREIGN KEY ("chatMessageId") REFERENCES "public"."chatMessage"("id") ON DELETE cascade ON UPDATE no action;