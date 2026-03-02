import { useState, useEffect, useCallback } from 'react';
import { settingsAPI } from '../services/api';

const defaultSettings = {
    maxChars: 25,
    darkMode: false
};

export const useSettings = () => {
    const [settings, setSettings] = useState(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Charger depuis l'API au montage
    useEffect(() => {
        const loadSettings = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await settingsAPI.get();
                setSettings({ ...defaultSettings, ...data });
            } catch (err) {
                console.error('Erreur chargement settings:', err);
                setError(err.message);
                // Fallback sur les paramètres par défaut
            } finally {
                setLoading(false);
            }
        };

        loadSettings();
    }, []);

    // Sauvegarder les paramètres
    const saveSettings = useCallback(async (newSettings) => {
        try {
            setError(null);
            const updated = await settingsAPI.update(newSettings);
            setSettings(updated);
            return updated;
        } catch (err) {
            console.error('Erreur sauvegarde settings:', err);
            setError(err.message);
            // Sauvegarder localement quand même
            setSettings(newSettings);
            throw err;
        }
    }, []);

    return {
        settings,
        loading,
        error,
        saveSettings
    };
};
