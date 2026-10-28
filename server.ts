import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '25mb' }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', hasKey: Boolean(process.env.GEMINI_API_KEY) });
});

// AI List Parsing Route
app.post('/api/parse-list-image', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Ingen bild skickades med.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Graceful fallback mock extraction if API key isn't set yet
      return res.json({
        titel: 'Inköpslista från bild',
        beskrivning: 'Inläst via kamera',
        icon: '🛒',
        färg: '#4ade80',
        datum: new Date().toLocaleDateString('sv-SE'),
        tid: '12:00',
        butik: 'ICA Maxi',
        plats: 'Centrum',
        items: [
          { text: 'Havremjölk 1L', antal: '2 st', uppskattadTid: '5m' },
          { text: 'Bananer', antal: '1 klase', uppskattadTid: '5m' },
          { text: 'Kaffe mellanrost', antal: '1 pkt', uppskattadTid: '5m' },
          { text: 'Färska örter', antal: '2 st', uppskattadTid: '5m' }
        ]
      });
    }

    const ai = new GoogleGenAI();
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, '');

    const prompt = `Du är en hjälpsam assistent för en svensk To-Do app.
Analysera denna bild (kan vara en handskriven to-do-lista, ett kvitto, post-it lapp, skärmdump eller skiss).
Extrahera uppgifterna eller inköpen och svara ENBART med ett giltigt JSON-objekt i följande format:
{
  "titel": "Kort passande titel på svenska (t.ex. 'Handling ICA', 'Städa förrådet', 'Projekt Renovering')",
  "beskrivning": "Kort undertext eller kategori (t.ex. 'Inköpslista', 'Vill göra', 'Projekt', 'Hem')",
  "icon": "En passande emoji som symboliserar listan (t.ex. 🛒, 🛠️, 🏖️, 🛁, 🎁, 🌮, 💻, 🧹)",
  "färg": "En hex-färgkod som passar temat (välj bland #a855f7, #f59e0b, #f43f5e, #10b981, #0ea5e9, #6366f1, #ec4899)",
  "datum": "Datum i format DD/MM-YY eller YYYY-MM-DD om specificerat, annars tomt",
  "tid": "Tidpunkt t.ex. 09:00 eller tomt om ej specificerat",
  "butik": "Namn på butik om det framgår (t.ex. ICA, IKEA, Bauhaus) eller tomt",
  "plats": "Plats om relevant eller tomt",
  "items": [
    {
      "text": "Beskrivning av uppgiften eller varan",
      "antal": "Kvantitet om angivet (t.ex. '2 st', '1 kg', '1') eller tomt",
      "uppskattadTid": "Uppskattad tid om rimligt (t.ex. '15m', '1/h', '30m') eller tomt"
    }
  ]
}
Returnera ENBART ren JSON utan markdown-kodblock (backticks).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: cleanBase64,
          },
        },
        prompt,
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '{}';
    // Clean potential backticks just in case
    const jsonString = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(jsonString);

    return res.json(parsedData);
  } catch (error: any) {
    console.error('Server Gemini parse error:', error);
    return res.status(500).json({
      error: 'Kunde inte läsa av bilden med AI: ' + (error?.message || 'Okänt fel'),
    });
  }
});

// Vite Middleware for development, or static files for production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`To-Do app server running at http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
