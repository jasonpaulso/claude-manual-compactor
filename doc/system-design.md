Please help me write a script that can be run locally.

This script should be in node.js as Claude Code is installed via npm, so it's already avalalbe in the user's environment.

Call this script `claude-manual-compact`.

It takes mandary param <path/filename.txt>

It takes these optional params: - split: type:(int), default(50), range(1-100), percentage
- overlap: type:(int), default(10), range(0-99999) how many lines are overlapped between the two splits
- model: a Claude model for summarizing the first part
- output-file: default(claude-compactor-<yyyy-mm-dd-hh-mm-ss>-<4 letter random string>.txt)


What it does

- It splits a given file into two parts, part_1 and part_2
- part_1 and part_2 should respect the --split and --overlap params.
- Summerize part_1 using the `claude` command: cat part_1 | claude --append-system-prompt "You are given a blob a text, please summerize it and make it compact. This is done to reduce the token usage for a chat session with a LLM."
- Concatenate summerized part_1 and part_2 and write it to a temporary file per the --output-file param. 
- Print a command how the user can start a new coding session: `cat <output-file> | claude`



----
Usage: claude [options] [command] [prompt]

Claude Code - starts an interactive session by default, use -p/--print for non-interactive output

Arguments:
  prompt                           Your prompt

Options:
  -d, --debug                      Enable debug mode
  --verbose                        Override verbose mode setting from config
  -p, --print                      Print response and exit (useful for pipes)
  --output-format <format>         Output format (only works with --print): "text" (default), "json" (single result), or "stream-json" (realtime streaming)
                                   (choices: "text", "json", "stream-json")
  --input-format <format>          Input format (only works with --print): "text" (default), or "stream-json" (realtime streaming input) (choices: "text",
                                   "stream-json")
  --mcp-debug                      [DEPRECATED. Use --debug instead] Enable MCP debug mode (shows MCP server errors)
  --dangerously-skip-permissions   Bypass all permission checks. Recommended only for sandboxes with no internet access.
  --allowedTools <tools...>        Comma or space-separated list of tool names to allow (e.g. "Bash(git:*) Edit")
  --disallowedTools <tools...>     Comma or space-separated list of tool names to deny (e.g. "Bash(git:*) Edit")
  --mcp-config <file or string>    Load MCP servers from a JSON file or string
  --append-system-prompt <prompt>  Append a system prompt to the default system prompt
  --permission-mode <mode>         Permission mode to use for the session (choices: "acceptEdits", "bypassPermissions", "default", "plan")
  -c, --continue                   Continue the most recent conversation
  -r, --resume [sessionId]         Resume a conversation - provide a session ID or interactively select a conversation to resume
  --model <model>                  Model for the current session. Provide an alias for the latest model (e.g. 'sonnet' or 'opus') or a model's full name (e.g.
                                   'claude-sonnet-4-20250514').
  --fallback-model <model>         Enable automatic fallback to specified model when default model is overloaded (only works with --print)
  --add-dir <directories...>       Additional directories to allow tool access to
  --ide                            Automatically connect to IDE on startup if exactly one valid IDE is available
  --strict-mcp-config              Only use MCP servers from --mcp-config, ignoring all other MCP configurations
  --session-id <uuid>              Use a specific session ID for the conversation (must be a valid UUID)
  -v, --version                    Output the version number
  -h, --help                       Display help for command
