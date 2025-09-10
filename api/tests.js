const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

function getDoc() {
  const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID } = process.env;
  if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
    throw new Error('Missing required env vars: GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID');
  }
  const auth = new JWT({
    email: GOOGLE_CLIENT_EMAIL,
    key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return new GoogleSpreadsheet(GOOGLE_SHEET_ID, auth);
}

async function ensureSheetWithHeaders(doc, title, headers) {
  await doc.loadInfo();
  let sheet = doc.sheetsByTitle[title];
  if (!sheet) throw new Error(`Sheet titled "${title}" not found`);
  await sheet.loadHeaderRow();
  const existing = sheet.headerValues || [];
  // If no headers or missing required first header, set headers
  if (!existing.length || !existing.includes('ID')) {
    await sheet.setHeaderRow(headers);
  }
  return sheet;
}

function toJson(row, fields) {
  const obj = {};
  for (const f of fields) obj[f] = row.get(f);
  return obj;
}

module.exports = async (req, res) => {
  try {
    const doc = getDoc();
    const url = new URL(req.url, 'http://localhost');
    const status = url.searchParams.get('status') || 'active';

    const ACTIVE_HEADERS = ['ID','Name','Start Date','Expected End Date','Tester','Status','Notes','Screenshots','Timestamp'];
    const COMPLETED_HEADERS = ['ID','Name','Start Date','End Date','Tester','Result','Results','Screenshots','Timestamp'];

    if (req.method === 'GET') {
      if (status === 'completed') {
        const sheet = await ensureSheetWithHeaders(doc, 'Completed Tests', COMPLETED_HEADERS);
        const rows = await sheet.getRows();
        const data = rows.map(r => toJson(r, COMPLETED_HEADERS));
        res.statusCode = 200; res.setHeader('Content-Type','application/json');
        res.end(JSON.stringify(data));
        return;
      }
      const sheet = await ensureSheetWithHeaders(doc, 'Active Tests', ACTIVE_HEADERS);
      const rows = await sheet.getRows();
      const data = rows.map(r => toJson(r, ACTIVE_HEADERS));
      res.statusCode = 200; res.setHeader('Content-Type','application/json');
      res.end(JSON.stringify(data));
      return;
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (!body || (typeof body === 'string' && body.trim() === '')) {
        const buffers = [];
        await new Promise((resolve) => { req.on('data', c => buffers.push(c)); req.on('end', resolve); });
        const raw = Buffer.concat(buffers).toString();
        body = raw ? JSON.parse(raw) : {};
      } else if (typeof body === 'string') {
        body = JSON.parse(body);
      }

      const { name, startDate, expectedEndDate, tester, status: st, notes, screenshots } = body || {};
      if (!name) {
        res.statusCode = 400; res.setHeader('Content-Type','application/json');
        res.end(JSON.stringify({ error: 'Name is required.' }));
        return;
      }
      const sheet = await ensureSheetWithHeaders(doc, 'Active Tests', ACTIVE_HEADERS);
      const id = `TEST-${Date.now()}`;
      await sheet.addRow({
        ID: id,
        Name: name,
        'Start Date': startDate || '',
        'Expected End Date': expectedEndDate || '',
        Tester: tester || '',
        Status: st || 'In Progress',
        Notes: notes || '',
        Screenshots: screenshots || '',
        Timestamp: new Date().toISOString()
      });
      res.statusCode = 201; res.setHeader('Content-Type','application/json');
      res.end(JSON.stringify({ id }));
      return;
    }

    res.statusCode = 405; res.setHeader('Allow','GET, POST'); res.end('Method Not Allowed');
  } catch (err) {
    console.error('API /api/tests error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type','application/json');
    res.end(JSON.stringify({ error: 'Internal Server Error', details: err.message }));
  }
}
