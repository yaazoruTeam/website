import type { Knex } from "knex";

/**
 * Migration: Create customer_device table
 * 
 * This migration creates the customer_device junction table within the yaazoru schema.
 * The table establishes the many-to-many relationship between customers and devices,
 * tracking device assignments, service periods, and lifecycle management.
 * 
 * Features:
 * - Auto-incrementing primary key
 * - Foreign key constraints with proper referential integrity
 * - Unique constraint to prevent duplicate device assignments
 * - Status tracking for assignment lifecycle
 * - Proper indexing for performance
 * - Timestamps for audit trail
 * - Device assignment and service period tracking
 * 
 * @author Generated Migration
 * @created 2025-10-21
 */

export async function up(knex: Knex): Promise<void> {
  console.log('🏗️  Creating customer_device table...');
  
  try {
    // Check if table already exists
    const tableExists = await knex.schema.withSchema('yaazoru').hasTable('customer_device');
    
    if (tableExists) {
      console.log('ℹ️  Customer_device table already exists, skipping creation');
      return;
    }

    // Create custom ENUM type for assignment status if it doesn't exist
    await knex.raw(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'assignment_status') THEN
          CREATE TYPE assignment_status AS ENUM ('active', 'inactive', 'suspended', 'terminated');
        END IF;
      END$$;
    `);
    
    await knex.schema.withSchema('yaazoru').createTable('customer_device', (table) => {
      // Primary Key
      table.increments('customer_device_id')
        .primary()
        .comment('Auto-incrementing primary key for customer-device assignment');
      
      // Foreign Keys
      table.integer('customer_id')
        .unsigned()
        .notNullable()
        .comment('Foreign key reference to customers table');
      
      table.integer('device_id')
        .unsigned()
        .notNullable()
        .comment('Foreign key reference to devices table');
      
      // Assignment Details
      table.date('received_at')
        .nullable()
        .comment('Date when customer received the device');
      
      table.date('plan_start_date')
        .nullable()
        .comment('Date when service plan started');
      
      table.date('plan_end_date')
        .nullable()
        .comment('Date when service plan ends');
      
      table.date('returned_at')
        .nullable()
        .comment('Date when device was returned (if applicable)');
      
      // Assignment Status
      table.specificType('status', 'assignment_status')
        .notNullable()
        .defaultTo('active')
        .comment('Status of the customer-device assignment');
      
      // Business Logic Fields
      table.text('notes')
        .nullable()
        .comment('Additional notes about the assignment');
      
      // Timestamps - Knex will handle these automatically
      table.timestamps(true, true);
      
      // Foreign Key Constraints
      table.foreign('customer_id')
        .references('customer_id')
        .inTable('yaazoru.customers')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      
      table.foreign('device_id')
        .references('device_id')
        .inTable('yaazoru.devices')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      
      // Unique Constraints
      // A device can only be assigned to one customer at a time (for active assignments)
      table.unique(['device_id', 'status'], 'uk_device_active_assignment');
      
      // Composite index for customer-device lookup
      table.index(['customer_id', 'device_id'], 'idx_customer_device_lookup');
      
      // Performance indexes
      table.index(['customer_id'], 'idx_customer_device_customer');
      table.index(['device_id'], 'idx_customer_device_device');
      table.index(['status'], 'idx_customer_device_status');
      table.index(['plan_end_date'], 'idx_customer_device_plan_end');
      table.index(['received_at'], 'idx_customer_device_received');
      table.index(['created_at'], 'idx_customer_device_created_at');
    });
    
    // Create trigger function for automatic updated_at (reuse existing function)
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
      CREATE TRIGGER update_customer_device_updated_at 
      BEFORE UPDATE ON yaazoru.customer_device 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    
    // Add constraint to ensure logical date ordering
    await knex.raw(`
      ALTER TABLE yaazoru.customer_device 
      ADD CONSTRAINT chk_date_logic 
      CHECK (
        (plan_start_date IS NULL OR received_at IS NULL OR plan_start_date >= received_at) AND
        (plan_end_date IS NULL OR plan_start_date IS NULL OR plan_end_date >= plan_start_date) AND
        (returned_at IS NULL OR received_at IS NULL OR returned_at >= received_at)
      )
    `);
    
    console.log('✅ Customer_device table created successfully');
    
    // Add table comment
    await knex.raw(`
      COMMENT ON TABLE yaazoru.customer_device IS 
      'Junction table managing the relationship between customers and devices, tracking assignments and service periods'
    `);
    
  } catch (error) {
    console.error('❌ Error creating customer_device table:', error);
    throw error;
  }
}

export async function down(knex: Knex): Promise<void> {
  console.log('🗑️  Dropping customer_device table...');
  
  try {
    // Drop the trigger first
    await knex.raw('DROP TRIGGER IF EXISTS update_customer_device_updated_at ON yaazoru.customer_device');
    
    // Drop the table (foreign key constraints will be dropped automatically)
    await knex.schema.withSchema('yaazoru').dropTableIfExists('customer_device');
    
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
      WHERE udt_name = 'assignment_status'
      AND table_schema = 'yaazoru'
    `);
    
    if (enumUsage.rows[0].count === '0') {
      await knex.raw('DROP TYPE IF EXISTS assignment_status CASCADE');
      console.log('ℹ️  assignment_status ENUM dropped with CASCADE');
    } else {
      console.log('ℹ️  assignment_status ENUM kept (used by other tables)');
    }
    
    console.log('✅ Customer_device table and related objects dropped successfully');
    
  } catch (error) {
    console.error('❌ Error dropping customer_device table:', error);
    throw error;
  }
}