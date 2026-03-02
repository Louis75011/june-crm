import express from 'express';
import cors from 'cors';
import { prospectsRouter } from './routes/prospects.js';
import { partenariatsRouter } from './routes/partenariats.js';
import { settingsRouter } from './routes/settings.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Routes API
app.use('/api/prospects', prospectsRouter);
app.use('/api/partenariats', partenariatsRouter);
app.use('/api/settings', settingsRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Démarrage
app.listen(PORT, () => {
    console.log(`🚀 Serveur CRM démarré sur http://localhost:${PORT}`);
    console.log(`📊 API Prospects: http://localhost:${PORT}/api/prospects`);
    console.log(`🤝 API Partenariats: http://localhost:${PORT}/api/partenariats`);
});
