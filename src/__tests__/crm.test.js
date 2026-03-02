/**
 * Tests unitaires – June Lab CRM
 * API CRUD, schéma, navigation, recherche
 */

// ==================== 1. API CRUD (mock fetch) ====================
import { clientsAPI, prospectsAPI, programmesAPI, _resetServerDetection } from '../services/api';

const mockData = [
    { id: 1, nom: 'La CAPS', type: 'Coopérative', statut: 'Actif' },
    { id: 2, nom: 'Nexity', type: 'Promoteur', statut: 'Prospect' }
];

/** Mock un health check réussi (premier appel de détection serveur) */
const mockHealthCheck = () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ status: 'ok' }) });
};

beforeEach(() => {
    global.fetch = jest.fn();
    _resetServerDetection(); // Réinitialiser la détection serveur entre chaque test
    mockHealthCheck();       // Premier appel = health check
});

afterEach(() => {
    jest.restoreAllMocks();
});

const mockFetchSuccess = (data) => {
    global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => data
    });
};

const mockFetchError = (status = 500) => {
    global.fetch.mockResolvedValueOnce({
        ok: false,
        status,
        json: async () => ({ error: `Erreur ${status}` })
    });
};

describe('API CRUD — clientsAPI', () => {
    test('getAll() appelle GET /api/clients', async () => {
        mockFetchSuccess(mockData);
        const result = await clientsAPI.getAll();
        expect(global.fetch).toHaveBeenCalledWith('/api/clients', expect.objectContaining({
            headers: { 'Content-Type': 'application/json' }
        }));
        expect(result).toEqual(mockData);
    });

    test('getById(1) appelle GET /api/clients/1', async () => {
        mockFetchSuccess(mockData[0]);
        const result = await clientsAPI.getById(1);
        expect(global.fetch).toHaveBeenCalledWith('/api/clients/1', expect.any(Object));
        expect(result.nom).toBe('La CAPS');
    });

    test('create() appelle POST /api/clients', async () => {
        const newItem = { nom: 'Test Corp', type: 'Autre' };
        mockFetchSuccess({ id: 3, ...newItem });
        const result = await clientsAPI.create(newItem);
        expect(global.fetch).toHaveBeenCalledWith('/api/clients', expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(newItem)
        }));
        expect(result.id).toBe(3);
    });

    test('update(1, data) appelle PUT /api/clients/1', async () => {
        const updated = { nom: 'La CAPS Modifié' };
        mockFetchSuccess({ id: 1, ...updated });
        await clientsAPI.update(1, updated);
        expect(global.fetch).toHaveBeenCalledWith('/api/clients/1', expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify(updated)
        }));
    });

    test('delete(1) appelle DELETE /api/clients/1', async () => {
        mockFetchSuccess({ success: true });
        await clientsAPI.delete(1);
        expect(global.fetch).toHaveBeenCalledWith('/api/clients/1', expect.objectContaining({
            method: 'DELETE'
        }));
    });

    test('import() appelle POST /api/clients/import', async () => {
        const items = [{ nom: 'Import1' }, { nom: 'Import2' }];
        mockFetchSuccess({ imported: 2 });
        await clientsAPI.import(items);
        expect(global.fetch).toHaveBeenCalledWith('/api/clients/import', expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ items })
        }));
    });

    test('getAll() rejette sur erreur serveur', async () => {
        mockFetchError(500);
        await expect(clientsAPI.getAll()).rejects.toThrow('Erreur 500');
    });
});

describe('API CRUD — prospectsAPI (ex-leads)', () => {
    test('getAll() appelle GET /api/prospects (pas /api/leads)', async () => {
        mockFetchSuccess([]);
        await prospectsAPI.getAll();
        expect(global.fetch).toHaveBeenCalledWith('/api/prospects', expect.any(Object));
    });

    test('create() appelle POST /api/prospects', async () => {
        const prospect = { nomComplet: 'Sophie Martin', email: 'sophie@test.com' };
        mockFetchSuccess({ id: 1, ...prospect });
        await prospectsAPI.create(prospect);
        expect(global.fetch).toHaveBeenCalledWith('/api/prospects', expect.objectContaining({
            method: 'POST'
        }));
    });
});

// ==================== 2. Schéma CRM ====================
import {
    CRM_TABS,
    clientColumns, clientFormFields, clientViewFields,
    prospectColumns, prospectFormFields, prospectViewFields,
    programmeColumns
} from '../data/crmSchema';

