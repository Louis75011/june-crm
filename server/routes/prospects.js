import { Router } from 'express';
import { readJsonFile, writeJsonFile, normalizeName, generateId } from '../utils/fileUtils.js';

const router = Router();
const PROSPECTS_FILE = 'prospects.json';
const DELETED_FILE = 'prospects_deleted.json';

const applyPriority = (prospect) => {
    const statut = prospect?.statut || '';
    let priorite = prospect?.priorite;
    if (statut === 'À contacter' && !priorite) {
        priorite = 'Très haute';
    } else if (!priorite) {
        priorite = 'Faible';
    }
    return { ...prospect, priorite };
};

/**
 * GET /api/prospects - Récupérer tous les prospects
 */
router.get('/', async (req, res) => {
    try {
        const prospects = await readJsonFile(PROSPECTS_FILE) || [];
        const normalized = prospects.map(applyPriority);
        const changed = normalized.some((p, idx) => p.priorite !== prospects[idx]?.priorite);
        if (changed) {
            await writeJsonFile(PROSPECTS_FILE, normalized);
        }
        res.json(normalized);
    } catch (error) {
        console.error('Erreur lecture prospects:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * GET /api/prospects/:id - Récupérer un prospect par ID
 */
router.get('/:id', async (req, res) => {
    try {
        const prospects = await readJsonFile(PROSPECTS_FILE) || [];
        const prospect = prospects.find(p => p.id === parseInt(req.params.id));
        if (!prospect) {
            return res.status(404).json({ error: 'Prospect non trouvé' });
        }
        res.json(applyPriority(prospect));
    } catch (error) {
        console.error('Erreur lecture prospect:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * POST /api/prospects - Créer un nouveau prospect
 */
router.post('/', async (req, res) => {
    try {
        const prospects = await readJsonFile(PROSPECTS_FILE) || [];
        const newId = generateId(prospects);

        const newProspect = applyPriority({
            id: newId,
            ...req.body,
            repondu: req.body.repondu || 'NON'
        });

        prospects.push(newProspect);
        await writeJsonFile(PROSPECTS_FILE, prospects);

        // Retirer des suppressions si réajouté
        const name = normalizeName(newProspect.nomEntreprise);
        if (name) {
            const deleted = await readJsonFile(DELETED_FILE) || [];
            const newDeleted = deleted.filter(n => n !== name);
            await writeJsonFile(DELETED_FILE, newDeleted);
        }

        res.status(201).json(newProspect);
    } catch (error) {
        console.error('Erreur création prospect:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * PUT /api/prospects/:id - Modifier un prospect
 */
router.put('/:id', async (req, res) => {
    try {
        const prospects = await readJsonFile(PROSPECTS_FILE) || [];
        const index = prospects.findIndex(p => p.id === parseInt(req.params.id));

        if (index === -1) {
            return res.status(404).json({ error: 'Prospect non trouvé' });
        }

        const merged = { ...prospects[index], ...req.body };
        prospects[index] = applyPriority(merged);
        await writeJsonFile(PROSPECTS_FILE, prospects);

        res.json(prospects[index]);
    } catch (error) {
        console.error('Erreur modification prospect:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * DELETE /api/prospects/:id - Supprimer un prospect
 */
router.delete('/:id', async (req, res) => {
    try {
        const prospects = await readJsonFile(PROSPECTS_FILE) || [];
        const index = prospects.findIndex(p => p.id === parseInt(req.params.id));

        if (index === -1) {
            return res.status(404).json({ error: 'Prospect non trouvé' });
        }

        const deleted = prospects[index];
        const name = normalizeName(deleted.nomEntreprise);

        // Ajouter aux suppressions
        if (name) {
            const deletedNames = await readJsonFile(DELETED_FILE) || [];
            if (!deletedNames.includes(name)) {
                deletedNames.push(name);
                await writeJsonFile(DELETED_FILE, deletedNames);
            }
        }

        prospects.splice(index, 1);
        await writeJsonFile(PROSPECTS_FILE, prospects);

        res.json({ success: true, deleted });
    } catch (error) {
        console.error('Erreur suppression prospect:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * POST /api/prospects/import - Importer plusieurs prospects
 */
router.post('/import', async (req, res) => {
    try {
        const { prospects: newProspects } = req.body;
        if (!Array.isArray(newProspects)) {
            return res.status(400).json({ error: 'Format invalide' });
        }

        const prospects = await readJsonFile(PROSPECTS_FILE) || [];
        let maxId = generateId(prospects) - 1;

        const imported = newProspects.map(p => ({
            ...p,
            id: ++maxId
        }));

        const updated = [...prospects, ...imported];
        await writeJsonFile(PROSPECTS_FILE, updated);

        res.status(201).json({ imported: imported.length, prospects: imported });
    } catch (error) {
        console.error('Erreur import prospects:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * POST /api/prospects/init - Initialiser avec données par défaut (merge)
 */
router.post('/init', async (req, res) => {
    try {
        const { initialData } = req.body;
        if (!Array.isArray(initialData)) {
            return res.status(400).json({ error: 'Format invalide' });
        }

        const existing = await readJsonFile(PROSPECTS_FILE) || [];
        const deletedNames = new Set(await readJsonFile(DELETED_FILE) || []);

        const existingNames = new Set(
            existing.map(p => normalizeName(p?.nomEntreprise)).filter(Boolean)
        );
        const existingIds = new Set(
            existing.map(p => p?.id).filter(Boolean)
        );

        let maxId = generateId(existing) - 1;

        const newItems = initialData
            .filter(ip => {
                const name = normalizeName(ip?.nomEntreprise);
                const incomingId = ip?.id;
                if (!name || deletedNames.has(name)) return false;
                if (existingNames.has(name)) return false;
                if (incomingId && existingIds.has(incomingId)) return false;
                return true;
            })
            .map(ip => {
                let nextId = ip?.id;
                if (!nextId || existingIds.has(nextId)) {
                    nextId = ++maxId;
                }
                existingIds.add(nextId);
                return applyPriority({ ...ip, id: nextId });
            });

        const merged = [...existing, ...newItems];
        await writeJsonFile(PROSPECTS_FILE, merged);

        res.json({ total: merged.length, added: newItems.length });
    } catch (error) {
        console.error('Erreur init prospects:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

export { router as prospectsRouter };
