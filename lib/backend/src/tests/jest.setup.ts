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
process.env.TRANZILA_EXPIRE_MONTH = '11'
process.env.TRANZILA_EXPIRE_YEAR = '2030'
process.env.TRANZILA_CVV = '123'
process.env.TRANZILA_CARD_NUMBER = 'ieff4b4e3bae1df4580'
process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON = JSON.stringify({
  "type": "service_account",
  "project_id": "mock-project",
  "private_key_id": "mock-key-id",
  "private_key": "MOCK_PRIVATE_KEY_FOR_TESTING",
  "client_email": "mock@mock-project.iam.gserviceaccount.com",
  "client_id": "mock-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
})

// Mock console methods to reduce noise during tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
} as Console;

// Mock process.exit to prevent tests from actually exiting
const mockExit = jest.fn();
process.exit = mockExit as unknown as typeof process.exit;