describe('CRM Schema — structure', () => {
    test('CRM_TABS contient 7 onglets', () => {
        expect(CRM_TABS).toHaveLength(7);
    });

    test('Onglet "prospects" existe (pas "leads")', () => {
        const prospectTab = CRM_TABS.find(t => t.key === 'prospects');
        expect(prospectTab).toBeDefined();
        expect(prospectTab.label).toBe('Prospects');
        expect(prospectTab.entityName).toBe('prospect');

        const leadTab = CRM_TABS.find(t => t.key === 'leads');
        expect(leadTab).toBeUndefined();
    });

    test('Chaque onglet a key, icon, label, entityName', () => {
        CRM_TABS.forEach(tab => {
            expect(tab.key).toBeDefined();
            expect(tab.icon).toBeDefined();
            expect(tab.label).toBeDefined();
            expect(tab.entityName).toBeDefined();
        });
    });

    test('clientColumns contient le champ telephoneContact', () => {
        const telCol = clientColumns.find(c => c.key === 'telephoneContact');
        expect(telCol).toBeDefined();
        expect(telCol.label).toBe('Téléphone');
    });

    test('clientFormFields a un champ tel de type tel', () => {
        const telField = clientFormFields.find(f => f.key === 'telephoneContact');
        expect(telField).toBeDefined();
        expect(telField.type).toBe('tel');
    });

    test('prospectColumns utilise statutProspect (pas statutLead)', () => {
        const statusCol = prospectColumns.find(c => c.key === 'statutProspect');
        expect(statusCol).toBeDefined();
        expect(statusCol.type).toBe('badge');

        const oldCol = prospectColumns.find(c => c.key === 'statutLead');
        expect(oldCol).toBeUndefined();
    });

    test('programmeColumns contient prixAPartirDe de type currency', () => {
        const priceCol = programmeColumns.find(c => c.key === 'prixAPartirDe');
        expect(priceCol).toBeDefined();
        expect(priceCol.type).toBe('currency');
    });
});

// ==================== 3. Navigation — CRM_TABS keys ====================
describe('Navigation — onglets CRM', () => {
    const expectedKeys = ['clients', 'programmes', 'campagnes', 'landingpages', 'prospects', 'templates', 'statistiques'];

    test('Les clés des onglets correspondent aux entités attendues', () => {
        const keys = CRM_TABS.map(t => t.key);
        expect(keys).toEqual(expectedKeys);
    });

    test('Aucune clé dupliquée', () => {
        const keys = CRM_TABS.map(t => t.key);
        const unique = new Set(keys);
        expect(unique.size).toBe(keys.length);
    });
});

// ==================== 4. Recherche (filtrage DataTable) ====================
describe('Recherche — filtrage texte', () => {
    const items = [
        { id: 1, nom: 'La CAPS', type: 'Coopérative', ville: 'Saint-Denis' },
        { id: 2, nom: 'Nexity', type: 'Promoteur', ville: 'Paris' },
        { id: 3, nom: 'Eiffage Immobilier', type: 'Promoteur', ville: 'Lyon' },
    ];

    // Simuler le filtrage tel qu'implémenté dans DataTable
    const filterItems = (data, search) => {
        if (!search) return data;
        return data.filter(item =>
            Object.values(item).some(val =>
                String(val || '').toLowerCase().includes(search.toLowerCase())
            )
        );
    };

    test('Recherche vide retourne tout', () => {
        expect(filterItems(items, '')).toHaveLength(3);
    });

    test('Recherche "CAPS" retourne 1 résultat', () => {
        const result = filterItems(items, 'CAPS');
        expect(result).toHaveLength(1);
        expect(result[0].nom).toBe('La CAPS');
    });

    test('Recherche "Promoteur" retourne 2 résultats', () => {
        expect(filterItems(items, 'Promoteur')).toHaveLength(2);
    });

    test('Recherche insensible à la casse', () => {
        expect(filterItems(items, 'nexity')).toHaveLength(1);
        expect(filterItems(items, 'NEXITY')).toHaveLength(1);
    });

    test('Recherche sans résultat retourne tableau vide', () => {
        expect(filterItems(items, 'zzzzz')).toHaveLength(0);
    });

    test('Recherche sur ville', () => {
        const result = filterItems(items, 'Saint-Denis');
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(1);
    });
});

// ==================== 5. Intégrité des données JSON ====================
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Intégrité données JSON', () => {
    const dataDir = resolve(__dirname, '../../server/data');

    const jsonFiles = [
        'clients.json',
        'programmes.json',
        'campagnes.json',
        'landingpages.json',
        'prospects.json',
        'templates.json',
        'statistiques.json',
    ];

    test.each(jsonFiles)('%s est un JSON valide et un tableau', (filename) => {
        const content = readFileSync(resolve(dataDir, filename), 'utf-8');
        const data = JSON.parse(content);
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0);
    });

    test('prospects.json utilise statutProspect (pas statutLead)', () => {
        const content = readFileSync(resolve(dataDir, 'prospects.json'), 'utf-8');
        const data = JSON.parse(content);
        data.forEach(p => {
            expect(p).toHaveProperty('statutProspect');
            expect(p).not.toHaveProperty('statutLead');
        });
    });

    test('statistiques.json utilise prospectsGeneres (pas leadsGeneres)', () => {
        const content = readFileSync(resolve(dataDir, 'statistiques.json'), 'utf-8');
        const data = JSON.parse(content);
        data.forEach(s => {
            expect(s).toHaveProperty('prospectsGeneres');
            expect(s).not.toHaveProperty('leadsGeneres');
        });
    });

    test('leads.json n\'existe plus', () => {
        const exists = (() => {
            try { readFileSync(resolve(dataDir, 'leads.json')); return true; } catch { return false; }
        })();
        expect(exists).toBe(false);
    });

    test('Chaque entrée a un id unique', () => {
        jsonFiles.forEach(filename => {
            const data = JSON.parse(readFileSync(resolve(dataDir, filename), 'utf-8'));
            const ids = data.map(d => d.id);
            expect(new Set(ids).size).toBe(ids.length);
        });
    });
});
