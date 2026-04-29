<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0D1117,50:1a1a2e,100:16213e&height=140&section=header&animation=fadeIn" />

# 🚀 DevPulse — Developer Productivity MVP

### Metrics → Insights → Action

<img src="https://readme-typing-svg.demolab.com?font=Inter&weight=500&size=18&pause=1000&color=58A6FF&center=true&vCenter=true&width=700&lines=Beyond+Metrics+—+Interpretation+Engine;Developer+Productivity+Insights;Actionable+Engineering+Feedback;Built+with+Modern+React+Stack" />

<br/>

<a href="https://dev-pulse-kohl.vercel.app">
  <img src="https://img.shields.io/badge/🌐 Live Demo-000?style=for-the-badge&logo=vercel&logoColor=white"/>
</a>

</div>

---

# DevPulse — Developer Productivity MVP

## What the assignment asked for

The assignment brief had one core problem statement: **metrics alone don't explain what's happening or what to do next.** Developers and managers can already see numbers like lead time and bug rate — the gap is interpretation and action.

Specifically it asked to:
- Build a **React.js MVP** with at least one IC (Individual Contributor) view
- Show current metrics for a developer
- **Interpret the story behind those metrics** — not just display them
- Suggest **practical next steps** based on what the data implies
- Optionally add a lightweight manager summary page
- Use the provided workbook data (5 source tables, 5 metrics)
- Keep scope focused — a sharp small MVP beats a broad unfinished one

## What this project does

### The gap it fills
Most productivity dashboards stop at the number. DevPulse adds an **interpretation engine** (`src/data/interpret.js`) that reads a developer's metrics, compares them against thresholds, and produces three things:
1. A plain-English **story** — "Your delivery pipeline is running well" vs "Speed may be outrunning your quality process"
2. **Signal breakdown** — each metric explained in context (not just red/green)
3. **Prioritized next steps** — specific, actionable advice like "Break tickets into 2–3 day units" or "Establish a 24h review SLA with your team"

### Pages
**IC Profile (`/`)** — Select any developer and month. See all 5 metrics with month-over-month trend arrows, the interpreted story, signal cards, next steps, review health stats, PR detail table, and a trend chart.

**Manager View (`/manager`)** — Team-level summary cards for all 3 managers with aggregated metrics, a bar chart comparing teams, and per-member breakdowns with pattern labels.

### Data
All data comes from `src/data/rawData.js` — the workbook's 5 tables encoded as JS arrays. No backend needed; the assignment explicitly said "any reasonable backend or mock API."

---

## ⚡ Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **React 19** | Required by assignment |
| Build tool | **Vite 8** | Fast dev server, first-class React support |
| Styling | **Tailwind CSS v4** (via `@tailwindcss/vite`) | v4 uses CSS-native `@theme` variables, no config file needed |
| Routing | **React Router DOM v7** | Two-page SPA (IC + Manager views) |
| Charts | **Recharts 3** | Composable, works well with React 19, no deprecated APIs |
| Fonts | **Plus Jakarta Sans** + **IBM Plex Mono** | Professional, readable, not generic |
| Data layer | Plain JS (no ORM, no fetch) | Clean mock data; easily swappable for a real API |

---

## 🗂️ Project Structure

```
src/
├── data/
│   ├── rawData.js       — All 5 workbook tables as JS arrays (developers,
│   │                      metrics, pull requests, bugs, manager summaries)
│   └── interpret.js     — Interpretation engine: thresholds, signal logic,
│                          story generator, next-step suggestions
│
├── components/
│   ├── Layout.jsx        — Sidebar + content wrapper, handles mobile drawer
│   ├── Sidebar.jsx       — Fixed nav (desktop) / slide-in drawer (mobile)
│   ├── MetricCard.jsx    — Single metric tile with status badge + trend arrow
│   ├── TrendChart.jsx    — Recharts line chart, 2-month trend per developer
│   ├── InterpretPanel.jsx — Story + signal cards + next steps renderer
│   └── PRTable.jsx       — PR detail table with highlighted anomalies
│
└── pages/
    ├── ICPage.jsx         — Individual Contributor full-page view
    └── ManagerPage.jsx    — Manager team summary + comparison view
```

---

## 🚀 Running locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

---

## 📊 The 5 metrics (as defined by the assignment)

| Metric | Definition used |
|---|---|
| Lead Time for Changes | Avg days from PR opened → successful prod deployment |
| Cycle Time | Avg days from issue moved to In Progress → marked Done |
| Bug Rate | Escaped prod bugs ÷ issues completed in the month |
| Deployment Frequency | Count of successful prod deployments in the month |
| PR Throughput | Count of merged pull requests in the month |

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:16213e,50:1a1a2e,100:0D1117&height=100&section=footer" />

</div>
