# Day 11: AI Resume Screening

## The problem
A single job advert can bring in dozens of CVs. Reading them all
takes hours, so good candidates get missed or hear back late.

## The solution
A Make.com scenario that screens each application against a job
description. For every new application it:
1. Reads the applicant's CV text from a Google Sheet filled by a form
2. Sends only the CV text to an AI model, never the name, with four
   yes/no questions about the role's must-haves
3. Adds up the answers in the workflow to give a score of 0 to 100
4. Writes the score, a recommendation, the evidence and the gaps back
   into the sheet, marked "awaiting human review"
5. Emails an alert for any applicant scoring 75 or more

Nothing is ever rejected or sent to an applicant automatically. A
person reads every CV and makes every decision.

## Tools used
Make.com, Google Forms, Google Sheets, OpenAI (GPT-5 nano), Gmail

## Scenario flow
![Scenario](01-scenario.png)

## Result
![Screened applicants](02-sheet-final.png)
![Alert emails](03-alert-inbox.png)
![One alert](04-alert-email.png)

## Proof it runs unattended
The History tab shows a run that picked up a new applicant without
me starting it:

![Run history](05-history.png)

## Run history: why the score can't rank people
Wanjiru and Peter submitted identical CV text, so any difference
between their scores in a run is randomness, not merit.

| Run | Method | Wanjiru | Daniel | Samuel | Kevin | Peter |
|-----|--------|---------|--------|--------|-------|-------|
| 1 | 0 to 100 score | 90 | 60 | 20 | 60 | 92 |
| 2 | Stricter rule | 90 | 60 | 30 | 58 | 65 |
| 3 | Checklist, loose tool definition | 100 | 75 | 25 | 50 | 100 |
| 4 | Verb-evidence rule | 100 | 100 | 25 | 25 | 100 |
| 5 | Strict tool definition | 100 | 75 | 25 | 0 | 75 |
| 6 | Objective English check | 75 | 25 | 0 | 0 | 100 |

Screenshots of each run:

![Run 1](run-history/run1-score-0-100.png)
![Run 2](run-history/run2-stricter-rule.png)
![Run 3](run-history/run3-checklist.png)
![Run 4](run-history/run4-verb-evidence.png)
![Run 5](run-history/run5-strict-tool-definition.png)
![Run 6](run-history/run6-objective-english.png)

Two bugs along the way:

![Every score capped at 35](run-history/bug-a-cap-all-35.png)
![Score showing NaN](run-history/bug-b-nan-score.png)

## Lessons learned
- Asking a model for a 0 to 100 score is unreliable. The same CV
  scored 90 in one run and 65 in another. Four yes/no questions,
  added up by the workflow, were far steadier.
- A keyword-stuffed CV fooled the first prompts. Kevin's CV was only
  a list of tool names and scored 60. Requiring evidence of described
  work, and a strict definition of what counts as a ticketing tool,
  brought it to 0.
- A generic notes system was counted as a ticketing tool until the
  definition named what does and does not qualify.
- Fixing one problem exposed the next. A safety cap that depended on
  a field silently treated an empty value as zero and capped every
  score at 35. A formula with brackets typed as text produced NaN. A
  comparison typed as text made everyone a "Shortlist".
- The name is never sent to the model, so it cannot influence the
  score. Identical CVs under different names are the test of that.
- Subjective checks drift most. "Excellent written English" varied
  between runs, so it became "at least three complete sentences".
- The alert fires at 75 or more, not only 100, so a borderline run
  still reaches a human. Every alert says the score is a rough signal.
- A CV in completely different wording from the others still scored
  100, so the screener recognised experience and not phrases.

## Known limitations
- On the free model, the same CV can land on different sides of the
  shortlist line between runs. This tool can triage. It cannot rank.
- The model only sees the text an applicant typed. A strong candidate
  with a badly written CV can score low.
- CVs are personal data. Real use needs a lawful basis, an AI provider
  whose data terms fit, applicants being told that automated tools are
  used, and a person making every decision. This demo uses fictional
  CVs only.
- The Gaps column in older rows shows raw field names. The prompt was
  fixed afterwards and applies to new rows.

## What I'd add next
- Run each CV three times and use the majority answer
- Test a stronger model and compare its consistency with this one
- Log the job description version used for each score
- A blind-review view that hides the name and email from the reviewer
- Anonymise CVs before they reach the model

## Setup
Import `resume-screening.json` into Make and reconnect your own
Google and OpenAI accounts. Create a form linked to a sheet with the
columns Full name, Email address and CV text, then Score,
Recommendation, Strengths, Gaps and Status. Paste your own job
description and must-haves into the OpenAI prompt, and point the
modules at your own sheet. Use fictional CVs while testing.
