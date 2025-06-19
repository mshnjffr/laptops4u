// Test setup file
// Global test configuration and setup utilities

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = 3001; // Use different port for testing

// Global timeout for all tests
jest.setTimeout(10000);

// Setup and teardown helpers
global.setupTestServer = (app) => {
  let server;
  
  beforeAll((done) => {
    server = app.listen(process.env.PORT, done);
  });
  
  afterAll((done) => {
    server.close(done);
  });
  
  return server;
};

// Mock console methods to reduce test noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
