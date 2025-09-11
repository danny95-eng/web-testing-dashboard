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
    screenshots: row.get('Screenshots') || '',
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
  console.log('API /api/ideas called with method:', req.method);
  try {
    const doc = await getDoc();
    console.log('Doc loaded successfully');
    const sheet = await ensureSheet(doc, 'Ideas');
    console.log('Sheet ensured');

    if (req.method === 'GET') {
      const ideas = await getIdeas(sheet);
      console.log('Ideas fetched:', ideas.length);
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

  const { title, description, submittedBy, screenshots } = body || {};
  console.log('POST data received:', { title, description: description ? 'present' : 'none', submittedBy, screenshots: screenshots ? `${screenshots.length} chars` : 'none' });
      if (!title || !description) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Title and Description are required.' }));
        return;
      }

      // Check if screenshots data is too large for Google Sheets
      let processedScreenshots = screenshots || '';
      if (processedScreenshots && processedScreenshots.length > 40000) {
        console.warn('Screenshots data too large for Google Sheets, truncating...');
        processedScreenshots = processedScreenshots.substring(0, 40000) + '...[truncated]';
      }

  await sheet.addRow({
        ID: `IDEA-${Date.now()}`,
        Title: title,
        Description: description,
        Screenshots: processedScreenshots,
        'Submitted By': submittedBy || 'Anonymous',
        Status: 'Pending',
        Timestamp: new Date().toISOString(),
      });
      console.log('Row added successfully');

      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Idea submitted successfully!' }));
      return;
    }

    if (req.method === 'PUT') {
      // Read JSON body safely
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

      const { id, title, description, submittedBy, screenshots } = body || {};
      console.log('PUT data received:', { id, title, description: description ? 'present' : 'none', submittedBy, screenshots: screenshots ? `${screenshots.length} chars` : 'none' });
      if (!id) {
        res.statusCode = 400; res.setHeader('Content-Type','application/json');
        res.end(JSON.stringify({ error: 'ID is required for updates.' }));
        return;
      }

      // Truncate very large screenshots payloads
      let processedScreenshots = screenshots || '';
      if (processedScreenshots && processedScreenshots.length > 40000) {
        console.warn('Screenshots data too large for Google Sheets, truncating on PUT...');
        processedScreenshots = processedScreenshots.substring(0, 40000) + '...[truncated]';
      }

      const rows = await sheet.getRows();
      const row = rows.find(r => r.get('ID') === id);
      if (!row) {
        res.statusCode = 404; res.setHeader('Content-Type','application/json');
        res.end(JSON.stringify({ error: 'Idea not found.' }));
        return;
      }

      if (title !== undefined) row['Title'] = title;
      if (description !== undefined) row['Description'] = description;
      if (submittedBy !== undefined) row['Submitted By'] = submittedBy;
      if (processedScreenshots !== undefined) row['Screenshots'] = processedScreenshots;
      await row.save();

      res.statusCode = 200; res.setHeader('Content-Type','application/json');
      res.end(JSON.stringify({ message: 'Idea updated successfully!' }));
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
