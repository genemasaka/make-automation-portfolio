/**
 * RegWatch detector (Day 2)
 * Reads every active source page, finds links that are not yet in "Seen Links",
 * adds them to Items as New, and writes an Audit Log line.
 * The first run only records a baseline, so history is never processed.
 * Then reads the text of each new item's PDF into the "Doc Text" tab.
 */
const TZ = 'Africa/Nairobi';
const MAX_NEW_PER_RUN = 25;      // safety stop if a page changes shape
const ITEM_COLUMNS = 22;         // width of the Items tab
const MAX_TEXTS_PER_RUN = 5;     // PDFs read per run
const MAX_TEXT_CHARS = 45000;    // a cell holds at most 50,000 characters

function dailyRun() {
  detectNewItems();
  readNewItemTexts();
}

function detectNewItems() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return;
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sourcesSheet = ss.getSheetByName('Sources');
    const itemsSheet = ss.getSheetByName('Items');
    const auditSheet = ss.getSheetByName('Audit Log');
    const seenSheet = getSeenSheet_(ss);
    const now = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm');

    const seenLast = seenSheet.getLastRow();
    const seen = new Set(
      seenLast > 1 ? seenSheet.getRange(2, 1, seenLast - 1, 1).getValues().map(r => String(r[0])) : []
    );
    const baselineMode = seen.size === 0;
    let nextNumber = highestItemNumber_(itemsSheet);

    const lastRow = sourcesSheet.getLastRow();
    const sources = lastRow > 1 ? sourcesSheet.getRange(2, 1, lastRow - 1, 9).getValues() : [];

    sources.forEach((s, i) => {
      const [sourceId, name, pageUrl, , , active] = s;
      if (String(active).toLowerCase() !== 'yes' || !pageUrl) return;
      try {
        const rows = fetchRows_(String(pageUrl));
        if (rows.length === 0) throw new Error('No table rows found. The page may have changed.');
        const fresh = rows.filter(r => !seen.has(r.path));
        if (baselineMode) {
          writeSeen_(seenSheet, fresh, sourceId, now, 'Baseline');
          fresh.forEach(r => seen.add(r.path));
          log_(auditSheet, now, 'Item detected', '', 'Baseline recorded for ' + sourceId + ': ' + fresh.length + ' links, no items created');
        } else if (fresh.length > MAX_NEW_PER_RUN) {
          throw new Error(fresh.length + ' new links found, more than the limit of ' + MAX_NEW_PER_RUN + '. Nothing was added.');
        } else {
          fresh.forEach(r => {
            nextNumber += 1;
            const id = 'RW-' + String(nextNumber).padStart(4, '0');
            const row = new Array(ITEM_COLUMNS).fill('');
            row[0] = id; row[1] = sourceId; row[2] = r.title; row[3] = r.url;
            row[4] = r.published; row[5] = itemType_(name, r.title); row[6] = now; row[7] = 'New';
            itemsSheet.appendRow(row);
            log_(auditSheet, now, 'Item detected', id, 'Source ' + sourceId + ': ' + r.title);
            seen.add(r.path);
          });
          writeSeen_(seenSheet, fresh, sourceId, now, 'Detected');
        }
        sourcesSheet.getRange(i + 2, 7).setValue(now);
      } catch (err) {
        log_(auditSheet, now, 'Error', '', 'Source ' + sourceId + ': ' + err.message);
      }
    });
  } finally {
    lock.releaseLock();
  }
}

function readNewItemTexts() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return;
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const items = ss.getSheetByName('Items');
    const audit = ss.getSheetByName('Audit Log');
    const textSheet = getTextSheet_(ss);
    const now = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm');

    const doneLast = textSheet.getLastRow();
    const done = new Set(
      doneLast > 1 ? textSheet.getRange(2, 1, doneLast - 1, 1).getValues().map(r => String(r[0])) : []
    );
    const last = items.getLastRow();
    if (last < 2) return;
    const rows = items.getRange(2, 1, last - 1, 8).getValues();   // columns A to H
    let count = 0;
    for (const r of rows) {
      const [id, , title, url, , , , status] = r;
      if (!id || String(status) !== 'New' || done.has(String(id)) || !url) continue;
      if (count >= MAX_TEXTS_PER_RUN) break;
      count += 1;
      try {
        const text = pdfToText_(String(url), String(id));
        if (text.length < 200) {
          throw new Error('Only ' + text.length + ' characters of text found. The PDF may be a scan or empty.');
        }
        textSheet.appendRow([id, 'Read', text.length, now, text.slice(0, MAX_TEXT_CHARS)]);
      } catch (err) {
        textSheet.appendRow([id, 'Not read', 0, now, err.message]);
        audit.appendRow([now, 'Error', id, '', 'System (detector script)', 'Could not read the document: ' + err.message]);
      }
    }
  } finally {
    lock.releaseLock();
  }
}

