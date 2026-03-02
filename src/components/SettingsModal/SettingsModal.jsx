import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import styles from './SettingsModal.module.scss';

const SettingsModal = ({ isOpen, onClose, settings, onSave }) => {
    const [localSettings, setLocalSettings] = useState(settings);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings, isOpen]);

    const handleChange = (key, value) => {
        setLocalSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        onSave(localSettings);
        onClose();
    };

    const handleToggleDarkMode = () => {
        handleChange('darkMode', !localSettings.darkMode);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="⚙️ Paramètres">
            <div className={styles.settingsContent}>
                <div className={styles.settingGroup}>
                    <h4>📋 Affichage des tableaux</h4>
                    <div className={styles.settingRow}>
                        <label htmlFor="maxChars">Nombre max. de caractères affichés</label>
                        <div className={styles.inputRow}>
                            <input
                                type="range"
                                id="maxChars"
                                min="10"
                                max="100"
                                step="5"
                                value={localSettings.maxChars}
                                onChange={(e) => handleChange('maxChars', parseInt(e.target.value))}
                            />
                            <span className={styles.rangeValue}>{localSettings.maxChars}</span>
                        </div>
                        <p className={styles.hint}>Limite la longueur du texte dans les colonnes des tableaux</p>
                    </div>
                </div>

                <div className={styles.settingGroup}>
                    <h4>🎨 Apparence</h4>
                    <div className={styles.settingRow}>
                        <label>Mode sombre</label>
                        <button
                            className={`${styles.toggleBtn} ${localSettings.darkMode ? styles.active : ''}`}
                            onClick={handleToggleDarkMode}
                        >
                            <span className={styles.toggleIcon}>
                                {localSettings.darkMode ? '🌙' : '☀️'}
                            </span>
                            <span className={styles.toggleText}>
                                {localSettings.darkMode ? 'Activé' : 'Désactivé'}
                            </span>
                        </button>
                    </div>
                </div>

                <div className={styles.modalButtons}>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        Annuler
                    </button>
                    <button type="button" className="btn btn-success" onClick={handleSave}>
                        Enregistrer
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default SettingsModal;
