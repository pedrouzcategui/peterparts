# Tests

This folder contains all the unit and integration tests for the Peterparts backend.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

```
tests/
├── controllers/     # Controller tests (request/response handling)
├── utils/          # Utility function tests
├── models/         # Model/database layer tests (future)
└── integration/    # Integration tests (future)
```

## Writing Tests

### Controller Tests

Controller tests mock the model layer and test HTTP request/response handling:

- Status codes
- Request validation
- Error handling
- Response formats

### Utils Tests

Utils tests verify helper functions work correctly with various inputs:

- Valid inputs
- Invalid inputs
- Edge cases
- Type guards

## Test Coverage

Run `npm run test:coverage` to generate a coverage report. The report will be available in the `coverage/` directory.

Coverage goals:

- Controllers: >80%
- Utils: >90%
- Models: >70%
