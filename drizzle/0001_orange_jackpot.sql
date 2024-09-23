CREATE TABLE IF NOT EXISTS "expenses_expense" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" numeric(12, 2),
	"description" varchar(100),
	"tags" varchar(100),
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
DROP TABLE "expenses_post";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expenses_expense" ADD CONSTRAINT "expenses_expense_created_by_expenses_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."expenses_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "expenses_created_by_idx" ON "expenses_expense" USING btree ("created_by");