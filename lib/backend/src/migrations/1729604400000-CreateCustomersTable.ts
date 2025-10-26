import { MigrationInterface, QueryRunner } from 'typeorm'

/**
 * Migration 2: Create customers table in yaazoru schema
 * 
 * מיגרציה זו תיוצר את טבלת customers עם כל העמודות, indexes ו-triggers
 * ההנחה היא ש-schema 'yaazoru' כבר קיים (מהמיגרציה הראשונה)
 */
export class CreateCustomersTable1729604400000 implements MigrationInterface {
  name = 'CreateCustomersTable1729604400000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('📦 Creating customers table in yaazoru schema...')

    // Step 1: Create ENUM type for customer_status
    console.log('📝 Creating customer_status enum type...')
    try {
      await queryRunner.query(
        `CREATE TYPE yaazoru.customer_status AS ENUM('active', 'inactive')`
      )
      console.log('✅ ENUM type created')
    } catch (error) {
      console.log('ℹ️  ENUM type already exists')
    }

    // Step 2: Create customers table in yaazoru schema
    console.log('📦 Creating customers table...')
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS yaazoru.customers (
        customer_id SERIAL NOT NULL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        id_number VARCHAR(9) NOT NULL UNIQUE,
        phone_number VARCHAR(20) NOT NULL,
        additional_phone VARCHAR(20),
        email VARCHAR(100) NOT NULL UNIQUE,
        city VARCHAR(100) NOT NULL,
        address VARCHAR(255) NOT NULL,
        status yaazoru.customer_status NOT NULL DEFAULT 'active',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`
    )
    console.log('✅ Customers table created')

    // Step 3: Create indexes for better performance
    console.log('🔍 Creating indexes...')
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_customers_email ON yaazoru.customers (email)`
    )
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_customers_status ON yaazoru.customers (status)`
    )
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_customers_id_number ON yaazoru.customers (id_number)`
    )
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_customers_created_at ON yaazoru.customers (created_at)`
    )
    console.log('✅ Indexes created')

    // Step 4: Create trigger function for automatic updated_at
    console.log('⏰ Creating trigger for automatic updated_at...')
    try {
      await queryRunner.query(
        `CREATE OR REPLACE FUNCTION yaazoru.update_customers_updated_at()
         RETURNS TRIGGER AS $$
         BEGIN
           NEW.updated_at = CURRENT_TIMESTAMP;
           RETURN NEW;
         END;
         $$ LANGUAGE plpgsql;`
      )

      // Drop existing trigger if it exists
      await queryRunner.query(
        `DROP TRIGGER IF EXISTS tr_customers_updated_at ON yaazoru.customers`
      )

      // Create trigger
      await queryRunner.query(
        `CREATE TRIGGER tr_customers_updated_at
         BEFORE UPDATE ON yaazoru.customers
         FOR EACH ROW
         EXECUTE FUNCTION yaazoru.update_customers_updated_at()`
      )
      console.log('✅ Trigger created')
    } catch (error) {
      console.log('ℹ️  Trigger already exists')
    }

    console.log('✅ Migration UP completed successfully - Customers table created!')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('🗑️  Dropping customers table...')

    // Drop trigger
    try {
      await queryRunner.query(
        `DROP TRIGGER IF EXISTS tr_customers_updated_at ON yaazoru.customers`
      )
    } catch (error) {
      console.log('ℹ️  Trigger not found')
    }

    // Drop trigger function
    try {
      await queryRunner.query(
        `DROP FUNCTION IF EXISTS yaazoru.update_customers_updated_at()`
      )
    } catch (error) {
      console.log('ℹ️  Function not found')
    }

    // Drop table
    try {
      await queryRunner.query(`DROP TABLE IF EXISTS yaazoru.customers`)
      console.log('✅ Customers table dropped')
    } catch (error) {
      console.log('ℹ️  Table not found')
    }

    // Drop ENUM type
    try {
      await queryRunner.query(`DROP TYPE IF EXISTS yaazoru.customer_status`)
      console.log('✅ ENUM type dropped')
    } catch (error) {
      console.log('ℹ️  ENUM type not found')
    }

    console.log('✅ Migration DOWN completed successfully')
  }
}
