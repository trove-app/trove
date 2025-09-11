# Claude Code Configuration

## Custom Tools

### Docker Logs Tool
Container-agnostic tool to access logs from any running Docker containers with filtering and noise reduction.

**Command**: `make logs`

**Usage**:
- `make logs` - Show logs from all running containers (last 50 lines each)
- `make logs CONTAINER=<name>` - Show logs from specific container
- `make logs LINES=100` - Show more lines (default: 50)
- `make logs FILTER="ERROR|WARN"` - Filter logs by pattern (regex)
- `make logs SINCE="5m"` - Show logs from last 5 minutes
- `make logs FOLLOW=true` - Follow logs in real-time
- `make logs LIST=true` - List all running containers

**Examples**:
```bash
# Quick overview of all running containers
make logs

# List available containers
make logs LIST=true

# Debug specific container
make logs CONTAINER=my-app-1 LINES=200

# Monitor errors across all containers
make logs FILTER="ERROR|WARN|FATAL" FOLLOW=true

# Check recent logs with timestamp filter
make logs SINCE="10m" FILTER="ERROR"

# Exclude noise (common patterns)
make logs FILTER="ERROR|WARN" EXCLUDE="health check|ping|keepalive"
```

**Auto-discovery**: The tool automatically detects all running Docker containers in any environment, making it portable across different projects and setups.