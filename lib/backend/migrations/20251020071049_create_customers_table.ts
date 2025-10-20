import type { Knex } from "knex";

/**
 * Migration: Create customers table
 * 
 * This migration creates the customers table within the yaazoru schema.
 * The table stores customer information including personal details,
 * contact information, and addresses.
 * 
 * Features:
 * - Auto-incrementing primary key
 * - Unique constraints on id_number and email
 * - Status enum with default value
 * - Proper indexing for performance
 * - Timestamps for audit trail
 * 
 * @author Generated Migration
 * @created 2025-10-20
 */

export async function up(knex: Knex): Promise<void> {
  console.log('🏗️  Creating customers table...');
  
  try {
    // Check if table already exists
    const tableExists = await knex.schema.withSchema('yaazoru').hasTable('customers');
    
    if (tableExists) {
      console.log('ℹ️  Customers table already exists, skipping creation');
      return;
    }

    // Create custom ENUM type for customer status if it doesn't exist
    await knex.raw(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'customer_status') THEN
          CREATE TYPE customer_status AS ENUM ('active', 'inactive');
        END IF;
      END$$;
    `);
    
    await knex.schema.withSchema('yaazoru').createTable('customers', (table) => {
      // Primary Key
      table.increments('customer_id')
        .primary()
        .comment('Auto-incrementing primary key for customer identification');
      
      // Personal Information
      table.string('first_name', 50)
        .notNullable()
        .comment('Customer first name');
      
      table.string('last_name', 50)
        .notNullable()
        .comment('Customer last name');
      
      table.string('id_number', 9)
        .notNullable()
        .unique()
        .comment('Israeli ID number - unique identifier');
      
      // Contact Information
      table.string('phone_number', 20)
        .notNullable()
        .comment('Primary phone number');
      
      table.string('additional_phone', 20)
        .nullable()
        .comment('Secondary phone number (optional)');
      
      table.string('email', 100)
        .notNullable()
        .unique()
        .comment('Email address - unique identifier');
      
      // Address Information
      table.string('city', 100)
        .notNullable()
        .comment('City of residence');
      
      table.string('address1', 255)
        .notNullable()
        .comment('Primary address line');
      
      table.string('address2', 255)
        .nullable()
        .comment('Secondary address line (optional)');
      
      table.string('zip_code', 10)
        .notNullable()
        .comment('Postal/ZIP code');
      
      // Status using PostgreSQL ENUM
      table.specificType('status', 'customer_status')
        .notNullable()
        .defaultTo('active')
        .comment('Customer account status');
      
      // Timestamps - Knex will handle these automatically
      table.timestamps(true, true);
      
      // Performance indexes (excluding email and id_number as they already have unique indexes)
      table.index(['status'], 'idx_customers_status');
      table.index(['city'], 'idx_customers_city');
      table.index(['created_at'], 'idx_customers_created_at');
    });
    
    // Create trigger function for automatic updated_at (only if it doesn't exist)
    await knex.raw(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await knex.raw(`
      CREATE TRIGGER update_customers_updated_at 
      BEFORE UPDATE ON yaazoru.customers 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    
    console.log('✅ Customers table created successfully');
    
    // Add table comment
    await knex.raw(`
      COMMENT ON TABLE yaazoru.customers IS 
      'Customer information table storing personal details, contact info, and addresses'
    `);
    
  } catch (error) {
    console.error('❌ Error creating customers table:', error);
    throw error;
  }
}

export async function down(knex: Knex): Promise<void> {
  console.log('🗑️  Dropping customers table...');
  
  try {
    // Drop the trigger first
    await knex.raw('DROP TRIGGER IF EXISTS update_customers_updated_at ON yaazoru.customers');
    
    // Drop the table
    await knex.schema.withSchema('yaazoru').dropTableIfExists('customers');
    
    // Check if other tables use the function before dropping it
    const functionUsage = await knex.raw(`
      SELECT COUNT(*) as count
      FROM information_schema.triggers 
      WHERE trigger_name LIKE '%updated_at%' 
      AND action_statement LIKE '%update_updated_at_column%'
    `);
    
    if (functionUsage.rows[0].count === '0') {
      await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column()');
      console.log('ℹ️  update_updated_at_column function dropped (no other usage found)');
    } else {
      console.log('ℹ️  update_updated_at_column function kept (used by other tables)');
    }
    
    // Check if other tables use the ENUM before dropping it
    const enumUsage = await knex.raw(`
      SELECT COUNT(*) as count
      FROM information_schema.columns 
      WHERE udt_name = 'customer_status'
      AND table_schema = 'yaazoru'
    `);
    
    if (enumUsage.rows[0].count === '0') {
      await knex.raw('DROP TYPE IF EXISTS customer_status CASCADE');
      console.log('ℹ️  customer_status ENUM dropped with CASCADE');
    } else {
      console.log('ℹ️  customer_status ENUM kept (used by other tables)');
    }
    
    console.log('✅ Customers table and related objects dropped successfully');
    
  } catch (error) {
    console.error('❌ Error dropping customers table:', error);
    throw error;
  }
}

