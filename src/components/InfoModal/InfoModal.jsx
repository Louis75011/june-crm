import Modal from '../Modal/Modal';
import styles from './InfoModal.module.scss';

const InfoModal = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="ℹ️ Aide — June Lab CRM">
            <div className={styles.infoContent}>
                <div className={styles.section}>
                    <h4>🏢 Entités du CRM</h4>
                    <ul>
                        <li>
                            <span className={styles.action}>Clients</span>
                            <span className={styles.desc}>Promoteurs, coopératives, bailleurs — les commanditaires de vos programmes</span>
                        </li>
                        <li>
                            <span className={styles.action}>Programmes</span>
                            <span className={styles.desc}>Programmes immobiliers (neuf, BRS, rénovation) rattachés à un client</span>
                        </li>
                        <li>
                            <span className={styles.action}>Campagnes</span>
                            <span className={styles.desc}>Campagnes publicitaires (Meta Ads, Google Ads, newsletter) avec UTMs</span>
                        </li>
                        <li>
                            <span className={styles.action}>Landing Pages</span>
                            <span className={styles.desc}>Pages de captation de prospects, avec suivi des trackers (GA4, Meta Pixel)</span>
                        </li>
                        <li>
                            <span className={styles.action}>Prospects</span>
                            <span className={styles.desc}>Contacts issus des formulaires LP — avec suivi de statut et transmission client</span>
                        </li>
                        <li>
                            <span className={styles.action}>Templates Email</span>
                            <span className={styles.desc}>Emails de confirmation, relance et newsletter par programme</span>
                        </li>
                        <li>
                            <span className={styles.action}>Statistiques</span>
                            <span className={styles.desc}>KPIs par campagne : impressions, clics, sessions, prospects générés, coût</span>
                        </li>
                    </ul>
                </div>

                <div className={styles.section}>
                    <h4>🖱️ Navigation</h4>
                    <ul>
                        <li>
                            <span className={styles.shortcut}>👁️ Voir</span>
                            <span className={styles.desc}>Ouvre la fiche détaillée d'un élément (avec résolution des relations)</span>
                        </li>
                        <li>
                            <span className={styles.shortcut}>✏️ Modifier</span>
                            <span className={styles.desc}>Ouvre le formulaire d'édition</span>
                        </li>
                        <li>
                            <span className={styles.shortcut}>🗑️ Supprimer</span>
                            <span className={styles.desc}>Supprime avec confirmation</span>
                        </li>
                        <li>
                            <span className={styles.shortcut}>Échap</span>
                            <span className={styles.desc}>Ferme la fenêtre modale active</span>
                        </li>
                    </ul>
                </div>

                <div className={styles.section}>
                    <h4>📋 Gestion des données</h4>
                    <ul>
                        <li>
                            <span className={styles.action}>+ Ajouter</span>
                            <span className={styles.desc}>Créer un nouvel élément dans l'entité active</span>
                        </li>
                        <li>
                            <span className={styles.action}>📥 Export</span>
                            <span className={styles.desc}>Télécharger les données de l'onglet actif en CSV</span>
                        </li>
                        <li>
                            <span className={styles.action}>📤 Import</span>
                            <span className={styles.desc}>Importer des données depuis un fichier CSV</span>
                        </li>
                        <li>
                            <span className={styles.action}>🔍 Recherche</span>
                            <span className={styles.desc}>Filtre instantané sur tous les champs de l'onglet courant</span>
                        </li>
                    </ul>
                </div>

                <div className={styles.section}>
                    <h4>🔗 Relations & Lookups</h4>
                    <p>Les IDs de relations (clientId, programmeId, campagneId…) sont automatiquement résolus en noms lisibles dans les tableaux et fiches détaillées.</p>
                    <p style={{ fontSize: '0.78rem', color: '#888', marginTop: '0.5rem' }}>
                        Liens rapides vers les Landing Pages déployées disponibles dans la barre latérale.
                    </p>
                </div>

                <div className={styles.modalButtons}>
                    <button type="button" className="btn btn-primary" onClick={onClose}>
                        Compris !
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default InfoModal;
