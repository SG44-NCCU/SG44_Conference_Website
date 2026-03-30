import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_registrations_needs_certification" AS ENUM('no', 'yes');
  CREATE TYPE "public"."enum_registrations_certification_type" AS ENUM('civilServant', 'technician');
  ALTER TABLE "registrations" ADD COLUMN "needs_certification" "enum_registrations_needs_certification" DEFAULT 'no' NOT NULL;
  ALTER TABLE "registrations" ADD COLUMN "certification_type" "enum_registrations_certification_type";
  ALTER TABLE "registrations" ADD COLUMN "cert_name" varchar;
  ALTER TABLE "registrations" ADD COLUMN "cert_id_number" varchar;
  ALTER TABLE "registrations" ADD COLUMN "cert_dob" timestamp(3) with time zone;
  ALTER TABLE "registrations" ADD COLUMN "cert_organization" varchar;
  ALTER TABLE "registrations" ADD COLUMN "cert_phone" varchar;
  ALTER TABLE "registrations" ADD COLUMN "tech_name" varchar;
  ALTER TABLE "registrations" ADD COLUMN "tech_id_number" varchar;
  ALTER TABLE "registrations" ADD COLUMN "tech_specialty" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "registrations" DROP COLUMN "needs_certification";
  ALTER TABLE "registrations" DROP COLUMN "certification_type";
  ALTER TABLE "registrations" DROP COLUMN "cert_name";
  ALTER TABLE "registrations" DROP COLUMN "cert_id_number";
  ALTER TABLE "registrations" DROP COLUMN "cert_dob";
  ALTER TABLE "registrations" DROP COLUMN "cert_organization";
  ALTER TABLE "registrations" DROP COLUMN "cert_phone";
  ALTER TABLE "registrations" DROP COLUMN "tech_name";
  ALTER TABLE "registrations" DROP COLUMN "tech_id_number";
  ALTER TABLE "registrations" DROP COLUMN "tech_specialty";
  DROP TYPE "public"."enum_registrations_needs_certification";
  DROP TYPE "public"."enum_registrations_certification_type";`)
}
