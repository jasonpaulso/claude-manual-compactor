# claude-manual-compactor

A CLI tool for compacting text files by splitting them and summarizing the first half with Claude or OpenAI-compatible LLMs, and keep the second half untouched.

It's designed to reduce token usage for LLM chat sessions while maintaining context fidelity for the recent conversation.

## Usage

In a Claude Code interactive session, export the current chat by `/export` and choose `Save to file`.

![export-ui.png](doc/export-ui.png)

Run the script with the path to the exported file:

```bash
# Using Claude (default)
npx @codecentre/claude-manual-compactor <path/chat-session-export.txt>

# Using OpenAI
npx @codecentre/claude-manual-compactor <path/chat-session-export.txt> --openai

# Using a custom OpenAI-compatible endpoint
# First configure your endpoint in config.json, then:
npx @codecentre/claude-manual-compactor <path/chat-session-export.txt> --openai --model gpt-4o-mini
```

This will product a file in the current directory with the name `claude-compactor-<yyyy-mm-dd-hh-mm-ss>-<4 letter random string>.txt`.

To load the chat session with the compacted content, run:

```bash
cat <output-file> | claude
```

## Development

### Installation

```bash
npm install
```

### CLI Options

- `<file>` - Input file to compact (required)
- `-s, --split <percentage>` - Split percentage 1-100 (default: 50)
- `-o, --overlap <lines>` - Overlap lines 0-99999 (default: 10)
- `-m, --model <model>` - Model for summarization (Claude or OpenAI)
- `--openai` - Use OpenAI instead of Claude for summarization
- `--output-file <filename>` - Custom output filename
- `-h, --help` - Show help
- `-V, --version` - Show version

### Example Output

Console output:
```
📁 Reading file: conversation.txt
📊 File has 200 lines
⚙️  Parameters: split=50%, overlap=10 lines, LLM=Claude
✂️  Split: Part 1 (lines 1-110), Part 2 (lines 101-200)
🔄 Overlap: 10 lines (101-110)
🤖 Claude default is summarizing part 1...
📝 Streaming response:

[Claude's streaming response appears here]

✅ Summary completed
💾 Output written to: claude-compactor-2025-07-17-14-23-45-A1B2.txt

🚀 To start a new Claude Code session with the compacted content:
   cat claude-compactor-2025-07-17-14-23-45-A1B2.txt | claude
```

Output file begins with:
```yaml
---
# Claude Manual Compactor Metadata
date_processed: 2025-07-17T14:23:45.678Z
input_file: /Users/example/conversation.txt
input_filename: conversation.txt
total_lines: 200
split_percentage: 50%
overlap_lines: 10
part1_lines: 110
part2_lines: 100
llm_provider: Claude
model: default
---

[Summary content here...]

-- End of conversation summary --
-- Raw conversation starts below --    

[Part 2 content here...]
```

## How It Works

1. **File Splitting**: Reads input file and splits at specified percentage
2. **Overlap Logic**: Both parts share common lines for context preservation
3. **LLM Summarization**: First part is sent to Claude CLI or OpenAI API with optimized prompt
4. **Real-time Streaming**: Shows LLM's response as it generates
5. **Metadata Generation**: Adds YAML frontmatter with processing details
6. **Content Combination**: Frontmatter + summary + separator + second part = final output

### Output File Frontmatter

Each output file includes YAML frontmatter with metadata about the compaction process:

```yaml
---
# Claude Manual Compactor Metadata
date_processed: 2025-07-21T12:33:45.104Z
input_file: /full/path/to/input-file.txt
input_filename: input-file.txt
total_lines: 200
split_percentage: 50%
overlap_lines: 10
part1_lines: 110
part2_lines: 100
llm_provider: Claude
model: claude-3-opus-20240229
---
```

This metadata helps track:
- When the file was processed
- Source file information
- Splitting parameters used
- Which LLM and model performed the summarization

### Overlap Example

For a 100-line file with 50% split and 10 lines overlap:

- **Part 1**: Lines 1-60 (50 + 10 overlap)
- **Part 2**: Lines 51-100 (50 remaining)
- **Overlap**: Lines 51-60 (shared between both parts)

