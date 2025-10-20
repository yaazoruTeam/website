import type { Knex } from "knex";

/**
 * Migration: Create yaazoru schema
 * 
 * This migration creates the main schema 'yaazoru' that will contain
 * all application tables. PostgreSQL schemas provide namespace isolation
 * and better organization of database objects.
 * 
 * @author Generated Migration
 * @created 2025-10-20
 */

export async function up(knex: Knex): Promise<void> {
  console.log('🏗️  Creating yaazoru schema...');
  
  try {
    // Check if schema already exists to avoid conflicts
    const schemaExists = await knex
      .select('schema_name')
      .from('information_schema.schemata')
      .where('schema_name', 'yaazoru');
    
    if (schemaExists.length === 0) {
      // Create the yaazoru schema
      await knex.raw('CREATE SCHEMA IF NOT EXISTS yaazoru');
      console.log('✅ Schema "yaazoru" created successfully');
    } else {
      console.log('ℹ️  Schema "yaazoru" already exists, skipping creation');
    }
    
  } catch (error) {
    console.error('❌ Error creating yaazoru schema:', error);
    throw error;
  }
}

export async function down(knex: Knex): Promise<void> {
  console.log('🗑️  Dropping yaazoru schema...');
  
  try {
    // Drop the schema and all its contents (CASCADE)
    // WARNING: This will delete ALL tables and data in the schema
    await knex.raw('DROP SCHEMA IF EXISTS yaazoru CASCADE');
    console.log('✅ Schema "yaazoru" dropped successfully');
    
  } catch (error) {
    console.error('❌ Error dropping yaazoru schema:', error);
    throw error;
  }
}

