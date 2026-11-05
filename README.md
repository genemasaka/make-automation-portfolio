# Make.com Automation Portfolio

Real-world business automations built in Make.com, each one built from
scratch and documented from the problem to the lessons learned.

Every project has its own folder with the problem, the solution,
screenshots of the working scenario, the tests that were run, the lessons
learned, the known limitations and, where there is one, an importable
Make.com blueprint. New projects are added as I build them.

By Eugene Masaka | [LinkedIn](https://www.linkedin.com/in/eugene-masaka/)

## Projects

### Latest: RegWatch, a regulatory change monitor for banks (in progress)
A compliance tool that watches regulators' public pages, drafts a summary of each new item and lets a person decide, with tasks, reminders, escalation and an audit trail. Built in public on Make's free plan, one day at a time.

[Progress and daily write-ups](regwatch/)

### October 2026: 15 standalone automations

### Five lessons that kept coming back
1. Data formats cause more bugs than logic
2. Every automation needs a stop condition
3. Let the AI say "unclear" and let the workflow decide
4. Keep a human in the loop
5. Test the failure, not the happy path
   
## Projects

| Day | Project | What it solves | Tools | Details | Post |
|-----|---------|----------------|-------|---------|------|
| 1 | Lead capture and auto-reply | Leads go unanswered and urgent ones are missed | Forms, Sheets, Gmail | [Folder](https://github.com/genemasaka/make-automation-portfolio/tree/master/day-01-lead-capture) | [Post](https://lnkd.in/p/djXKXxY7) |
| 2 | Invoice and receipt filing | Invoices vanish into inboxes | Gmail, Drive, Sheets | [Folder](https://github.com/genemasaka/make-automation-portfolio/tree/master/day-02-invoice-filing) | [Post](https://lnkd.in/p/ddxwAPZ9) |
| 3 | Meeting confirmations and reminders | Meetings are forgotten and attendees arrive unprepared | Calendar, Gmail, Sheets | [Folder](https://github.com/genemasaka/make-automation-portfolio/tree/master/day-03-meeting-automation) | [Post](https://lnkd.in/p/dVADktpt) |
| 4 | Social post scheduler | Posting consistently depends on someone remembering | Sheets, LinkedIn | [Folder](https://github.com/genemasaka/make-automation-portfolio/tree/master/day-04-social-post-scheduler) | [Post](https://lnkd.in/p/dnvsaDA4) |
| 5 | Customer feedback sentiment tagging | Feedback is collected and never read | Forms, Sheets, OpenAI, Gmail | [Folder](https://github.com/genemasaka/make-automation-portfolio/tree/master/day-05-feedback-sentiment) | [Post](https://lnkd.in/p/dJdY9yKm) |
| 6 | Weekly sales report | Weekly summaries are built by hand or skipped | Sheets, Gmail | [Folder](https://github.com/genemasaka/make-automation-portfolio/tree/master/day-06-weekly-sales-report) | [Post](https://lnkd.in/p/deszFChR) |
| 7 | Client quote generator | Slow quotes lose deals | Forms, Sheets, Docs, Drive, Gmail | [Folder](https://github.com/genemasaka/make-automation-portfolio/tree/master/day-07-quote-generator) | [Post](https://lnkd.in/p/dyWjX5t7) |
| 9 | AI email triage | Reading and replying to routine email eats the morning | Gmail, OpenAI, Sheets | [Folder](https://github.com/genemasaka/make-automation-portfolio/tree/master/day-09-ai-email-triage) | [Post](https://lnkd.in/p/d4JScWhh) |
| 10 | Meeting notes summary | Notes are never turned into summaries and action items | Drive, Docs, OpenAI, Gmail, Sheets | [Folder](day-10-meeting-notes-summary/) | [Post](PASTE-DAY-10-POST-URL) |
| 11 | AI resume screening | Reading dozens of CVs takes hours and good candidates get missed | Forms, Sheets, OpenAI, Gmail | [Folder](https://github.com/genemasaka/make-automation-portfolio/tree/master/day-11-resume-screening/day-11-resume-screening) | [Post](https://lnkd.in/p/dqUVVyQS) |
| 12 | Content repurposer | One article is rewritten by hand for every channel | Forms, Sheets, OpenAI, Gmail | [Folder](https://github.com/genemasaka/make-automation-portfolio/tree/master/day-12-content-repurposer) | [Post](https://lnkd.in/p/d9gzGANK) |
| 13 | Overdue invoice reminders | Chasing late payments is awkward and inconsistent | Sheets, Gmail | [Folder](https://github.com/genemasaka/make-automation-portfolio/tree/master/day-13-invoice-reminders) | [Post](https://lnkd.in/p/dJtV4TGa) |
| 14 | Client onboarding | Setting up a new client by hand is slow and inconsistent | Forms, Sheets, Drive, Gmail | [Folder](https://github.com/genemasaka/make-automation-portfolio/tree/master/day-14-client-onboarding) | [Post](https://lnkd.in/p/da9uVfcF) |
| 15 | Daily news digest | Keeping up with relevant news means opening a dozen sites | RSS, OpenAI, Gmail | [Folder](https://github.com/genemasaka/make-automation-portfolio/tree/master/day-15-news-digest) | [Post](https://lnkd.in/p/dwH6GccM) |
| 16 | Receipt expense tracker | Receipts pile up and month-end reports mean hours of retyping | Gmail, OpenAI, Sheets | [Folder](https://github.com/genemasaka/make-automation-portfolio/tree/master/day-16-expense-tracker) | [Post](https://lnkd.in/p/d_Y5m2hZ) |
## RegWatch (November 2026)
A regulatory change monitor for a bank's compliance team, built in public on Make's free plan.
[Progress and daily write-ups](regwatch/)


The October series is complete. Newer projects are listed above.

## What these projects demonstrate

- **Triggers and scheduling:** form and sheet watchers, calendar
  events, daily and weekly schedules
- **Data handling:** filters, iterators for lists, text and numeric
  aggregators, lookups across sheets, helper columns
- **AI in a workflow:** classifying text with a language model,
  forcing structured JSON output, parsing it into fields, and
  tuning the prompt to cut false alerts
- **Document automation:** filling a Google Doc template, converting
  it to PDF, attaching it to an email
- **Reliability:** duplicate prevention, fallback values for blank
  fields, filters that stop bad data, and honest notes on each
  project's known limitations
  
## How this portfolio is organised
- Standalone automations are numbered by day and live in folders such as `day-05-feedback-sentiment`
- Larger builds, such as RegWatch, have their own folder with a README and one folder per day
  
## How to use a blueprint

1. In Make, create a new scenario, click the three dots at the bottom
   and choose **Import Blueprint**.
2. Select the `.json` file from the project folder.
3. Reconnect your own accounts and point the modules at your own
   sheets, forms and folders. The Setup section of each README lists
   what to create first.

Blueprints contain no passwords or keys. Personal values are replaced
with placeholders such as `YOUR_SPREADSHEET_ID`.

## About

I build practical automations for small businesses. If you have a
repetitive process that eats hours every week, get in touch on
[LinkedIn](https://www.linkedin.com/in/eugene-masaka/).
