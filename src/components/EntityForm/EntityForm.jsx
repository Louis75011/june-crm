import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import styles from './EntityForm.module.scss';

/**
 * Formulaire générique pour créer/éditer une entité
 * @param {Array} fields - Définition des champs [{ key, label, type, options, required, placeholder }]
 * @param {Object} initialData - Données initiales (mode édition)
 * @param {string} title - Titre du modal
 */
const EntityForm = ({ isOpen, onClose, onSubmit, fields, initialData, title, mode = 'add' }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({ ...initialData });
            } else {
                // Init champs vides
                const empty = {};
                fields.forEach(f => {
                    if (f.type === 'checkbox') empty[f.key] = false;
                    else if (f.type === 'number' || f.type === 'currency') empty[f.key] = '';
                    else empty[f.key] = '';
                });
                setFormData(empty);
            }
        }
    }, [isOpen, initialData, fields]);

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    const renderField = (field) => {
        const value = formData[field.key] ?? '';

        if (field.type === 'select') {
            return (
                <select
                    value={value}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    required={field.required}
                    className={styles.input}
                >
                    <option value="">— Sélectionner —</option>
                    {(field.options || []).map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            );
        }

        if (field.type === 'checkbox') {
            return (
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={!!value}
                        onChange={(e) => handleChange(field.key, e.target.checked)}
                    />
                    <span>{field.checkboxText || 'Oui'}</span>
                </label>
            );
        }

        if (field.type === 'textarea') {
            return (
                <textarea
                    value={value}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder || ''}
                    rows={3}
                    className={styles.input}
                />
            );
        }

        const inputType = field.type === 'currency' ? 'number' : (field.type || 'text');

        return (
            <input
                type={inputType}
                value={value}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder || ''}
                required={field.required}
                className={styles.input}
                step={field.type === 'currency' ? '0.01' : undefined}
            />
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={styles.formContainer}>
                <h2 className={styles.title}>
                    {mode === 'edit' ? '✏️' : '➕'} {title}
                </h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {fields.map(field => (
                        <div key={field.key} className={styles.field}>
                            <label className={styles.label}>
                                {field.label}
                                {field.required && <span className={styles.required}>*</span>}
                            </label>
                            {renderField(field)}
                        </div>
                    ))}
                    <div className={styles.actions}>
                        <button type="button" className={styles.btnCancel} onClick={onClose}>
                            Annuler
                        </button>
                        <button type="submit" className={styles.btnSubmit}>
                            {mode === 'edit' ? 'Enregistrer' : 'Ajouter'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default EntityForm;
