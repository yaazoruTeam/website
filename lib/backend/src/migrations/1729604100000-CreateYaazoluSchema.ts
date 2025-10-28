import { MigrationInterface, QueryRunner } from 'typeorm'

/**
 * Migration 1: Create yaazoru schema
 * 
 * מיגרציה זו תיוצר את ה-schema 'yaazoru' שכל הטבלאות יהיו בתוכו
 * זו חייבת להיות המיגרציה הראשונה!
 */
export class CreateYaazoluSchema1729604100000 implements MigrationInterface {
  name = 'CreateYaazoluSchema1729604100000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('🏗️  Creating yaazoru schema...')
    
    try {
      await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS yaazoru`)
      console.log('✅ Schema "yaazoru" created successfully')
    } catch (error) {
      console.log('ℹ️  Schema "yaazoru" already exists')
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('🗑️  Dropping yaazoru schema...')
    
    try {
      // Drop schema with all its contents
      await queryRunner.query(`DROP SCHEMA IF EXISTS yaazoru CASCADE`)
      console.log('✅ Schema "yaazoru" dropped successfully')
    } catch (error) {
      console.log('❌ Error dropping schema:', error)
    }
  }
}
