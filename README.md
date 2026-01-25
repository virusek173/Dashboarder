# Team Progress Dashboard

Dashboard built with Next.js for tracking development team progress with JIRA integration.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Axios** with SOCKS proxy
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
SOCKS_PROXY_URL=socks5://127.0.0.1:12345

# Team configuration
NEXT_PUBLIC_TEAM_NAME=TEAM
NEXT_PUBLIC_RELEASE_NUMBER=1
NEXT_PUBLIC_TEAM_ICON=🚀
```

3. Copy `src/data/tabConfig.example.ts` to `src/data/tabConfig.ts`:

```bash
cp src/data/tabConfig.example.ts src/data/tabConfig.ts
```

4. Customize your project-specific tabs, deadlines and labels in `src/data/tabConfig.ts`

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
├── hooks/                # React hooks
├── lib/                  # Libraries and helpers
├── types/                # TypeScript types
└── data/                 # Configuration (tabConfig.ts)
```

## Tab Configuration

Edit `src/data/tabConfig.ts` to configure your project-specific tabs:

### Tab Settings
```typescript
{
  id: "displays",
  label: "Displays",
  showSummary: true, // Show summary row and progress bars (default: true)
  rows: [...]
}
```

### Basic Row Configuration
```typescript
{
  id: "unique-id",
  label: "Display Name",
  jiraLabels: ["label1", "label2"], // Tickets with ANY of these labels
  deadline: "2026-12-31", // Format: YYYY-MM-DD
}
```

### Advanced Filtering
```typescript
{
  id: "advanced-example",
  label: "Advanced Example",
  jiraLabels: ["required-label"],
  requireAllLabels: true, // Ticket must have ALL labels (AND logic)
  excludeLabels: ["excluded-label"], // Ticket must NOT have these labels (NOT logic)
  deadline: "2026-12-31",
}
```

See `src/data/tabConfig.example.ts` for more examples.

## Features

- 📊 Two tabs: Displays and Features
- ✅ Track completed tickets and Story Points
- 📅 Display deadlines and remaining working days
- 📈 Progress bar with color coding (green >80%, yellow 50-80%, red <50%)
- 📊 Story Points progress bars (completed vs remaining)
- 💪 Motivational messages based on progress
- 💾 Data caching in localStorage
- 🔄 Refresh button to update data
- ⏱️ Timestamp of last data fetch
- ⚙️ Configurable team name and release number
- 🎨 Customizable team icon (emoji or image URL) for header and favicon
- 🔧 Per-tab summary visibility control

## Notes

- Application requires connection to JIRA Server through SOCKS proxy
- JIRA token is securely stored only on server-side
- Working days are counted Monday to Friday (excluding holidays)
- Ticket is considered completed based on configurable resolution status (default: "Solved")
- Story Points field is configurable to match your JIRA instance
