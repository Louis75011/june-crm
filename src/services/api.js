/**
 * Service API pour communiquer avec le backend Express
 */

const API_BASE = '/api';

/**
 * Wrapper fetch avec gestion d'erreurs
 */
async function fetchAPI(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Erreur réseau' }));
        throw new Error(error.error || `Erreur ${response.status}`);
    }

    return response.json();
}

// ==================== PROSPECTS ====================

export const prospectsAPI = {
    /**
     * Récupérer tous les prospects
     */
    async getAll() {
        return fetchAPI('/prospects');
    },

    /**
     * Récupérer un prospect par ID
     */
    async getById(id) {
        return fetchAPI(`/prospects/${id}`);
    },

    /**
     * Créer un nouveau prospect
     */
    async create(prospect) {
        return fetchAPI('/prospects', {
            method: 'POST',
            body: JSON.stringify(prospect)
        });
    },

    /**
     * Mettre à jour un prospect
     */
    async update(id, prospect) {
        return fetchAPI(`/prospects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(prospect)
        });
    },

    /**
     * Supprimer un prospect
     */
    async delete(id) {
        return fetchAPI(`/prospects/${id}`, {
            method: 'DELETE'
        });
    },

    /**
     * Initialiser avec les données par défaut (merge intelligent)
     */
    async init(initialData) {
        return fetchAPI('/prospects/init', {
            method: 'POST',
            body: JSON.stringify({ initialData })
        });
    }
};

// ==================== PARTENARIATS ====================

export const partenariatsAPI = {
    /**
     * Récupérer tous les partenariats
     */
    async getAll() {
        return fetchAPI('/partenariats');
    },

    /**
     * Récupérer un partenariat par ID
     */
    async getById(id) {
        return fetchAPI(`/partenariats/${id}`);
    },

    /**
     * Créer un nouveau partenariat
     */
    async create(partenariat) {
        return fetchAPI('/partenariats', {
            method: 'POST',
            body: JSON.stringify(partenariat)
        });
    },

    /**
     * Mettre à jour un partenariat
     */
    async update(id, partenariat) {
        return fetchAPI(`/partenariats/${id}`, {
            method: 'PUT',
            body: JSON.stringify(partenariat)
        });
    },

    /**
     * Supprimer un partenariat
     */
    async delete(id) {
        return fetchAPI(`/partenariats/${id}`, {
            method: 'DELETE'
        });
    },

    /**
     * Initialiser avec les données par défaut (merge intelligent)
     */
    async init(initialData) {
        return fetchAPI('/partenariats/init', {
            method: 'POST',
            body: JSON.stringify({ initialData })
        });
    }
};

// ==================== SETTINGS ====================

export const settingsAPI = {
    /**
     * Récupérer les paramètres
     */
    async get() {
        return fetchAPI('/settings');
    },

    /**
     * Mettre à jour les paramètres
     */
    async update(settings) {
        return fetchAPI('/settings', {
            method: 'PUT',
            body: JSON.stringify(settings)
        });
    }
};

// ==================== HEALTH CHECK ====================

export const healthAPI = {
    /**
     * Vérifier que le serveur est en ligne
     */
    async check() {
        return fetchAPI('/health');
    }
};
