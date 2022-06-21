module.exports = class Init1655830554126 {
  name = 'Init1655830554126'

  async up(db) {
    await db.query(`CREATE TABLE "account" ("id" character varying NOT NULL, "free" numeric NOT NULL, "reserved" numeric NOT NULL, "total" numeric NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "snapshot" ("id" character varying NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "holders_count" integer NOT NULL, "block_number" integer NOT NULL, CONSTRAINT "PK_47b29c1a6055220b1ebdafdf7b5" PRIMARY KEY ("id"))`)
  }

  async down(db) {
    await db.query(`DROP TABLE "account"`)
    await db.query(`DROP TABLE "snapshot"`)
  }
}
