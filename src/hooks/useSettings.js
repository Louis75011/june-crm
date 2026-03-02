import { useState, useEffect, useCallback } from 'react';
import { settingsAPI } from '../services/api';

const defaultSettings = {
    maxChars: 80,
    darkMode: false,
    adminUser: {
        name: 'Alexia Belle-Croix',
        email: 'alexia@junelabs.fr',
        role: 'admin',
        initials: 'AB'
    }
};

export const useSettings = () => {
    const [settings, setSettings] = useState(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, []);

    const saveSettings = useCallback(async (newSettings) => {
        try {
            setError(null);
            const updated = await settingsAPI.update(newSettings);
            setSettings(updated);
            return updated;
        } catch (err) {
            console.error('Erreur sauvegarde settings:', err);
            setError(err.message);
            setSettings(newSettings);
            throw err;
        }
    }, []);

    return { settings, loading, error, saveSettings };
};
