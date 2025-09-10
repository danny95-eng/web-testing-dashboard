const express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

// --- CONFIGURATION ---
const PORT = process.env.PORT || 3000;
// Make sure this is your correct Sheet ID
const SPREADSHEET_ID = 'PASTE_YOUR_SHEET_ID_HERE'; 

// **NEW**: Environment-aware credentials logic
// Check if running in Vercel/production environment
const isProduction = process.env.VERCEL_ENV === 'production';
let credentials;

if (isProduction) {
  // In production, use environment variables
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error('Google credentials environment variables are not set for production.');
  }
  credentials = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    // Vercel escapes the private key, so we need to un-escape it.
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  };
} else {
  // In development, load from the JSON file
  credentials = require('./credentials.json');
}
// -------------------

const app = express();
app.use(express.json());

// Initialize Google Auth with the correct credentials
const serviceAccountAuth = new JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);

// --- API ENDPOINTS ---

// GET all ideas
app.get('/api/ideas', async (req, res) => {
  try {
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Ideas'];
    if (!sheet) {
      return res.status(404).json({ error: 'Sheet named "Ideas" not found.' });
    }
    const rows = await sheet.getRows();
    const ideas = rows.map(row => ({
        id: row.get('ID'),
        title: row.get('Title'),
        description: row.get('Description'),
        submittedBy: row.get('Submitted By'),
        status: row.get('Status'),
    }));
    res.json(ideas);
  } catch (error) {
    console.error('Error fetching ideas:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// POST a new idea
app.post('/api/ideas', async (req, res) => {
  try {
    const { title, description, submittedBy } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and Description are required.' });
    }

    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Ideas'];
    if (!sheet) {
      return res.status(404).json({ error: 'Sheet named "Ideas" not found.' });
    }

    await sheet.addRow({
      ID: `IDEA-${Date.now()}`,
      Title: title,
      Description: description,
      'Submitted By': submittedBy || 'Anonymous',
      Status: 'Pending',
      Timestamp: new Date().toISOString(),
    });

    res.status(201).json({ message: 'Idea submitted successfully!' });
  } catch (error) {
    console.error('Error submitting idea:', error.message);
    res.status(500).json({ error: 'Failed to submit data' });
  }
});

// --- SERVER START ---
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});