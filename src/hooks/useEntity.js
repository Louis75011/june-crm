import { useState, useEffect, useCallback } from 'react';

/**
 * Hook générique CRUD pour une entité June Lab CRM
 * @param {Object} api - Service API (clientsAPI, leadsAPI, etc.)
 * @param {string} entityName - Nom pour les logs
 */
export function useEntity(api, entityName = 'entité') {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Chargement initial
    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await api.getAll();
                setItems(data || []);
            } catch (err) {
                console.error(`Erreur chargement ${entityName}:`, err);
                setError(err.message);
                setItems([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [api, entityName]);

    const addItem = useCallback(async (data) => {
        try {
            setError(null);
            const newItem = await api.create(data);
            setItems(prev => [...prev, newItem]);
            return newItem;
        } catch (err) {
            console.error(`Erreur ajout ${entityName}:`, err);
            setError(err.message);
            throw err;
        }
    }, [api, entityName]);

    const updateItem = useCallback(async (id, data) => {
        try {
            setError(null);
            const updated = await api.update(id, data);
            setItems(prev => prev.map(item => item.id === id ? updated : item));
            return updated;
        } catch (err) {
            console.error(`Erreur modification ${entityName}:`, err);
            setError(err.message);
            throw err;
        }
    }, [api, entityName]);

    const deleteItem = useCallback(async (id) => {
        try {
            setError(null);
            await api.delete(id);
            setItems(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error(`Erreur suppression ${entityName}:`, err);
            setError(err.message);
            throw err;
        }
    }, [api, entityName]);

    const importItems = useCallback(async (newItems) => {
        try {
            setError(null);
            await api.import(newItems);
            // Recharger tout après import
            const data = await api.getAll();
            setItems(data || []);
        } catch (err) {
            console.error(`Erreur import ${entityName}:`, err);
            setError(err.message);
            throw err;
        }
    }, [api, entityName]);

    const reload = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.getAll();
            setItems(data || []);
        } catch (err) {
            console.error(`Erreur rechargement ${entityName}:`, err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [api, entityName]);

    return {
        items,
        loading,
        error,
        addItem,
        updateItem,
        deleteItem,
        importItems,
        reload
    };
}
