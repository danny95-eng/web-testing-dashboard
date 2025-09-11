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
  if (!existing.length || headers.some(h => !existing.includes(h))) {
    console.warn(`[api/complete-test] Resetting header row for sheet "${title}" to ensure required columns exist.`);
    await sheet.setHeaderRow(headers);
  }
  return sheet;
}

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.statusCode = 405; res.setHeader('Allow','POST'); return res.end('Method Not Allowed');
    }

    let body = req.body;
    if (!body || (typeof body === 'string' && body.trim() === '')) {
      const buffers = [];
      await new Promise((resolve) => { req.on('data', c => buffers.push(c)); req.on('end', resolve); });
      const raw = Buffer.concat(buffers).toString();
      body = raw ? JSON.parse(raw) : {};
    } else if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    const { id, name, startDate, endDate, tester, result, results, screenshots } = body || {};
    console.log('Complete test data received:', { id, name, startDate, endDate, tester, result, results: results ? 'present' : 'none', screenshots: screenshots ? `${screenshots.length} chars` : 'none' });
    console.log('[API /api/complete-test POST] Full body:', JSON.stringify(body, null, 2)); // DEBUG
    if (!name) { res.statusCode = 400; res.end(JSON.stringify({ error: 'name is required' })); return; }

    // Check if screenshots data is too large for Google Sheets
    let processedScreenshots = screenshots || '';
    if (processedScreenshots && processedScreenshots.length > 40000) {
      console.warn('Screenshots data too large for Google Sheets, truncating...');
      processedScreenshots = processedScreenshots.substring(0, 40000) + '...[truncated]';
    }

    const doc = getDoc();
    const headers = ['ID','Name','Start Date','End Date','Tester','Result','Results','Screenshots','Timestamp'];
    const sheet = await ensureSheetWithHeaders(doc, 'Completed Tests', headers);
    await sheet.addRow({
      ID: id || `TEST-${Date.now()}`,
      Name: name,
      'Start Date': startDate || '',
      'End Date': endDate || '',
      Tester: tester || '',
      Result: result || '',
      Results: results || '',
      Screenshots: processedScreenshots,
      Timestamp: new Date().toISOString(),
    });

    res.statusCode = 201;
    res.setHeader('Content-Type','application/json');
    res.end(JSON.stringify({ message: 'Test completed recorded' }));
  } catch (err) {
    console.error('API /api/complete-test error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type','application/json');
    res.end(JSON.stringify({ error: 'Internal Server Error', details: err.message }));
  }
}
