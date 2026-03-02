/**
 * localStorage fallback — June Lab CRM
 * Utilisé automatiquement quand le serveur Express n'est pas disponible (ex: Vercel)
 * Même interface que l'API REST : getAll, getById, create, update, delete, import
 */

import seedClients from '../../server/data/clients.json';
import seedProgrammes from '../../server/data/programmes.json';
import seedCampagnes from '../../server/data/campagnes.json';
import seedLandingpages from '../../server/data/landingpages.json';
import seedProspects from '../../server/data/prospects.json';
import seedTemplates from '../../server/data/templates.json';
import seedStatistiques from '../../server/data/statistiques.json';

const SEED_DATA = {
    clients: seedClients,
    programmes: seedProgrammes,
    campagnes: seedCampagnes,
    landingpages: seedLandingpages,
    prospects: seedProspects,
    templates: seedTemplates,
    statistiques: seedStatistiques
};

const SETTINGS_KEY = 'juneCRM_settings';
const PREFIX = 'juneCRM_';

function getStoreKey(entity) {
    return `${PREFIX}${entity}`;
}

/** Read array from localStorage, seeding from JSON if first time */
function readStore(entity) {
    const key = getStoreKey(entity);
    const raw = localStorage.getItem(key);
    if (raw !== null) {
        try { return JSON.parse(raw); } catch { /* fall through to seed */ }
    }
    // First access: seed from embedded data
    const seed = SEED_DATA[entity] || [];
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
}

function writeStore(entity, data) {
    localStorage.setItem(getStoreKey(entity), JSON.stringify(data));
}

function nextId(items) {
    if (!items.length) return 1;
    return Math.max(...items.map(i => i.id || 0)) + 1;
}

/**
 * Creates a localStorage CRUD service for one entity.
 * Same interface as createEntityAPI in api.js.
 */
export function createLocalEntityAPI(entity) {
    return {
        getAll: async () => readStore(entity),

        getById: async (id) => {
            const items = readStore(entity);
            const item = items.find(i => i.id === id);
            if (!item) throw new Error(`${entity} #${id} introuvable`);
            return item;
        },

        create: async (data) => {
            const items = readStore(entity);
            const now = new Date().toISOString();
            const newItem = { id: nextId(items), ...data, createdAt: now, updatedAt: now };
            items.push(newItem);
            writeStore(entity, items);
            return newItem;
        },

        update: async (id, data) => {
            const items = readStore(entity);
            const idx = items.findIndex(i => i.id === id);
            if (idx === -1) throw new Error(`${entity} #${id} introuvable`);
            const updated = { ...items[idx], ...data, updatedAt: new Date().toISOString() };
            items[idx] = updated;
            writeStore(entity, items);
            return updated;
        },

        delete: async (id) => {
            let items = readStore(entity);
            items = items.filter(i => i.id !== id);
            writeStore(entity, items);
            return { success: true };
        },

        import: async (newItems) => {
            const items = readStore(entity);
            let currentId = nextId(items);
            const now = new Date().toISOString();
            for (const item of newItems) {
                items.push({ id: currentId++, ...item, createdAt: now, updatedAt: now });
            }
            writeStore(entity, items);
            return { imported: newItems.length };
        }
    };
}

/** localStorage settings API */
export const localSettingsAPI = {
    get: async () => {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (raw) {
            try { return JSON.parse(raw); } catch { /* fall through */ }
        }
        const defaults = { darkMode: false, maxChars: 80, adminUser: { name: 'Alexia Belle-Croix', email: 'alexia@junelabs.fr', role: 'admin', initials: 'AB' } };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaults));
        return defaults;
    },
    update: async (settings) => {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        return settings;
    }
};
