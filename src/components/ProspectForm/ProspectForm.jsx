import { useState, useEffect, useRef } from 'react';
import Modal from '../Modal/Modal';
import styles from '../Modal/Modal.module.scss';
import { secteurOptions, canalOptions, statutOptions } from '../../data/initialData';

const priorityOptions = [
    { value: 'URGENTE', label: 'URGENTE' },
    { value: 'Très haute', label: 'Très haute' },
    { value: 'Haute', label: 'Haute' },
    { value: 'Moyenne', label: 'Moyenne' },
    { value: 'Faible', label: 'Faible' }
];

const getDefaultPriority = (statut) => (statut === 'À contacter' ? 'Très haute' : 'Faible');

const initialFormState = {
    nomEntreprise: '',
    secteur: '',
    adresse: '',
    ville: '',
    telephone: '',
    email: '',
    website: '',
    contactCle: '',
    canal: '',
    dateContact: '',
    statut: 'À contacter',
    priorite: 'Très haute',
    dernierContact: '',
    prochaiAction: '',
    projetEcheance: '',
    distanceGare: '',
    horaires: '',
    notes: '',
    notesSEO: '',
    messageAccroche: '',
    // Offres offertes
    auditRealise: false,
    maquetteRealisee: false,
    devisEnvoye: false,
    appelRdv: false,
    // Cartes de visite
    cartesVisite: false,
    cartesVisiteEndroits: [],
    // Sites réalisés
    siteRealise: false,
    suiviSite: false
};

