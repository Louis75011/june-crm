import Modal from '../Modal/Modal';
import styles from './InfoModal.module.scss';

const InfoModal = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="ℹ️ Aide & Raccourcis">
            <div className={styles.infoContent}>
                <div className={styles.section}>
                    <h4>🖱️ Navigation dans les tableaux</h4>
                    <ul>
                        <li>
                            <span className={styles.shortcut}>Clic</span>
                            <span className={styles.desc}>Ouvre la fiche de visualisation du prospect ou partenariat</span>
                        </li>
                        <li>
                            <span className={styles.shortcut}>Ctrl + Clic</span>
                            <span className={styles.desc}>Ouvre directement le formulaire d'édition</span>
                        </li>
                        <li>
                            <span className={styles.shortcut}>Ctrl + Entrée</span>
                            <span className={styles.desc}>Dans un formulaire ouvert, enregistre (bouton en bas à droite)</span>
                        </li>
                        <li>
                            <span className={styles.shortcut}>Échap</span>
                            <span className={styles.desc}>Ferme la fenêtre (équivalent à Annuler ou la croix)</span>
                        </li>
                        <li>
                            <span className={styles.shortcut}>Clic hors fenêtre</span>
                            <span className={styles.desc}>Ferme la fenêtre sans enregistrer</span>
                        </li>
                    </ul>
                </div>

                <div className={styles.section}>
                    <h4>📋 Gestion des données</h4>
                    <ul>
                        <li>
                            <span className={styles.action}>+ AJOUTER</span>
                            <span className={styles.desc}>Créer un nouveau prospect</span>
                        </li>
                        <li>
                            <span className={styles.action}>📥 EXPORT</span>
                            <span className={styles.desc}>Télécharger les données en CSV</span>
                        </li>
                        <li>
                            <span className={styles.action}>📤 IMPORT</span>
                            <span className={styles.desc}>Importer des données depuis un fichier CSV</span>
                        </li>
                    </ul>
                </div>

                <div className={styles.section}>
                    <h4>🔍 Recherche avancée</h4>
                    <p>La barre de recherche filtre sur tous les champs. Syntaxes disponibles :</p>
                    <ul>
                        <li>
                            <span className={styles.shortcut}>mots libres</span>
                            <span className={styles.desc}>ET implicite — tous doivent être présents : <em>restaurant paris</em></span>
                        </li>
                        <li>
                            <span className={styles.shortcut}>"phrase"</span>
                            <span className={styles.desc}>Phrase exacte entre guillemets : <em>"en cours"</em></span>
                        </li>
                        <li>
                            <span className={styles.shortcut}>[a, b, ...]</span>
                            <span className={styles.desc}>OU global — cherche dans tous les champs : <em>[en cours, courant de l'année]</em></span>
                        </li>
                        <li>
                            <span className={styles.shortcut}>champ:valeur</span>
                            <span className={styles.desc}>Cible un champ précis : <em>statut:froid</em> — <em>ville:paris</em> — <em>canal:instagram</em></span>
                        </li>
                        <li>
                            <span className={styles.shortcut}>champ:[a, b]</span>
                            <span className={styles.desc}>OU ciblé sur un champ : <em>statut:[en cours, courant de l'année]</em></span>
                        </li>
                        <li>
                            <span className={styles.shortcut}>-mot</span>
                            <span className={styles.desc}>Exclusion globale : <em>artisan -refusé</em> — retire tout ce qui contient ce mot</span>
                        </li>
                        <li>
                            <span className={styles.shortcut}>-champ:valeur</span>
                            <span className={styles.desc}>Exclusion ciblée : <em>-statut:froid</em> — mot seul sans espace</span>
                        </li>
                        <li>
                            <span className={styles.shortcut}>-champ:[a,b]</span>
                            <span className={styles.desc}>Exclure plusieurs (avec ou sans espaces) : <em>-statut:[à contacter, froid, refusé]</em></span>
                        </li>
                        <li>
                            <span className={styles.shortcut}>-champ:"phrase"</span>
                            <span className={styles.desc}>Exclure une valeur avec espace : <em>-statut:"sans réponse"</em></span>
                        </li>
                        <li>
                            <span className={styles.shortcut}>combiner</span>
                            <span className={styles.desc}><em>statut:[en cours, courant de l'année] -statut:[à contacter, froid]</em></span>
                        </li>
                    </ul>
                    <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.5rem' }}>
                        Champs disponibles : <em>statut, nom, ville, contact, secteur, canal, priorite, notes, tel, email, action, adresse</em>
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
