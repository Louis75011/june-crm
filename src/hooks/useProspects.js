import { useState, useEffect, useCallback } from 'react';
import { initialProspects } from '../data/initialData';
import { prospectsAPI } from '../services/api';

export const useProspects = () => {
    const [prospects, setProspects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Charger depuis l'API au montage
    useEffect(() => {
        const loadProspects = async () => {
            try {
                setLoading(true);
                setError(null);

                // Charger les prospects existants depuis le serveur
                const data = await prospectsAPI.getAll();

                if (!data || data.length === 0) {
                    // Serveur vide : initialiser avec les données statiques (premier lancement)
                    await prospectsAPI.init(initialProspects);
                    const freshData = await prospectsAPI.getAll();
                    setProspects(freshData || []);
                } else {
                    // Serveur a déjà des données → les utiliser directement, sans init
                    // (init causait une erreur 413 sur gros payload + risquait de ré-injecter
                    //  des prospects supprimés depuis l'interface)
                    setProspects(data);
                }
            } catch (err) {
                console.error('Erreur chargement prospects:', err);
                setError(err.message);
                // Fallback sur les données statiques si le serveur est inaccessible
                setProspects(initialProspects);
            } finally {
                setLoading(false);
            }
        };

        loadProspects();
    }, []);

    // Ajouter un prospect
    const addProspect = useCallback(async (prospectData) => {
        try {
            setError(null);
            const newProspect = await prospectsAPI.create({
                ...prospectData,
                repondu: prospectData.repondu || 'NON'
            });
            setProspects(prev => [...prev, newProspect]);
            return newProspect;
        } catch (err) {
            console.error('Erreur ajout prospect:', err);
            setError(err.message);
            throw err;
        }
    }, []);

    // Mettre à jour un prospect
    const updateProspect = useCallback(async (id, updatedData) => {
        try {
            setError(null);
            const updated = await prospectsAPI.update(id, updatedData);
            setProspects(prev => prev.map(p => (p.id === id ? updated : p)));
            return updated;
        } catch (err) {
            console.error('Erreur modification prospect:', err);
            setError(err.message);
            throw err;
        }
    }, []);

    // Supprimer un prospect
    const deleteProspect = useCallback(async (id) => {
        try {
            setError(null);
            await prospectsAPI.delete(id);
            setProspects(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error('Erreur suppression prospect:', err);
            setError(err.message);
            throw err;
        }
    }, []);

    // Importer des prospects depuis CSV
    const importProspects = useCallback(async (newProspects) => {
        try {
            setError(null);
            const imported = [];
            for (const prospect of newProspects) {
                const created = await prospectsAPI.create(prospect);
                imported.push(created);
            }
            setProspects(prev => [...prev, ...imported]);
            return imported;
        } catch (err) {
            console.error('Erreur import prospects:', err);
            setError(err.message);
            throw err;
        }
    }, []);

    // Calculer les statistiques
    const getStats = useCallback(() => {
        const total = prospects.length;
        const aContacter = prospects.filter(p => p.statut === 'À contacter').length;
        const enCours = prospects.filter(p => p.statut === 'En cours').length;
        const courantAnnee = prospects.filter(p => p.statut === "Courant de l'année").length;
        const convertis = prospects.filter(p => p.statut === 'Converti').length;
        const relanceItems = prospects.filter(p => p.statut?.includes('Relancé'));
        const relance = relanceItems.length;
        const relanceDetail = {
            j1: relanceItems.filter(p => p.statut === 'Relancé J+1').length,
            j3: relanceItems.filter(p => p.statut === 'Relancé J+3').length,
            j5: relanceItems.filter(p => p.statut === 'Relancé J+5').length,
            j7: relanceItems.filter(p => p.statut === 'Relancé J+7').length
        };
        relanceDetail.autres = relance - (relanceDetail.j1 + relanceDetail.j3 + relanceDetail.j5 + relanceDetail.j7);
        const refuses = prospects.filter(p => p.statut === 'Refusé').length;
        const sansReponse = prospects.filter(p => p.statut === 'Sans réponse').length;
        const taux = total > 0 ? Math.round((convertis / total) * 100) : 0;

        // Nouvelles statistiques : offres offertes & suivi commercial
        const auditsListe = prospects.filter(p => p.auditRealise);
        const audits = auditsListe.length;
        const maquettesListe = prospects.filter(p => p.maquetteRealisee);
        const maquettes = maquettesListe.length;
        const devisListe = prospects.filter(p => p.devisEnvoye);
        const devisEnvoyes = devisListe.length;
        const appelsListe = prospects.filter(p => p.appelRdv);
        const appelsRdv = appelsListe.length;
        const sitesRealisesListe = prospects.filter(p => p.siteRealise);
        const sitesRealises = sitesRealisesListe.length;

        // Stats cartes de visite
        const cartesVisiteListe = prospects.filter(p => p.cartesVisite);
        const cartesVisite = cartesVisiteListe.length;
        const cartesVisiteEndroits = {
            carrefour: prospects.filter(p => p.cartesVisiteEndroits?.includes('🛒 Carrefour L\'Étang-la-Ville')).length,
            mairie: prospects.filter(p => p.cartesVisiteEndroits?.includes('🏛️ Mairie de L\'Étang-la-Ville')).length,
            bistrot: prospects.filter(p => p.cartesVisiteEndroits?.includes('☕ Bistrot Tabac Presse')).length,
            le25: prospects.filter(p => p.cartesVisiteEndroits?.includes('🍽️ Restaurant Le 25')).length
        };

        return {
            total,
            aContacter,
            enCours,
            courantAnnee,
            convertis,
            relance,
            refuses,
            sansReponse,
            taux,
            relanceDetail,
            // Nouvelles stats
            audits,
            auditsListe,
            maquettes,
            maquettesListe,
            devisEnvoyes,
            devisListe,
            appelsRdv,
            appelsListe,
            sitesRealises,
            sitesRealisesListe,
            cartesVisite,
            cartesVisiteListe,
            cartesVisiteEndroits
        };
    }, [prospects]);

    // Actualiser les prospects : recharge depuis l'API
    const resetProspects = useCallback(async () => {
        try {
            setError(null);
            await prospectsAPI.init(initialProspects);
            const data = await prospectsAPI.getAll();
            setProspects(data || []);
        } catch (err) {
            console.error('Erreur actualisation prospects:', err);
            setError(err.message);
            throw err;
        }
    }, []);

    // Recharger depuis l'API (synchronisation manuelle)
    const reloadProspects = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await prospectsAPI.getAll();
            setProspects(data || []);
        } catch (err) {
            console.error('Erreur rechargement prospects:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        prospects,
        loading,
        error,
        addProspect,
        updateProspect,
        deleteProspect,
        importProspects,
        getStats,
        resetProspects,
        reloadProspects
    };
};
