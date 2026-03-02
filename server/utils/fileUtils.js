import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');

// S'assurer que le dossier data existe
const ensureDataDir = async () => {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
};

/**
 * Lire un fichier JSON
 */
export const readJsonFile = async (filename) => {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return null; // Fichier inexistant
        }
        throw error;
    }
};

/**
 * Écrire un fichier JSON
 */
export const writeJsonFile = async (filename, data) => {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

/**
 * Normaliser un nom pour comparaison
 */
export const normalizeName = (name) => (name || '').toLowerCase().trim();

/**
 * Générer un nouvel ID
 */
export const generateId = (items) => {
    if (!items || items.length === 0) return 1;
    return Math.max(...items.map(item => item?.id || 0)) + 1;
};
