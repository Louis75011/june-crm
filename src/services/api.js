/**
 * Service API — June Lab CRM
 * Communique avec le backend Express
 */

const API_BASE = '/api';

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

/**
 * Crée un service CRUD générique pour une entité
 */
function createEntityAPI(basePath) {
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
    get: () => fetchAPI('/settings'),
    update: (settings) => fetchAPI('/settings', {
        method: 'PUT',
        body: JSON.stringify(settings)
    })
};

// ==================== HEALTH CHECK ====================

export const healthAPI = {
    check: () => fetchAPI('/health')
};
