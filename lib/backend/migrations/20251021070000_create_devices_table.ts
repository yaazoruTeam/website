import type { Knex } from "knex";

/**
 * Migration: Create devices table
 * 
 * This migration creates the devices table within the yaazoru schema.
 * The table stores device information including technical specifications,
 * identification numbers, and operational details.
 * 
 * Features:
 * - Auto-incrementing primary key
 * - Unique constraints on critical identifiers (IMEI, SIM, device_number, serialNumber)
 * - Status enum with default value
 * - Proper indexing for performance
 * - Timestamps for audit trail
 * - Device lifecycle tracking
 * 
 * @author Generated Migration
 * @created 2025-10-21
 */

export async function up(knex: Knex): Promise<void> {
  console.log('🏗️  Creating devices table...');
  
  try {
    // Check if table already exists
    const tableExists = await knex.schema.withSchema('yaazoru').hasTable('devices');
    
    if (tableExists) {
      console.log('ℹ️  Devices table already exists, skipping creation');
      return;
    }

    // Create custom ENUM type for device status if it doesn't exist
    await knex.raw(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'device_status') THEN
          CREATE TYPE device_status AS ENUM ('active', 'inactive');
        END IF;
      END$$;
    `);
    
    await knex.schema.withSchema('yaazoru').createTable('devices', (table) => {
      // Primary Key
      table.increments('device_id')
        .primary()
        .comment('Auto-incrementing primary key for device identification');
      
      // Device Identifiers - Critical unique fields
      table.string('SIM_number', 20)
        .notNullable()
        .unique()
        .comment('SIM card number - unique identifier');
      
      table.string('IMEI_1', 15)
        .notNullable()
        .unique()
        .comment('Primary IMEI number - unique device identifier');
      
      table.string('device_number', 50)
        .notNullable()
        .unique()
        .comment('Device number - unique business identifier');
      
      table.string('serialNumber', 100)
        .notNullable()
        .unique()
        .comment('Manufacturer serial number - unique identifier');
      
      // Device Specifications
      table.string('model', 100)
        .notNullable()
        .comment('Device model/type');
      
      table.string('plan', 100)
        .notNullable()
        .comment('Service plan associated with the device');
      
      // Date Information
      table.date('purchaseDate')
        .nullable()
        .comment('Date when device was purchased (optional)');
      
      table.date('registrationDate')
        .notNullable()
        .comment('Date when device was registered in the system');
      
      // Status using PostgreSQL ENUM
      table.specificType('status', 'device_status')
        .notNullable()
        .defaultTo('active')
        .comment('Device operational status');
      
      // Timestamps - Knex will handle these automatically
      table.timestamps(true, true);
      
      // Performance indexes
      table.index(['status'], 'idx_devices_status');
      table.index(['model'], 'idx_devices_model');
      table.index(['plan'], 'idx_devices_plan');
      table.index(['registrationDate'], 'idx_devices_registration_date');
      table.index(['created_at'], 'idx_devices_created_at');
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
      CREATE TRIGGER update_devices_updated_at 
      BEFORE UPDATE ON yaazoru.devices 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    
    console.log('✅ Devices table created successfully');
    
    // Add table comment
    await knex.raw(`
      COMMENT ON TABLE yaazoru.devices IS 
      'Device information table storing technical specifications, identifiers, and operational details'
    `);
    
  } catch (error) {
    console.error('❌ Error creating devices table:', error);
    throw error;
  }
}

export async function down(knex: Knex): Promise<void> {
  console.log('🗑️  Dropping devices table...');
  
  try {
    // Drop the trigger first
    await knex.raw('DROP TRIGGER IF EXISTS update_devices_updated_at ON yaazoru.devices');
    
    // Drop the table
    await knex.schema.withSchema('yaazoru').dropTableIfExists('devices');
    
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
      WHERE udt_name = 'device_status'
      AND table_schema = 'yaazoru'
    `);
    
    if (enumUsage.rows[0].count === '0') {
      await knex.raw('DROP TYPE IF EXISTS device_status CASCADE');
      console.log('ℹ️  device_status ENUM dropped with CASCADE');
    } else {
      console.log('ℹ️  device_status ENUM kept (used by other tables)');
    }
    
    console.log('✅ Devices table and related objects dropped successfully');
    
  } catch (error) {
    console.error('❌ Error dropping devices table:', error);
    throw error;
  }
}