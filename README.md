# Timetracker UI

> [!WARNING]
> **This repository is deprecated and archived.**
>
> Its functionality is now part of [timetracker](https://github.com/netresearch/timetracker)
> itself. No further development or releases will happen here.

A modern user interface for [timetracker](https://github.com/netresearch/timetracker) - serving statistics and analytics.

## Tech Stack

- **Vue 3.5.24** - Progressive JavaScript framework
- **Vite 7.2.2** - Next generation frontend tooling
- **Pinia 3.0.4** - Official Vue state management
- **Bootstrap 5.3.8** - Modern UI framework
- **Node 22.21.0 LTS** - JavaScript runtime
- **pnpm 10+** - Fast, disk space efficient package manager

## Prerequisites

- Node.js 22+ (LTS "Jod")
- pnpm 10+

```bash
# Install Node 22 via nvm
nvm install 22
nvm use 22

# Install pnpm
corepack enable
```

## Quick Start

```bash
# Automated setup (recommended)
./setup-dev.sh

# Or manual setup:
pnpm install
cp static/config.json.dist static/config.json
```

## Development

```bash
# Start dev server with hot reload
TIMETRACKER_URL=https://timetracker.example.com pnpm dev

# Dev server will start at http://localhost:8080
```

### Windows

```powershell
# PowerShell
$env:TIMETRACKER_URL="https://timetracker.example.com"; pnpm dev

# CMD
set TIMETRACKER_URL=https://timetracker.example.com && pnpm dev
```

## Production Build

```bash
# Build for production
pnpm build

# Preview production build locally
pnpm preview

# Lint code
pnpm lint
```

## Docker

```bash
# Build image
docker build -t timetracker-ui .

# Run container
docker run -d -p 8080:8080 \
  -e TIMETRACKER_URL=https://timetracker.example.com \
  timetracker-ui
```

## Configuration

Edit `static/config.json` (copy from `static/config.json.dist`):

```json
{
  "state": "sn",
  "defaultHoursPerDay": 8,
  "timetrackerUrl": "/tt"
}
```

- `state`: German state code for holiday calendar
- `defaultHoursPerDay`: Default working hours
- `timetrackerUrl`: API endpoint (proxied to actual backend)

## Project Structure

```
src/
├── assets/       # SCSS styles
├── components/   # Vue components
├── composables/  # Reusable composition functions
├── pages/        # Route pages
├── plugins/      # Vue plugins
├── router/       # Vue Router configuration
└── stores/       # Pinia state stores
```

## Performance

- ⚡ Dev server: 250ms startup (32x faster than webpack)
- ⚡ HMR: Instant updates
- ⚡ Production build: ~6 seconds
- 📦 Optimized bundles with tree-shaking
- 🎯 Code splitting for optimal loading

## License

See LICENSE file
