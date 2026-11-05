# RegWatch

A regulatory change monitor for a bank's compliance team, built in public
on Make's free plan.

Compliance teams track new circulars, notices and guidelines by hand, and
a missed one can become an audit finding. RegWatch watches the regulators'
public pages and drafts a summary of each new item, with the units it may
affect and a proposed action. A compliance officer decides, and only then
are tasks created, with deadlines, reminders, escalation and a complete
audit trail.

The demo client is a fictional "Demo Bank Kenya Ltd". All documents used
are public, and no customer data is involved. This project is not
affiliated with any regulator or bank.

## Principles
- The AI proposes and a person decides
- No customer data
- The AI is optional, with a rules-only mode
- Every event is logged in an append-only audit log
- It has to run on Make's free plan

## Progress

| Day | Build | Credit budget | Status |
|-----|-------|---------------|--------|
| 1 | [Design](day-01-design/) | 0 | Done |
| 2 | The Watcher: detect new items | 30 | Planned |
| 3 | Read documents and draft summaries | 60 | Planned |
| 4 | Human review and task creation | 45 | Planned |
| 5 | Deadlines, reminders and escalation | 45 | Planned |
| 6 | Audit log, error alerts and the monthly report | 25 | Planned |
| 7 | End-to-end test and packaging | 40 | Planned |

Each day has its own folder with a README, screenshots and the credits
used. The budget is an estimate, and each day's README records the actual
figure.
