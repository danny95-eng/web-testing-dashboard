const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

async function getDoc() {
  const {
    GOOGLE_CLIENT_EMAIL,
    GOOGLE_PRIVATE_KEY,
    GOOGLE_SHEET_ID,
  } = process.env;

  if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
    throw new Error('Missing required Google Sheets environment variables. Please set GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_SHEET_ID.');
  }

  const serviceAccountAuth = new JWT({
    email: GOOGLE_CLIENT_EMAIL,
    key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return new GoogleSpreadsheet(GOOGLE_SHEET_ID, serviceAccountAuth);
}

async function getIdeas(sheet) {
  const rows = await sheet.getRows();
  return rows.map((row) => ({
    id: row.get('ID'),
    title: row.get('Title'),
    description: row.get('Description'),
    submittedBy: row.get('Submitted By'),
    status: row.get('Status'),
    timestamp: row.get('Timestamp'),
  }));
}

async function ensureSheet(doc, title) {
  await doc.loadInfo();
  let sheet = doc.sheetsByTitle[title];
  if (!sheet) throw new Error(`Sheet titled "${title}" not found`);
  return sheet;
}

module.exports = async (req, res) => {
  try {
    const doc = await getDoc();
    const sheet = await ensureSheet(doc, 'Ideas');

    if (req.method === 'GET') {
      const ideas = await getIdeas(sheet);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(ideas));
      return;
    }

    if (req.method === 'POST') {
      // Read JSON body safely for Vercel Node functions
      let body = req.body;
      if (!body || (typeof body === 'string' && body.trim() === '')) {
        const buffers = [];
        await new Promise((resolve) => {
          req.on('data', (chunk) => buffers.push(chunk));
          req.on('end', resolve);
        });
        const raw = Buffer.concat(buffers).toString();
        body = raw ? JSON.parse(raw) : {};
      } else if (typeof body === 'string') {
        body = JSON.parse(body);
      }

      const { title, description, submittedBy } = body || {};
      if (!title || !description) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Title and Description are required.' }));
        return;
      }

      await sheet.addRow({
        ID: `IDEA-${Date.now()}`,
        Title: title,
        Description: description,
        'Submitted By': submittedBy || 'Anonymous',
        Status: 'Pending',
        Timestamp: new Date().toISOString(),
      });

      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Idea submitted successfully!' }));
      return;
    }

    // Method not allowed
    res.statusCode = 405;
    res.setHeader('Allow', 'GET, POST');
    res.end('Method Not Allowed');
  } catch (err) {
    console.error('API /api/ideas error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal Server Error', details: err.message }));
  }
};
