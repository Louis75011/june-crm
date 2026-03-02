import { useEffect, useState, useRef } from 'react';
import Modal from '../Modal/Modal';
import styles from '../Modal/Modal.module.scss';
import { engagementOptions } from '../../data/initialData';

const initialFormState = {
    nom: '',
    profil: '',
    relation: '',
    engagement: '',
    action: '',
    origine: '',
    lien: ''
};

const PartenariatForm = ({ isOpen, onClose, onSubmit, partenariat = null, mode = 'edit' }) => {
    const [formData, setFormData] = useState(initialFormState);
    const formRef = useRef(null);

    useEffect(() => {
        if (partenariat && mode === 'edit') {
            setFormData({
                nom: partenariat.nom || '',
                profil: partenariat.profil || '',
                relation: partenariat.relation || '',
                engagement: partenariat.engagement || '',
                action: partenariat.action || '',
                origine: partenariat.origine || '',
                lien: partenariat.lien || ''
            });
        } else {
            setFormData(initialFormState);
        }
    }, [partenariat, mode, isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (event) => {
            if (event.ctrlKey && event.key === 'Enter') {
                event.preventDefault();
                formRef.current?.requestSubmit();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    const title = mode === 'edit' ? 'Modifier le partenariat' : 'Ajouter un partenaire';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form ref={formRef} onSubmit={handleSubmit} className={styles.wideForm}>
                <fieldset className={styles.formSection}>
                    <legend>Identité</legend>
                    <div className={styles.formGrid3}>
                        <div className={styles.formGroup}>
                            <label>Nom *</label>
                            <input
                                type="text"
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Profil / rôle</label>
                            <input
                                type="text"
                                name="profil"
                                value={formData.profil}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Relation</label>
                            <input
                                type="text"
                                name="relation"
                                value={formData.relation}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset className={styles.formSection}>
                    <legend>Suivi</legend>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Engagement</label>
                            <select
                                name="engagement"
                                value={formData.engagement}
                                onChange={handleChange}
                            >
                                {engagementOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Origine / contexte</label>
                            <input
                                type="text"
                                name="origine"
                                value={formData.origine}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Action requise / notes</label>
                            <textarea
                                name="action"
                                value={formData.action}
                                onChange={handleChange}
                                rows={3}
                            />
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Lien</label>
                            <input
                                type="text"
                                name="lien"
                                value={formData.lien}
                                onChange={handleChange}
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </fieldset>

                <div className={styles.modalButtons}>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        Annuler
                    </button>
                    <button type="submit" className="btn btn-success">
                        Enregistrer
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default PartenariatForm;
