import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "abstracts" ADD COLUMN "authorization_id_number" varchar;
  ALTER TABLE "abstracts" ADD COLUMN "authorization_address" varchar;
  ALTER TABLE "abstracts" ADD COLUMN "authorization_phone" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "abstracts" DROP COLUMN "authorization_id_number";
  ALTER TABLE "abstracts" DROP COLUMN "authorization_address";
  ALTER TABLE "abstracts" DROP COLUMN "authorization_phone";`)
}
