import { Router } from 'express';
import { readJsonFile, writeJsonFile } from '../utils/fileUtils.js';

const router = Router();
const SETTINGS_FILE = 'settings.json';

const DEFAULT_SETTINGS = {
    darkMode: false,
    maxChars: 80,
    adminUser: {
        name: 'Alexia Belle-Croix',
        email: 'alexia@junelabs.fr',
        role: 'admin',
        initials: 'AB'
    }
};

router.get('/', async (req, res) => {
    try {
        const settings = await readJsonFile(SETTINGS_FILE);
        res.json(settings || DEFAULT_SETTINGS);
    } catch (error) {
        console.error('Erreur lecture settings:', error);
        res.json(DEFAULT_SETTINGS);
    }
});

router.put('/', async (req, res) => {
    try {
        const current = await readJsonFile(SETTINGS_FILE) || DEFAULT_SETTINGS;
        const updated = { ...current, ...req.body };
        await writeJsonFile(SETTINGS_FILE, updated);
        res.json(updated);
    } catch (error) {
        console.error('Erreur sauvegarde settings:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

export { router as settingsRouter };
