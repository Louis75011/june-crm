import { Router } from 'express';
import { readJsonFile, writeJsonFile, generateId } from '../utils/fileUtils.js';

/**
 * Crée un routeur CRUD générique pour une entité JSON
 * @param {string} filename - Nom du fichier JSON (ex: 'clients.json')
 * @param {string} entityName - Nom de l'entité pour les logs (ex: 'client')
 */
export function createCrudRouter(filename, entityName) {
    const router = Router();

    // GET / — Liste tous les éléments
    router.get('/', async (req, res) => {
        try {
            const items = await readJsonFile(filename) || [];
            res.json(items);
        } catch (error) {
            console.error(`Erreur lecture ${entityName}:`, error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    });

    // GET /:id — Un élément par ID
    router.get('/:id', async (req, res) => {
        try {
            const items = await readJsonFile(filename) || [];
            const item = items.find(i => i.id === parseInt(req.params.id));
            if (!item) {
                return res.status(404).json({ error: `${entityName} non trouvé(e)` });
            }
            res.json(item);
        } catch (error) {
            console.error(`Erreur lecture ${entityName}:`, error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    });

    // POST / — Créer un élément
    router.post('/', async (req, res) => {
        try {
            const items = await readJsonFile(filename) || [];
            const newId = generateId(items);
            const now = new Date().toISOString();
            const newItem = {
                id: newId,
                ...req.body,
                createdAt: now,
                updatedAt: now
            };
            items.push(newItem);
            await writeJsonFile(filename, items);
            res.status(201).json(newItem);
        } catch (error) {
            console.error(`Erreur création ${entityName}:`, error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    });

    // PUT /:id — Modifier un élément
    router.put('/:id', async (req, res) => {
        try {
            const items = await readJsonFile(filename) || [];
            const index = items.findIndex(i => i.id === parseInt(req.params.id));
            if (index === -1) {
                return res.status(404).json({ error: `${entityName} non trouvé(e)` });
            }
            items[index] = {
                ...items[index],
                ...req.body,
                id: items[index].id,
                createdAt: items[index].createdAt,
                updatedAt: new Date().toISOString()
            };
            await writeJsonFile(filename, items);
            res.json(items[index]);
        } catch (error) {
            console.error(`Erreur modification ${entityName}:`, error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    });

    // DELETE /:id — Supprimer un élément
    router.delete('/:id', async (req, res) => {
        try {
            const items = await readJsonFile(filename) || [];
            const index = items.findIndex(i => i.id === parseInt(req.params.id));
            if (index === -1) {
                return res.status(404).json({ error: `${entityName} non trouvé(e)` });
            }
            const deleted = items.splice(index, 1)[0];
            await writeJsonFile(filename, items);
            res.json({ success: true, deleted });
        } catch (error) {
            console.error(`Erreur suppression ${entityName}:`, error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    });

    // POST /import — Import en masse
    router.post('/import', async (req, res) => {
        try {
            const { items: newItems } = req.body;
            if (!Array.isArray(newItems)) {
                return res.status(400).json({ error: 'Format invalide — attendu { items: [...] }' });
            }
            const items = await readJsonFile(filename) || [];
            let maxId = generateId(items) - 1;
            const now = new Date().toISOString();
            const imported = newItems.map(item => ({
                ...item,
                id: ++maxId,
                createdAt: item.createdAt || now,
                updatedAt: now
            }));
            const merged = [...items, ...imported];
            await writeJsonFile(filename, merged);
            res.status(201).json({ imported: imported.length, total: merged.length });
        } catch (error) {
            console.error(`Erreur import ${entityName}:`, error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    });

    return router;
}
