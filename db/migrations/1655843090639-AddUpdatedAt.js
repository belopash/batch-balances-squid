module.exports = class AddUpdatedAt1655843090639 {
  name = 'AddUpdatedAt1655843090639'

  async up(db) {
    await db.query(`ALTER TABLE "account" ADD "updated_at" integer`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "account" DROP COLUMN "updated_at"`)
  }
}
