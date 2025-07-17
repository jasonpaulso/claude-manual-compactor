# claude-manual-compact

A CLI tool for compacting Claude manual content.

## Installation

```bash
npm install
```

## Usage

```bash
# Install dependencies
npm install

# Run the CLI
npm start

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run unit tests only
npm run test:unit

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## CLI Commands

```bash
# Show help
node index.js --help

# Compact command (not yet implemented)
node index.js compact --input file.txt --output compacted.txt

# Show help
node index.js help
```

## Project Structure

```
claude-manual-compact/
├── index.js              # Main CLI entry point
├── src/                  # Source code directory
├── tests/
│   └── unit/            # Unit tests
├── package.json         # Project configuration
├── jest.config.js       # Jest configuration
├── eslint.config.js     # ESLint configuration
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Development

This project uses:
- **Commander.js** for CLI argument parsing
- **Jest** for testing
- **ESLint** for code linting
- **Node.js** (>=16.0.0) as the runtime

## Testing

Unit tests are located in `tests/unit/` and follow the project structure. Run tests with:

```bash
npm test
```

## License

MIT