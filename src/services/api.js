/**
 * Service API — June Lab CRM
 * Tente le backend Express (dev local).
 * Si indisponible, bascule automatiquement sur localStorage (Vercel / statique).
 */

import { createLocalEntityAPI, localSettingsAPI } from './localStore.js';

const API_BASE = '/api';

// ====== Détection du mode (serveur vs localStorage) ======
let _useLocal = null; // null = pas encore testé, true/false ensuite

/** Reset pour les tests unitaires */
export function _resetServerDetection() { _useLocal = null; }

async function isServerAvailable() {
    if (_useLocal !== null) return !_useLocal;
    try {
        const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
        _useLocal = !res.ok;
    } catch {
        _useLocal = true;
    }
    if (_useLocal) console.info('[June CRM] Serveur Express indisponible → mode localStorage');
    return !_useLocal;
}

// ====== Fetch wrapper (mode serveur) ======
async function fetchAPI(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const defaultOptions = {
        headers: { 'Content-Type': 'application/json' }
    };
    const response = await fetch(url, { ...defaultOptions, ...options });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Erreur réseau' }));
        throw new Error(error.error || `Erreur ${response.status}`);
    }
    return response.json();
}

// ====== API Express (mode serveur) ======
function createServerEntityAPI(basePath) {
    return {
        getAll: () => fetchAPI(basePath),
        getById: (id) => fetchAPI(`${basePath}/${id}`),
        create: (data) => fetchAPI(basePath, {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        update: (id, data) => fetchAPI(`${basePath}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        delete: (id) => fetchAPI(`${basePath}/${id}`, {
            method: 'DELETE'
        }),
        import: (items) => fetchAPI(`${basePath}/import`, {
            method: 'POST',
            body: JSON.stringify({ items })
        })
    };
}

const serverSettingsAPI = {
    get: () => fetchAPI('/settings'),
    update: (settings) => fetchAPI('/settings', {
        method: 'PUT',
        body: JSON.stringify(settings)
    })
};

// ====== Hybrid : choisit serveur ou localStorage ======
function createHybridMethod(serverFn, localFn) {
    return async (...args) => {
        const serverOk = await isServerAvailable();
        return serverOk ? serverFn(...args) : localFn(...args);
    };
}

function createEntityAPI(basePath) {
    const entityName = basePath.replace(/^\//, '');
    const server = createServerEntityAPI(basePath);
    const local = createLocalEntityAPI(entityName);

    return {
        getAll:  createHybridMethod(server.getAll,  local.getAll),
        getById: createHybridMethod(server.getById, local.getById),
        create:  createHybridMethod(server.create,  local.create),
        update:  createHybridMethod(server.update,  local.update),
        delete:  createHybridMethod(server.delete,  local.delete),
        import:  createHybridMethod(server.import,  local.import)
    };
}

// ==================== ENTITÉS June Lab CRM ====================

export const clientsAPI = createEntityAPI('/clients');
export const programmesAPI = createEntityAPI('/programmes');
export const campagnesAPI = createEntityAPI('/campagnes');
export const landingpagesAPI = createEntityAPI('/landingpages');
export const prospectsAPI = createEntityAPI('/prospects');
export const templatesAPI = createEntityAPI('/templates');
export const statistiquesAPI = createEntityAPI('/statistiques');

// ==================== SETTINGS ====================

export const settingsAPI = {
    get:    createHybridMethod(serverSettingsAPI.get,    localSettingsAPI.get),
    update: createHybridMethod(serverSettingsAPI.update, localSettingsAPI.update)
};

// ==================== HEALTH CHECK ====================

export const healthAPI = {
    check: () => fetchAPI('/health')
};
