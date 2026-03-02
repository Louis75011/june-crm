import express from 'express';
import cors from 'cors';
import { createCrudRouter } from './routes/crud.js';
import { settingsRouter } from './routes/settings.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// ==================== ROUTES API — June Lab CRM ====================
app.use('/api/clients',       createCrudRouter('clients.json', 'client'));
app.use('/api/programmes',    createCrudRouter('programmes.json', 'programme'));
app.use('/api/campagnes',     createCrudRouter('campagnes.json', 'campagne'));
app.use('/api/landingpages',  createCrudRouter('landingpages.json', 'landing page'));
app.use('/api/leads',         createCrudRouter('leads.json', 'lead'));
app.use('/api/templates',     createCrudRouter('templates.json', 'template'));
app.use('/api/statistiques',  createCrudRouter('statistiques.json', 'statistique'));
app.use('/api/settings',      settingsRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), app: 'June Lab CRM' });
});

// Démarrage
app.listen(PORT, () => {
    console.log(`🚀 June Lab CRM — Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📋 Entités: clients, programmes, campagnes, landingpages, leads, templates, statistiques`);
    console.log(`⚙️  Settings: http://localhost:${PORT}/api/settings`);
});
