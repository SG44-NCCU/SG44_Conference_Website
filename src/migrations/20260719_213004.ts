import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_sessions_date" AS ENUM('2026-08-20', '2026-08-21');
  CREATE TYPE "public"."enum_sessions_type" AS ENUM('oral', 'poster', 'special', 'keynote', 'other');
  ALTER TYPE "public"."enum_registrations_ticket_type" ADD VALUE 'senior';
  ALTER TYPE "public"."enum_registrations_ticket_type" ADD VALUE 'vip';
  ALTER TYPE "public"."enum_registrations_ticket_type" ADD VALUE 'sponsor';
  ALTER TYPE "public"."enum_registrations_ticket_type" ADD VALUE 'government';
  ALTER TYPE "public"."enum_registrations_participant_role" ADD VALUE 'sponsor' BEFORE 'other';
  ALTER TYPE "public"."enum_registrations_participant_role" ADD VALUE 'government' BEFORE 'other';
  CREATE TABLE "sessions_papers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"presentation_order" numeric NOT NULL,
  	"abstract_id" integer,
  	"abstract_id_override" numeric,
  	"title_override" varchar,
  	"presenter_name" varchar,
  	"notes" varchar
  );
  
  CREATE TABLE "sessions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"session_code" varchar,
  	"title" varchar NOT NULL,
  	"date" "enum_sessions_date" NOT NULL,
  	"start_time" varchar NOT NULL,
  	"end_time" varchar NOT NULL,
  	"room" varchar NOT NULL,
  	"chair_name" varchar,
  	"type" "enum_sessions_type" DEFAULT 'oral',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "abstracts" ALTER COLUMN "sub_topic" SET DATA TYPE text;
  DROP TYPE "public"."enum_abstracts_sub_topic";
  CREATE TYPE "public"."enum_abstracts_sub_topic" AS ENUM('topic-1', 'topic-2', 'topic-3', 'topic-4', 'topic-5', 'topic-6', 'topic-7', 'topic-8', 'topic-9');
  ALTER TABLE "abstracts" ALTER COLUMN "sub_topic" SET DATA TYPE "public"."enum_abstracts_sub_topic" USING "sub_topic"::"public"."enum_abstracts_sub_topic";
  ALTER TABLE "registrations" ALTER COLUMN "payment_account_last5" DROP NOT NULL;
  ALTER TABLE "registrations" ALTER COLUMN "payment_date" DROP NOT NULL;
  ALTER TABLE "abstracts" ALTER COLUMN "review_status" SET DEFAULT 'accepted';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "sessions_id" integer;
  ALTER TABLE "sessions_papers" ADD CONSTRAINT "sessions_papers_abstract_id_abstracts_id_fk" FOREIGN KEY ("abstract_id") REFERENCES "public"."abstracts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sessions_papers" ADD CONSTRAINT "sessions_papers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "sessions_papers_order_idx" ON "sessions_papers" USING btree ("_order");
  CREATE INDEX "sessions_papers_parent_id_idx" ON "sessions_papers" USING btree ("_parent_id");
  CREATE INDEX "sessions_papers_abstract_idx" ON "sessions_papers" USING btree ("abstract_id");
  CREATE INDEX "sessions_updated_at_idx" ON "sessions" USING btree ("updated_at");
  CREATE INDEX "sessions_created_at_idx" ON "sessions" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sessions_fk" FOREIGN KEY ("sessions_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_sessions_id_idx" ON "payload_locked_documents_rels" USING btree ("sessions_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_abstracts_sub_topic" ADD VALUE 'topic-10';
  ALTER TABLE "sessions_papers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sessions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "sessions_papers" CASCADE;
  DROP TABLE "sessions" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_sessions_fk";
  
  ALTER TABLE "registrations" ALTER COLUMN "ticket_type" SET DATA TYPE text;
  DROP TYPE "public"."enum_registrations_ticket_type";
  CREATE TYPE "public"."enum_registrations_ticket_type" AS ENUM('early-bird-student', 'early-bird-regular', 'standard-student', 'standard-regular');
  ALTER TABLE "registrations" ALTER COLUMN "ticket_type" SET DATA TYPE "public"."enum_registrations_ticket_type" USING "ticket_type"::"public"."enum_registrations_ticket_type";
  ALTER TABLE "registrations" ALTER COLUMN "participant_role" SET DATA TYPE text;
  DROP TYPE "public"."enum_registrations_participant_role";
  CREATE TYPE "public"."enum_registrations_participant_role" AS ENUM('presenter', 'keynote', 'host', 'discussant', 'attendee', 'staff', 'vip', 'other');
  ALTER TABLE "registrations" ALTER COLUMN "participant_role" SET DATA TYPE "public"."enum_registrations_participant_role" USING "participant_role"::"public"."enum_registrations_participant_role";
  DROP INDEX "payload_locked_documents_rels_sessions_id_idx";
  ALTER TABLE "registrations" ALTER COLUMN "payment_account_last5" SET NOT NULL;
  ALTER TABLE "registrations" ALTER COLUMN "payment_date" SET NOT NULL;
  ALTER TABLE "abstracts" ALTER COLUMN "review_status" SET DEFAULT 'pending';
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "sessions_id";
  DROP TYPE "public"."enum_sessions_date";
  DROP TYPE "public"."enum_sessions_type";`)
}
