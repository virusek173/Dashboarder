# Team Progress Dashboard

Dashboard built with Next.js for tracking development team progress with JIRA integration.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Axios** with optional SOCKS proxy support
- **Lucide React** (icons)

## Installation

```bash
npm install
```

## Configuration

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Fill in environment variables in `.env.local`:

```env
JIRA_BASE_URL=https://your-jira-server.com
JIRA_API_TOKEN=your-bearer-token-here
JIRA_STORY_POINTS_FIELD=customfield
JIRA_RESOLVED_STATUS=Solved
SOCKS_PROXY_URL=socks5://127.0.0.1:1234  # Optional: omit if direct connection to JIRA is available

# Project configuration
NEXT_PUBLIC_PROJECT_NAME=PROJECT
NEXT_PUBLIC_JIRA_BASE_URL=https://your-jira-server.com
```

3. Copy configuration files:

```bash
# Teams configuration
cp src/config/teams.example.json src/config/teams.json

# Tab configurations per team/release
cp src/config/tabs.example.json src/config/tabs.json
```

4. Customize your teams in `src/config/teams.json` and tab configurations in `src/config/tabs.json`

## Authentication

The dashboard is protected with HTTP Basic Authentication. When you access the application, your browser will prompt for credentials.

### Setup Authentication

1. **Generate a password hash:**

```bash
npx tsx scripts/hash-password.ts "your-secure-password"
```

2. **Add credentials to `.env.local`:**

```env
AUTH_ENABLED=true
AUTH_USERNAME=user
AUTH_PASSWORD_HASH=<hex-hash-from-step-1>
```

### Disable Authentication (Development)

To disable authentication during development:

```env
AUTH_ENABLED=false
```

### Security Notes

- Password is stored as SHA-256 hash (never plaintext)
- Hash format is simple hex string (no special characters)
- Application is bound to `localhost` only (127.0.0.1:3000)
- For production deployment beyond localhost, use HTTPS
- Browser caches credentials during session

## Running the Application

### Development Mode

```bash
npm run dev
```

Dashboard will be available at: http://localhost:3000

### Production Build

```bash
npm run build
npm start
```

### Docker Deployment

**Important:** When using Docker, update your `.env.local`:
- Change `DATABASE_URL` to `file:/app/data/prod.db`
- If using SOCKS proxy running on your host machine:
  - **macOS/Windows**: Use `host.docker.internal`
    ```env
    SOCKS_PROXY_URL=socks5://host.docker.internal:1234
    ```
  - **Linux**: Use `172.17.0.1` (Docker bridge IP)
    ```env
    SOCKS_PROXY_URL=socks5://172.17.0.1:1234
    ```

**Using Makefile (recommended):**
```bash
make up            # Start everything
make restart       # Quick restart (no rebuild)
make hard-restart  # Full restart with rebuild
make logs          # View logs
make down          # Stop everything
make help          # Show all commands
```

**Using docker-compose directly:**
```bash
docker-compose up -d --build  # Build and start
docker-compose logs -f app    # View logs
docker-compose down           # Stop
```

See [DOCKER.md](DOCKER.md) for detailed Docker deployment guide.

## Project Structure

```
src/
├── app/
│   ├── api/jira/         # API Route for fetching JIRA data
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Main page
│   └── globals.css       # Global styles
├── components/
│   └── Dashboard/        # Dashboard components
├── config/               # Configuration files
│   ├── teams.json        # Teams configuration
│   ├── tabs.json         # Tab configurations per team/release
│   └── index.ts          # Config getters
├── hooks/                # React hooks
├── lib/                  # Libraries and helpers
└── types/                # TypeScript types
```

## Configuration

### Teams Configuration

Edit `src/config/teams.json` to configure your teams:
```json
[
  {
    "slug": "team-alpha",
    "name": "Team Alpha",
    "icon": "🚀"
  }
]
```

### Tab Configuration

Edit `src/config/tabs.json` to configure tabs for each team and release:

### Configuration Structure
```json
{
  "team-slug-release": [
    {
      "id": "displays",
      "label": "Displays",
      "showSummary": true,
      "rows": [...]
    }
  ]
}
```

### Basic Row Configuration
```json
{
  "id": "unique-id",
  "label": "Display Name",
  "jiraLabels": ["label1", "label2"],
  "deadline": "2026-12-31"
}
```

### Advanced Filtering
```json
{
  "id": "advanced-example",
  "label": "Advanced Example",
  "jiraLabels": ["required-label"],
  "requireAllLabels": true,
  "excludeLabels": ["excluded-label"],
  "deadline": "2026-12-31"
}
```

See `src/config/tabs.example.json` for more examples.

## Features

- 📊 Multiple teams and releases support
- 📊 Configurable tabs per team/release
- ✅ Track completed tickets and Story Points
- 📅 Display deadlines and remaining working days
- 📈 Progress bar with color coding (green >80%, yellow 50-80%, red <50%)
- 📊 Story Points progress bars (completed vs remaining)
- 💪 Motivational messages based on progress
- 💾 Data caching in database
- 🔄 Refresh button to update data
- ⏱️ Timestamp of last data fetch
- 📄 Dynamic page title based on project name
- 🔧 Per-tab summary visibility control
- 🔀 Toggle between Story Points and Tickets view

## Notes

- Application supports optional SOCKS proxy for JIRA Server connection (direct connection used if proxy not configured)
- JIRA token is securely stored only on server-side
- Working days are counted Monday to Friday (excluding holidays)
- Ticket is considered completed based on configurable resolution status (default: "Solved")
- Story Points field is configurable to match your JIRA instance
