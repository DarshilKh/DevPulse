import { pullRequests, bugReports } from './rawData.js'

// Thresholds derived from dataset ranges
const THRESHOLDS = {
  leadTime: { good: 3.0, warn: 4.5 },
  cycleTime: { good: 4.0, warn: 6.0 },
  bugRate: { good: 0, warn: 0.3 },
  reviewWait: { good: 12, warn: 20 }, // hours
}

function classify(value, thresholds) {
  if (value <= thresholds.good) return 'good'
  if (value <= thresholds.warn) return 'warn'
  return 'bad'
}

export function getInterpretation(devMetric, prData) {
  const { avg_lead_time_days, avg_cycle_time_days, bug_rate_pct, merged_prs, pattern_hint } = devMetric

  const leadStatus = classify(avg_lead_time_days, THRESHOLDS.leadTime)
  const cycleStatus = classify(avg_cycle_time_days, THRESHOLDS.cycleTime)
  const bugStatus = classify(bug_rate_pct, THRESHOLDS.bugRate)

  const avgReviewWait = prData.length > 0
    ? prData.reduce((s, p) => s + p.review_wait_hours, 0) / prData.length
    : 0
  const reviewStatus = classify(avgReviewWait, THRESHOLDS.reviewWait)

  // Build story
  const signals = []
  const actions = []

  if (cycleStatus === 'bad') {
    signals.push({ type: 'warn', text: `Cycle time of ${avg_cycle_time_days.toFixed(1)}d is high — work is staying open longer than expected once started.` })
    actions.push({ priority: 'high', icon: '🎯', text: 'Break down tickets into smaller units. Aim for items completable in 2–3 days to tighten your feedback loop.' })
  } else if (cycleStatus === 'warn') {
    signals.push({ type: 'info', text: `Cycle time (${avg_cycle_time_days.toFixed(1)}d) is in the caution zone. Slightly elevated but not critical.` })
  } else {
    signals.push({ type: 'good', text: `Cycle time of ${avg_cycle_time_days.toFixed(1)}d is solid — work moves quickly once started.` })
  }

  if (leadStatus === 'bad') {
    signals.push({ type: 'warn', text: `Lead time to production (${avg_lead_time_days.toFixed(1)}d) is slower than ideal. Changes take a while to reach users.` })
    if (reviewStatus === 'bad') {
      actions.push({ priority: 'high', icon: '⏱️', text: `Review wait is averaging ${avgReviewWait.toFixed(0)}h. Work with your team to establish a 24h review SLA.` })
    } else {
      actions.push({ priority: 'medium', icon: '🚀', text: 'Lead time lag is likely in the deploy pipeline. Check if deployments can be batched or triggered more frequently.' })
    }
  } else if (leadStatus === 'warn') {
    signals.push({ type: 'info', text: `Lead time (${avg_lead_time_days.toFixed(1)}d) is moderate. There's room to speed up the path to production.` })
  } else {
    signals.push({ type: 'good', text: `Lead time of ${avg_lead_time_days.toFixed(1)}d is healthy — changes reach production quickly.` })
  }

  if (bugStatus !== 'good') {
    signals.push({ type: 'risk', text: `Bug rate of ${(bug_rate_pct * 100).toFixed(0)}% — at least one escaped bug this month. Quality checks need attention.` })
    actions.push({ priority: 'high', icon: '🐛', text: 'Add a pre-merge checklist for edge cases and input validation. Consider one extra test scenario per ticket.' })
  } else {
    signals.push({ type: 'good', text: 'No escaped bugs this month. Quality looks clean.' })
  }

  if (reviewStatus === 'bad' && leadStatus !== 'bad') {
    actions.push({ priority: 'medium', icon: '👁️', text: `Review wait averages ${avgReviewWait.toFixed(0)}h. Try posting your PR in team chat to get faster eyes on it.` })
  }

  if (actions.length === 0) {
    actions.push({ priority: 'low', icon: '✅', text: 'Metrics are healthy. Keep the current cadence and look for opportunities to mentor others or reduce tech debt.' })
  }

  // Overall story summary
  let story = ''
  if (pattern_hint === 'Healthy flow') {
    story = 'Your delivery pipeline is running well. Work starts, moves, and ships at a good pace with no quality alarms.'
  } else if (pattern_hint === 'Quality watch') {
    story = 'You\'re shipping consistently, but escaped bugs signal the pace may be outrunning the quality process. Speed and quality need to be rebalanced.'
  } else if (pattern_hint === 'Needs review') {
    story = 'Cycle times are elevated and the pipeline is showing strain. This could mean tickets are too large, blocked, or need tighter scoping.'
  }

  return { signals, actions, story, avgReviewWait, leadStatus, cycleStatus, bugStatus, reviewStatus }
}

export function getDeveloperPRs(developerId, month) {
  return pullRequests.filter(p => p.developer_id === developerId && p.month_merged === month)
}

export function getDeveloperBugs(developerId, month) {
  return bugReports.filter(b => b.developer_id === developerId && b.month_found === month)
}

export function getTrend(current, previous, lowerIsBetter = true) {
  if (!previous) return null
  const diff = current - previous
  const pct = Math.abs((diff / previous) * 100).toFixed(0)
  if (Math.abs(diff) < 0.1) return { dir: 'flat', pct: 0 }
  const improved = lowerIsBetter ? diff < 0 : diff > 0
  return { dir: improved ? 'up' : 'down', pct, raw: diff, improved }
}
