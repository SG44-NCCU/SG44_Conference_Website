import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "full_papers" (
      "id" serial PRIMARY KEY NOT NULL,
      "uploaded_by_id" integer,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "url" varchar,
      "thumbnail_u_r_l" varchar,
      "filename" varchar,
      "mime_type" varchar,
      "filesize" numeric,
      "width" numeric,
      "height" numeric,
      "focal_x" numeric,
      "focal_y" numeric
    );

    -- Add Full Paper Column to Abstracts
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'abstracts' AND column_name = 'full_paper_id') THEN
        ALTER TABLE "abstracts" ADD COLUMN "full_paper_id" integer;
        ALTER TABLE "abstracts" ADD CONSTRAINT "abstracts_full_paper_id_full_papers_id_fk" FOREIGN KEY ("full_paper_id") REFERENCES "public"."full_papers"("id") ON DELETE set null ON UPDATE no action;
        CREATE INDEX "abstracts_full_paper_idx" ON "abstracts" USING btree ("full_paper_id");
      END IF;
    END $$;

    -- Add Full Paper Fields to Abstracts Settings
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'abstracts_settings' AND column_name = 'full_paper_submission_open') THEN
        ALTER TABLE "abstracts_settings" ADD COLUMN "full_paper_submission_open" boolean DEFAULT true;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'abstracts_settings' AND column_name = 'full_paper_deadline') THEN
        ALTER TABLE "abstracts_settings" ADD COLUMN "full_paper_deadline" timestamp(3) with time zone;
      END IF;
    END $$;

    -- Linking from full_papers to users
    ALTER TABLE "full_papers" ADD CONSTRAINT "full_papers_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;

    -- Indexes for full_papers
    CREATE INDEX IF NOT EXISTS "full_papers_updated_at_idx" ON "full_papers" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "full_papers_created_at_idx" ON "full_papers" USING btree ("created_at");
    CREATE UNIQUE INDEX IF NOT EXISTS "full_papers_filename_idx" ON "full_papers" USING btree ("filename");
    CREATE INDEX IF NOT EXISTS "full_papers_uploaded_by_idx" ON "full_papers" USING btree ("uploaded_by_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "abstracts" DROP COLUMN IF EXISTS "full_paper_id";
    ALTER TABLE "abstracts_settings" DROP COLUMN IF EXISTS "full_paper_submission_open";
    ALTER TABLE "abstracts_settings" DROP COLUMN IF EXISTS "full_paper_deadline";
    DROP TABLE IF EXISTS "full_papers" CASCADE;
  `)
}
