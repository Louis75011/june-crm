import { Router } from 'express';
import { readJsonFile, writeJsonFile, normalizeName, generateId } from '../utils/fileUtils.js';

const router = Router();
const PARTENARIATS_FILE = 'partenariats.json';
const DELETED_FILE = 'partenariats_deleted.json';

/**
 * GET /api/partenariats - Récupérer tous les partenariats
 */
router.get('/', async (req, res) => {
    try {
        const partenariats = await readJsonFile(PARTENARIATS_FILE);
        res.json(partenariats || []);
    } catch (error) {
        console.error('Erreur lecture partenariats:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * GET /api/partenariats/:id - Récupérer un partenariat par ID
 */
router.get('/:id', async (req, res) => {
    try {
        const partenariats = await readJsonFile(PARTENARIATS_FILE) || [];
        const partenariat = partenariats.find(p => p.id === parseInt(req.params.id));
        if (!partenariat) {
            return res.status(404).json({ error: 'Partenariat non trouvé' });
        }
        res.json(partenariat);
    } catch (error) {
        console.error('Erreur lecture partenariat:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * POST /api/partenariats - Créer un nouveau partenariat
 */
router.post('/', async (req, res) => {
    try {
        const partenariats = await readJsonFile(PARTENARIATS_FILE) || [];
        const newId = generateId(partenariats);

        const newPartenariat = {
            id: newId,
            ...req.body
        };

        partenariats.push(newPartenariat);
        await writeJsonFile(PARTENARIATS_FILE, partenariats);

        // Retirer des suppressions si réajouté
        const name = normalizeName(newPartenariat.nom);
        if (name) {
            const deleted = await readJsonFile(DELETED_FILE) || [];
            const newDeleted = deleted.filter(n => n !== name);
            await writeJsonFile(DELETED_FILE, newDeleted);
        }

        res.status(201).json(newPartenariat);
    } catch (error) {
        console.error('Erreur création partenariat:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * PUT /api/partenariats/:id - Modifier un partenariat
 */
router.put('/:id', async (req, res) => {
    try {
        const partenariats = await readJsonFile(PARTENARIATS_FILE) || [];
        const index = partenariats.findIndex(p => p.id === parseInt(req.params.id));

        if (index === -1) {
            return res.status(404).json({ error: 'Partenariat non trouvé' });
        }

        partenariats[index] = { ...partenariats[index], ...req.body };
        await writeJsonFile(PARTENARIATS_FILE, partenariats);

        res.json(partenariats[index]);
    } catch (error) {
        console.error('Erreur modification partenariat:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * DELETE /api/partenariats/:id - Supprimer un partenariat
 */
router.delete('/:id', async (req, res) => {
    try {
        const partenariats = await readJsonFile(PARTENARIATS_FILE) || [];
        const index = partenariats.findIndex(p => p.id === parseInt(req.params.id));

        if (index === -1) {
            return res.status(404).json({ error: 'Partenariat non trouvé' });
        }

        const deleted = partenariats[index];
        const name = normalizeName(deleted.nom);

        // Ajouter aux suppressions
        if (name) {
            const deletedNames = await readJsonFile(DELETED_FILE) || [];
            if (!deletedNames.includes(name)) {
                deletedNames.push(name);
                await writeJsonFile(DELETED_FILE, deletedNames);
            }
        }

        partenariats.splice(index, 1);
        await writeJsonFile(PARTENARIATS_FILE, partenariats);

        res.json({ success: true, deleted });
    } catch (error) {
        console.error('Erreur suppression partenariat:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * POST /api/partenariats/init - Initialiser avec données par défaut (merge)
 */
router.post('/init', async (req, res) => {
    try {
        const { initialData } = req.body;
        if (!Array.isArray(initialData)) {
            return res.status(400).json({ error: 'Format invalide' });
        }

        const existing = await readJsonFile(PARTENARIATS_FILE) || [];
        const deletedNames = new Set(await readJsonFile(DELETED_FILE) || []);

        const existingNames = new Set(
            existing.map(p => normalizeName(p?.nom)).filter(Boolean)
        );
        const existingIds = new Set(
            existing.map(p => p?.id).filter(Boolean)
        );

        let maxId = generateId(existing) - 1;

        const newItems = initialData
            .filter(ip => {
                const name = normalizeName(ip?.nom);
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
                return { ...ip, id: nextId };
            });

        const merged = [...existing, ...newItems];
        await writeJsonFile(PARTENARIATS_FILE, merged);

        res.json({ total: merged.length, added: newItems.length });
    } catch (error) {
        console.error('Erreur init partenariats:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

export { router as partenariatsRouter };