function pdfToText_(url, id) {
  const res = UrlFetchApp.fetch(url, {
    muteHttpExceptions: true,
    followRedirects: true,
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RegWatch/1.0)' }
  });
  if (res.getResponseCode() !== 200) throw new Error('HTTP ' + res.getResponseCode());
  const blob = res.getBlob().setContentType('application/pdf');
  const file = Drive.Files.create(
    { name: 'RegWatch temp ' + id, mimeType: 'application/vnd.google-apps.document' },
    blob,
    { ocrLanguage: 'en' }
  );
  try {
    return DocumentApp.openById(file.id).getBody().getText().trim();
  } finally {
    DriveApp.getFileById(file.id).setTrashed(true);
  }
}

function fetchRows_(url) {
  const res = UrlFetchApp.fetch(url, {
    muteHttpExceptions: true,
    followRedirects: true,
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RegWatch/1.0)' }
  });
  if (res.getResponseCode() !== 200) throw new Error('HTTP ' + res.getResponseCode());
  const html = res.getContentText();
  const origin = (url.match(/^https?:\/\/[^\/]+/) || [''])[0];
  const out = [];
  const onPage = new Set();
  const trRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let m;
  while ((m = trRe.exec(html)) !== null) {
    const cells = [];
    const tdRe = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let c;
    while ((c = tdRe.exec(m[1])) !== null) cells.push(c[1]);
    if (cells.length < 2) continue;
    const hrefMatch = cells[1].match(/href\s*=\s*["']([^"']+)["']/i);
    if (!hrefMatch) continue;
    const path = decode_(hrefMatch[1]).trim();
    if (onPage.has(path)) continue;
    onPage.add(path);
    out.push({ published: clean_(cells[0]), title: clean_(cells[1]), path: path, url: absoluteUrl_(origin, path) });
  }
  return out;
}

function absoluteUrl_(origin, path) {
  if (/^https?:\/\//i.test(path)) return path;
  const full = origin + (path.charAt(0) === '/' ? '' : '/') + path;
  return full.indexOf('%') === -1 ? encodeURI(full) : full;
}

function decode_(s) {
  return String(s).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function clean_(s) {
  return decode_(String(s).replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function itemType_(sourceName, title) {
  if (/circular/i.test(sourceName)) return 'Circular';
  if (/press release/i.test(title)) return 'Press release';
  if (/public notice/i.test(title)) return 'Public notice';
  return 'Other';
}

function highestItemNumber_(items) {
  const last = items.getLastRow();
  let max = 0;
  if (last > 1) {
    items.getRange(2, 1, last - 1, 1).getValues().forEach(r => {
      const m = String(r[0]).match(/^RW-(\d+)$/);
      if (m) max = Math.max(max, Number(m[1]));
    });
  }
  return max;
}

function getSeenSheet_(ss) {
  let sh = ss.getSheetByName('Seen Links');
  if (!sh) {
    sh = ss.insertSheet('Seen Links');
    sh.appendRow(['Link path (identity)', 'Title', 'Source ID', 'Published (as shown)', 'First seen', 'Status']);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, 6).setFontWeight('bold');
    sh.setColumnWidth(1, 420);
    sh.setColumnWidth(2, 380);
  }
  return sh;
}

function getTextSheet_(ss) {
  let sh = ss.getSheetByName('Doc Text');
  if (!sh) {
    sh = ss.insertSheet('Doc Text');
    sh.appendRow(['Item ID', 'Read status', 'Characters', 'Read at', 'Text (first 45,000 characters)']);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, 5).setFontWeight('bold');
    sh.setColumnWidth(5, 600);
  }
  return sh;
}

function writeSeen_(sheet, rows, sourceId, now, status) {
  if (!rows.length) return;
  const values = rows.map(r => [r.path, r.title, sourceId, r.published, now, status]);
  sheet.getRange(sheet.getLastRow() + 1, 1, values.length, 6).setValues(values);
}

function log_(sheet, now, event, itemId, details) {
  sheet.appendRow([now, event, itemId, '', 'System (detector script)', details]);
}

/** Run once to make the whole daily job run at about 06:00 Nairobi time. */
function installDailyTrigger() {
  ScriptApp.getProjectTriggers()
    .filter(t => ['detectNewItems', 'dailyRun'].indexOf(t.getHandlerFunction()) !== -1)
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('dailyRun').timeBased().everyDays(1).atHour(6).inTimezone(TZ).create();
}
