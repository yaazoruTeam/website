// Mock environment variables for tests
process.env.BRAND_TOKEN = 'mock_brand_token'
process.env.BRAND_ID = 'mock_brand_id'
process.env.ACCOUNT_TOKEN = 'mock_account_token'
process.env.AUTH_ID = 'mock_auth_id'
process.env.ACCOUNT_ACTION = 'mock_account_action'
process.env.APP_ACTION = 'mock_app_action'
process.env.DB_HOST = 'localhost'
process.env.DB_PORT = '5432'
process.env.DB_USER = 'test_user'
process.env.DB_NAME = 'test_db'
process.env.DB_PASSWORD = 'test_password'
process.env.JWT_SECRET = 'test_jwt_secret'
process.env.LIMIT = '10'

jest.spyOn(console, 'log').mockImplementation(() => {})
jest.spyOn(console, 'warn').mockImplementation(() => {})
jest.spyOn(console, 'error').mockImplementation(() => {})
