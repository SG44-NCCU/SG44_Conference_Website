import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ADD COLUMN "last_notification_checked" timestamp(3) with time zone;
  ALTER TABLE "abstracts" ADD COLUMN "authorization_agreed" boolean DEFAULT false NOT NULL;
  ALTER TABLE "abstracts" ADD COLUMN "authorization_date" timestamp(3) with time zone;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP COLUMN "last_notification_checked";
  ALTER TABLE "abstracts" DROP COLUMN "authorization_agreed";
  ALTER TABLE "abstracts" DROP COLUMN "authorization_date";`)
}
