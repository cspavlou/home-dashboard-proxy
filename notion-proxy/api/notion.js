// Vercel Serverless Function — Notion API Proxy
// Αποθήκευσε το NOTION_TOKEN ως Environment Variable στο Vercel dashboard
// (Settings → Environment Variables → NOTION_TOKEN)

const NOTION_API = 'https://api.notion.com';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://cspavlou.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const notionPath = req.query.path;
  if (!notionPath) {
    return res.status(400).json({ error: 'Missing ?path= query parameter' });
  }

  const token = process.env.NOTION_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'NOTION_TOKEN env variable not set on Vercel' });
  }

  try {
    const notionRes = await fetch(`${NOTION_API}/v1/${notionPath}`, {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: ['POST', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined,
    });

    const data = await notionRes.json();
    return res.status(notionRes.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