## Project Structure

```
claude-manual-compactor/
├── claude-manual-compactor    # Main executable script
├── src/                      # Modular source code
│   ├── claude-integration.js # Claude CLI interaction & streaming
│   ├── openai-integration.js # OpenAI API interaction & streaming
│   ├── file-splitting.js     # File splitting with overlap logic
│   └── parameter-validation.js # Input validation functions
├── config.json               # Configuration for OpenAI endpoints (optional)
├── tests/
│   └── unit/                 # Comprehensive unit tests (76 tests)
│       ├── test-claude-integration.test.js
│       ├── test-openai-integration.test.js
│       ├── test-file-splitting.test.js
│       └── parameter-validation.test.js
├── package.json              # Project configuration
├── jest.config.js            # Jest testing configuration
└── README.md                 # This file
```

## Development

### Technologies Used

- **Node.js** (>=16.0.0) runtime environment
- **Commander.js** for CLI argument parsing and validation
- **Claude CLI** for Claude-based text summarization (requires separate installation)
- **OpenAI SDK** for OpenAI API-compatible summarization
- **Jest** for comprehensive unit testing (76 tests)

### Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- tests/unit/test-file-splitting.test.js

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

- **File Splitting**: 26 tests covering overlap logic, edge cases, performance
- **Parameter Validation**: 25 tests for input validation and error handling
- **Claude Integration**: 10 tests for CLI interaction and streaming
- **OpenAI Integration**: 15 tests for API interaction, streaming, and configuration

## Requirements

- **Node.js** >=16.0.0
- **Claude CLI** must be installed and accessible in PATH (for Claude mode)
- **OpenAI API Key** set as `OPENAI_API_KEY` environment variable or in `config.json` (for OpenAI mode)
- Input files should be text-based (UTF-8 encoding)

## OpenAI Configuration

### Using OpenAI API

To use OpenAI for summarization, you need to:

1. Set your OpenAI API key as an environment variable:

   ```bash
   export OPENAI_API_KEY=your-api-key-here
   ```

2. Or configure it in `config.json`:
   ```json
   {
     "apiKey": "your-api-key-here",
     "baseURL": ""
   }
   ```

### Using Custom OpenAI-Compatible Endpoints

For services like Azure OpenAI, local LLMs, or other OpenAI-compatible APIs:

1. Create or edit `config.json`:

   ```json
   {
     "baseURL": "https://your-custom-endpoint.com/v1",
     "apiKey": "your-api-key"
   }
   ```

2. Run with the `--openai` flag:
   ```bash
   npx @codecentre/claude-manual-compactor chat.txt --openai --model your-model-name
   ```

## Error Handling

The tool provides clear error messages for:

- File not found or unreadable
- Invalid parameters (split %, overlap count)
- Claude CLI errors or unavailability
- OpenAI API errors or missing API key
- File system permission issues

## Version Management

### Bumping Versions

Use npm's built-in version commands to bump versions automatically:

```bash
npm version patch   # x.y.z → x.y.(z+1)
npm version minor   # x.y.z → x.(y+1).0
npm version major   # x.y.z → (x+1).0.0
```

### 🧪 Example

If your current version is `1.2.3`:

- `npm version patch` → `1.2.4`
- `npm version minor` → `1.3.0`
- `npm version major` → `2.0.0`

### 🧪 Pre-releases

Create alpha/beta releases:

```bash
npm version prerelease --preid=alpha
# e.g. 1.0.0 → 1.0.1-alpha.0
```

Next time:

```bash
npm version prerelease --preid=alpha
# 1.0.1-alpha.0 → 1.0.1-alpha.1
```

You can also start with a specific pre-release version:

```bash
npm version 1.0.0-alpha.0
```

### ⚠️ What it does:

- Updates the version in `package.json` (and `package-lock.json` if present)
- Creates a Git commit like `v1.2.4`
- Creates a Git tag `v1.2.4`

If you don't want Git stuff, use:

```bash
npm version patch --no-git-tag-version
```

### 💡 Pro tip: Combine with publishing

```bash
npm version patch
npm publish --tag alpha
git push --follow-tags
```

## License

MIT
