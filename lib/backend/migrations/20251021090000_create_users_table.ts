import type { Knex } from "knex";

/**
 * Migration: Create users table
 * 
 * This migration creates the users table within the yaazoru schema.
 * The table stores system user information including personal details,
 * contact information, authentication credentials, and role-based permissions.
 * 
 * Features:
 * - Auto-incrementing primary key
 * - Unique constraints on critical identifiers (id_number, email, user_name, password)
 * - Role-based access control with enum
 * - Status enum with default value
 * - Proper indexing for performance
 * - Timestamps for audit trail
 * - Authentication and authorization support
 * 
 * @author Generated Migration
 * @created 2025-10-21
 */

export async function up(knex: Knex): Promise<void> {
  console.log('🏗️  Creating users table...');
  
  try {
    // Check if table already exists
    const tableExists = await knex.schema.withSchema('yaazoru').hasTable('users');
    
    if (tableExists) {
      console.log('ℹ️  Users table already exists, skipping creation');
      return;
    }

    // Create custom ENUM type for user status if it doesn't exist
    await knex.raw(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
          CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');
        END IF;
      END$$;
    `);

    // Create custom ENUM type for user role if it doesn't exist
    await knex.raw(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
          CREATE TYPE user_role AS ENUM ('admin', 'branch', 'supervisor', 'operator');
        END IF;
      END$$;
    `);
    
    await knex.schema.withSchema('yaazoru').createTable('users', (table) => {
      // Primary Key
      table.increments('user_id')
        .primary()
        .comment('Auto-incrementing primary key for user identification');
      
      // Personal Information
      table.string('first_name', 50)
        .notNullable()
        .comment('User first name');
      
      table.string('last_name', 50)
        .notNullable()
        .comment('User last name');
      
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
      
      // Authentication Information
      table.string('user_name', 50)
        .notNullable()
        .unique()
        .comment('Username for system login - unique identifier');
      
      table.string('password', 255)
        .notNullable()
        .comment('Hashed password for authentication');
      
      // Authorization Information
      table.specificType('role', 'user_role')
        .notNullable()
        .comment('User role defining system permissions');
      
      // Account Status
      table.specificType('status', 'user_status')
        .notNullable()
        .defaultTo('active')
        .comment('User account status');
      
      // Authentication Tracking
      table.timestamp('last_login_at')
        .nullable()
        .comment('Timestamp of last successful login');
      
      table.timestamp('password_changed_at')
        .nullable()
        .comment('Timestamp when password was last changed');
      
      table.integer('failed_login_attempts')
        .defaultTo(0)
        .comment('Counter for consecutive failed login attempts');
      
      // Timestamps - Knex will handle these automatically
      table.timestamps(true, true);
      
      // Performance indexes (excluding unique fields as they already have indexes)
      table.index(['status'], 'idx_users_status');
      table.index(['role'], 'idx_users_role');
      table.index(['city'], 'idx_users_city');
      table.index(['last_login_at'], 'idx_users_last_login');
      table.index(['created_at'], 'idx_users_created_at');
      
      // Composite indexes for common queries
      table.index(['role', 'status'], 'idx_users_role_status');
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
      CREATE TRIGGER update_users_updated_at 
      BEFORE UPDATE ON yaazoru.users 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    // Create trigger to automatically update password_changed_at when password changes
    await knex.raw(`
      CREATE OR REPLACE FUNCTION update_password_changed_at()
      RETURNS TRIGGER AS $$
      BEGIN
        IF OLD.password IS DISTINCT FROM NEW.password THEN
          NEW.password_changed_at = CURRENT_TIMESTAMP;
          NEW.failed_login_attempts = 0; -- Reset failed attempts on password change
        END IF;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await knex.raw(`
      CREATE TRIGGER update_users_password_changed_at 
      BEFORE UPDATE ON yaazoru.users 
      FOR EACH ROW EXECUTE FUNCTION update_password_changed_at();
    `);
    
    console.log('✅ Users table created successfully');
    
    // Add table comment
    await knex.raw(`
      COMMENT ON TABLE yaazoru.users IS 
      'System users table storing personal details, authentication credentials, and role-based permissions'
    `);
    
  } catch (error) {
    console.error('❌ Error creating users table:', error);
    throw error;
  }
}

export async function down(knex: Knex): Promise<void> {
  console.log('🗑️  Dropping users table...');
  
  try {
    // Drop the triggers first
    await knex.raw('DROP TRIGGER IF EXISTS update_users_updated_at ON yaazoru.users');
    await knex.raw('DROP TRIGGER IF EXISTS update_users_password_changed_at ON yaazoru.users');
    
    // Drop the table
    await knex.schema.withSchema('yaazoru').dropTableIfExists('users');
    
    // Check if other tables use the functions before dropping them
    const updateFunctionUsage = await knex.raw(`
      SELECT COUNT(*) as count
      FROM information_schema.triggers 
      WHERE trigger_name LIKE '%updated_at%' 
      AND action_statement LIKE '%update_updated_at_column%'
    `);
    
    if (updateFunctionUsage.rows[0].count === '0') {
      await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column()');
      console.log('ℹ️  update_updated_at_column function dropped (no other usage found)');
    } else {
      console.log('ℹ️  update_updated_at_column function kept (used by other tables)');
    }

    const passwordFunctionUsage = await knex.raw(`
      SELECT COUNT(*) as count
      FROM information_schema.triggers 
      WHERE action_statement LIKE '%update_password_changed_at%'
    `);
    
    if (passwordFunctionUsage.rows[0].count === '0') {
      await knex.raw('DROP FUNCTION IF EXISTS update_password_changed_at()');
      console.log('ℹ️  update_password_changed_at function dropped (no other usage found)');
    } else {
      console.log('ℹ️  update_password_changed_at function kept (used by other tables)');
    }
    
    // Check if other tables use the ENUMs before dropping them
    const userStatusUsage = await knex.raw(`
      SELECT COUNT(*) as count
      FROM information_schema.columns 
      WHERE udt_name = 'user_status'
      AND table_schema = 'yaazoru'
    `);
    
    if (userStatusUsage.rows[0].count === '0') {
      await knex.raw('DROP TYPE IF EXISTS user_status CASCADE');
      console.log('ℹ️  user_status ENUM dropped with CASCADE');
    } else {
      console.log('ℹ️  user_status ENUM kept (used by other tables)');
    }

    const userRoleUsage = await knex.raw(`
      SELECT COUNT(*) as count
      FROM information_schema.columns 
      WHERE udt_name = 'user_role'
      AND table_schema = 'yaazoru'
    `);
    
    if (userRoleUsage.rows[0].count === '0') {
      await knex.raw('DROP TYPE IF EXISTS user_role CASCADE');
      console.log('ℹ️  user_role ENUM dropped with CASCADE');
    } else {
      console.log('ℹ️  user_role ENUM kept (used by other tables)');
    }
    
    console.log('✅ Users table and related objects dropped successfully');
    
  } catch (error) {
    console.error('❌ Error dropping users table:', error);
    throw error;
  }
}