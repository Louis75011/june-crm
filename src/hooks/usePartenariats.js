import { useState, useEffect, useCallback } from 'react';
import { initialPartenariats } from '../data/initialPartenariats';
import { partenariatsAPI } from '../services/api';

export const usePartenariats = () => {
    const [partenariats, setPartenariats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Charger depuis l'API au montage
    useEffect(() => {
        const loadPartenariats = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await partenariatsAPI.getAll();

                if (!data || data.length === 0) {
                    // Serveur vide : initialiser avec les données statiques
                    await partenariatsAPI.init(initialPartenariats);
                    const freshData = await partenariatsAPI.getAll();
                    setPartenariats(freshData || []);
                } else {
                    // Serveur a déjà des données → les utiliser directement
                    setPartenariats(data);
                }
            } catch (err) {
                console.error('Erreur chargement partenariats:', err);
                setError(err.message);
                setPartenariats(initialPartenariats);
            } finally {
                setLoading(false);
            }
        };

        loadPartenariats();
    }, []);

    // Ajouter un partenariat
    const addPartenariat = useCallback(async (partenariatData) => {
        try {
            setError(null);
            const newPartenariat = await partenariatsAPI.create(partenariatData);
            setPartenariats(prev => [...prev, newPartenariat]);
            return newPartenariat;
        } catch (err) {
            console.error('Erreur ajout partenariat:', err);
            setError(err.message);
            throw err;
        }
    }, []);

    // Mettre à jour un partenariat
    const updatePartenariat = useCallback(async (id, updatedData) => {
        try {
            setError(null);
            const updated = await partenariatsAPI.update(id, updatedData);
            setPartenariats(prev => prev.map(p => (p.id === id ? updated : p)));
            return updated;
        } catch (err) {
            console.error('Erreur modification partenariat:', err);
            setError(err.message);
            throw err;
        }
    }, []);

    // Supprimer un partenariat
    const deletePartenariat = useCallback(async (id) => {
        try {
            setError(null);
            await partenariatsAPI.delete(id);
            setPartenariats(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error('Erreur suppression partenariat:', err);
            setError(err.message);
            throw err;
        }
    }, []);

    // Recharger depuis l'API (synchronisation manuelle)
    const reloadPartenariats = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await partenariatsAPI.getAll();
            setPartenariats(data || []);
        } catch (err) {
            console.error('Erreur rechargement partenariats:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        partenariats,
        loading,
        error,
        addPartenariat,
        updatePartenariat,
        deletePartenariat,
        reloadPartenariats
    };
};