const ProspectForm = ({ isOpen, onClose, onSubmit, prospect = null, mode = 'add' }) => {
    const [formData, setFormData] = useState(initialFormState);
    const formRef = useRef(null);

    useEffect(() => {
        if (prospect && mode === 'edit') {
            setFormData({
                nomEntreprise: prospect.nomEntreprise || '',
                secteur: prospect.secteur || '',
                adresse: prospect.adresse || '',
                ville: prospect.ville || '',
                telephone: prospect.telephone || '',
                email: prospect.email || '',
                website: prospect.website || '',
                contactCle: prospect.contactCle || '',
                canal: prospect.canal || '',
                dateContact: prospect.dateContact || '',
                statut: prospect.statut || 'À contacter',
                priorite: prospect.priorite || getDefaultPriority(prospect.statut || 'À contacter'),
                dernierContact: prospect.dernierContact || '',
                prochaiAction: prospect.prochaiAction || '',
                projetEcheance: prospect.projetEcheance || '',
                distanceGare: prospect.distanceGare || '',
                horaires: prospect.horaires || '',
                notes: prospect.notes || '',
                notesSEO: prospect.notesSEO || '',
                messageAccroche: prospect.messageAccroche || '',
                // Offres offertes
                auditRealise: prospect.auditRealise || false,
                maquetteRealisee: prospect.maquetteRealisee || false,
                devisEnvoye: prospect.devisEnvoye || false,
                appelRdv: prospect.appelRdv || false,
                // Cartes de visite
                cartesVisite: prospect.cartesVisite || false,
                cartesVisiteEndroits: prospect.cartesVisiteEndroits || [],
                // Sites réalisés
                siteRealise: prospect.siteRealise || false,
                suiviSite: prospect.suiviSite || false
            });
        } else {
            setFormData(initialFormState);
        }
    }, [prospect, mode, isOpen]);

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
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            // Gestion spéciale pour les endroits des cartes de visite
            if (name.startsWith('endroit_')) {
                const endroit = name.replace('endroit_', '');
                setFormData(prev => ({
                    ...prev,
                    cartesVisiteEndroits: checked
                        ? [...prev.cartesVisiteEndroits, endroit]
                        : prev.cartesVisiteEndroits.filter(e => e !== endroit)
                }));
                return;
            }
            setFormData(prev => ({ ...prev, [name]: checked }));
            return;
        }
        if (name === 'statut') {
            setFormData(prev => ({
                ...prev,
                statut: value,
                priorite: value === 'À contacter' ? 'TRÈS HAUTE' : prev.priorite || 'Faible'
            }));
            return;
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData(initialFormState);
        onClose();
    };

    const title = mode === 'add' ? 'Ajouter un prospect' : 'Modifier prospect';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} wide>
            <form ref={formRef} onSubmit={handleSubmit} className={styles.wideForm}>
                {/* Section Identité */}
                <fieldset className={styles.formSection}>
                    <legend>Identité</legend>
                    <div className={styles.formGrid3}>
                        <div className={styles.formGroup}>
                            <label>Nom entreprise *</label>
                            <input
                                type="text"
                                name="nomEntreprise"
                                value={formData.nomEntreprise}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Secteur / activité *</label>
                            <select
                                name="secteur"
                                value={formData.secteur}
                                onChange={handleChange}
                                required
                            >
                                {secteurOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Nom du contact (nom + fonction) *</label>
                            <input
                                type="text"
                                name="contactCle"
                                value={formData.contactCle}
                                onChange={handleChange}
                                required
                                placeholder="Ex: Jean Dupont, Gérant"
                            />
                        </div>
                    </div>
                </fieldset>

                {/* Section Localisation */}
                <fieldset className={styles.formSection}>
                    <legend>Localisation</legend>
                    <div className={styles.formGrid3}>
                        <div className={styles.formGroup}>
                            <label>Adresse physique</label>
                            <input
                                type="text"
                                name="adresse"
                                value={formData.adresse}
                                onChange={handleChange}
                                placeholder="Ex: 45 rue de la Paix"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Code postal / ville</label>
                            <input
                                type="text"
                                name="ville"
                                value={formData.ville}
                                onChange={handleChange}
                                placeholder="Ex: 78620 L'Étang-la-Ville"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Distance gare</label>
                            <input
                                type="text"
                                name="distanceGare"
                                value={formData.distanceGare}
                                onChange={handleChange}
                                placeholder="Ex: 500 m (7 min pied)"
                            />
                        </div>
                    </div>
                </fieldset>

                {/* Section Contact */}
                <fieldset className={styles.formSection}>
                    <legend>Coordonnées</legend>
                    <div className={styles.formGrid3}>
                        <div className={styles.formGroup}>
                            <label>Téléphone principal</label>
                            <input
                                type="tel"
                                name="telephone"
                                value={formData.telephone}
                                onChange={handleChange}
                                placeholder="Ex: 01 23 45 67 89"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Courriel principal</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Ex: contact@entreprise.fr"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Site web</label>
                            <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="https://exemple.fr"
                            />
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Horaires d'ouverture</label>
                            <input
                                type="text"
                                name="horaires"
                                value={formData.horaires}
                                onChange={handleChange}
                                placeholder="Ex: Mar-Sam 7h-19h30 / Dim 7h-13h"
                            />
                        </div>
                    </div>
                </fieldset>

                {/* Section Prospection */}
                <fieldset className={styles.formSection}>
                    <legend>Prospection</legend>
                    <div className={styles.formGrid3}>
                        <div className={styles.formGroup}>
                            <label>Canal d'origine *</label>
                            <select
                                name="canal"
                                value={formData.canal}
                                onChange={handleChange}
                                required
                            >
                                {canalOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Statut actuel *</label>
                            <select
                                name="statut"
                                value={formData.statut}
                                onChange={handleChange}
                                required
                            >
                                {statutOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Priorité *</label>
                            <select
                                name="priorite"
                                value={formData.priorite}
                                onChange={handleChange}
                                required
                            >
                                {priorityOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Date premier contact</label>
                            <input
                                type="date"
                                name="dateContact"
                                value={formData.dateContact}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    {/* Offres offertes - Checkboxes */}
                    <div className={styles.formRow}>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="appelRdv"
                                    checked={formData.appelRdv}
                                    onChange={handleChange}
                                />
                                <span>📞 Appel / RDV réalisé</span>
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="auditRealise"
                                    checked={formData.auditRealise}
                                    onChange={handleChange}
                                />
                                <span>🔍 Audit réalisé (offert)</span>
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="maquetteRealisee"
                                    checked={formData.maquetteRealisee}
                                    onChange={handleChange}
                                />
                                <span>🎨 Maquette réalisée (offert)</span>
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="devisEnvoye"
                                    checked={formData.devisEnvoye}
                                    onChange={handleChange}
                                />
                                <span>📄 Devis envoyé (offert)</span>
                            </label>
                        </div>
                    </div>
                    {/* Cartes de visite - Checkboxes */}
                    <div className={styles.formRow}>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="cartesVisite"
                                    checked={formData.cartesVisite}
                                    onChange={handleChange}
                                />
                                <span>🎴 Cartes de visite déposées</span>
                            </label>
                        </div>
                    </div>

                    {/* Sites réalisés - Checkboxes */}
                    <div className={styles.formRow}>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="siteRealise"
                                    checked={formData.siteRealise}
                                    onChange={handleChange}
                                />
                                <span>🌐 Site réalisé (payant)</span>
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="suiviSite"
                                    checked={formData.suiviSite}
                                    onChange={handleChange}
                                />
                                <span>🔧 Suivi du site</span>
                            </label>
                        </div>
                    </div>
                </fieldset>

                {/* Section Suivi */}
                <fieldset className={styles.formSection}>
                    <legend>Suivi</legend>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Dernier contact (description)</label>
                            <input
                                type="text"
                                name="dernierContact"
                                value={formData.dernierContact}
                                onChange={handleChange}
                                placeholder="Ex: Appel téléphonique avec Jean – Intéressé mais budget limité"
                            />
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Prochaine action prévue</label>
                            <input
                                type="text"
                                name="prochaiAction"
                                value={formData.prochaiAction}
                                onChange={handleChange}
                                placeholder="Ex: Relance mail J+3 avec devis – Vendredi 14h00"
                            />
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Projet dans quelques mois (estimation)</label>
                            <input
                                type="text"
                                name="projetEcheance"
                                value={formData.projetEcheance}
                                onChange={handleChange}
                                placeholder="Ex: 2–3 mois"
                            />
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Notes / observations</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Ex: Opportunité identifiée, contexte, objections, décideurs..."
                            />
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Notes SEO</label>
                            <textarea
                                name="notesSEO"
                                value={formData.notesSEO}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Ex: Audit SEO, présence GMB, site existant, opportunités digitales..."
                            />
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Message d'accroche personnalisé</label>
                            <textarea
                                name="messageAccroche"
                                value={formData.messageAccroche}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Ex: Bonjour [Prénom], je suis spécialisé dans... Seriez-vous disponible pour un échange de 15 minutes ?"
                            />
                        </div>
                    </div>
                </fieldset>

                <div className={styles.modalButtons}>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        Annuler
                    </button>
                    <button type="submit" className="btn btn-success">
                        {mode === 'add' ? 'Ajouter Prospect' : 'Enregistrer'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ProspectForm;
