import { useState } from 'react';
import styles from './Controls.module.scss';

const Controls = ({ onAddClick, onExportClick, onImportClick, onSettingsClick, onInfoClick, addLabel, addContext, searchValue, onSearchChange }) => {
    const [showSearchHelp, setShowSearchHelp] = useState(false);

    return (
        <div className={styles.controls}>
            <div className={styles.btnGroup}>
                <button
                    className={`btn ${styles.addButton} ${addContext === 'partenariats' ? styles.addPartenariat : styles.addProspect}`}
                    onClick={onAddClick}
                >
                    {addLabel}
                </button>
                <button className="btn btn-secondary" onClick={onExportClick}>
                    📥 EXPORT
                </button>
                <button className="btn btn-secondary" onClick={onImportClick}>
                    📤 IMPORT
                </button>
                <button className={`btn ${styles.btnSettings}`} onClick={onSettingsClick} title="Paramètres">
                    ⚙️ PARAMÈTRES
                </button>
                <button className={`btn ${styles.btnInfo}`} onClick={onInfoClick} title="Aide">
                    ℹ️ AIDE
                </button>
            </div>
            <div className={styles.searchBox}>
                <input
                    type="text"
                    placeholder="Rechercher par entreprise, contact, ville..."
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={searchValue ? styles.inputWithClear : ''}
                />
                {searchValue && (
                    <button
                        className={styles.clearBtn}
                        onClick={() => onSearchChange('')}
                        title="Effacer la recherche"
                        aria-label="Effacer"
                    >
                        ×
                    </button>
                )}
                <button
                    className={styles.searchHelpBtn}
                    onClick={() => setShowSearchHelp(!showSearchHelp)}
                    title="Aide recherche"
                >
                    ?
                </button>
                {showSearchHelp && (
                    <div className={styles.searchHelpTooltip}>
                        <button
                            className={styles.closeHelp}
                            onClick={() => setShowSearchHelp(false)}
                        >
                            ×
                        </button>
                        <h4>🔍 Guide de recherche</h4>
                        <div className={styles.helpContent}>
                            <div className={styles.helpSection}>
                                <strong>Recherche simple :</strong>
                                <p>Tapez un ou plusieurs mots (ET implicite)</p>
                                <code>restaurant paris</code>
                                <small>→ Contient "restaurant" ET "paris"</small>
                            </div>
                            <div className={styles.helpSection}>
                                <strong>Phrase exacte :</strong>
                                <p>Entourez de guillemets <code>"</code></p>
                                <code>"en cours"</code>
                                <small>→ Trouve exactement la phrase « en cours »</small>
                            </div>
                            <div className={styles.helpSection}>
                                <strong>Cibler un champ précis :</strong>
                                <p>Préfixe <code>champ:</code> avant la valeur</p>
                                <code>statut:froid</code>
                                <code>statut:[en cours, courant de l'année, relancé]</code>
                                <code>ville:paris</code>
                                <small>Champs : statut, nom, ville, contact, secteur, canal, priorite, notes, tel, email, action, adresse</small>
                            </div>
                            <div className={styles.helpSection}>
                                <strong>OU — plusieurs valeurs :</strong>
                                <p>Crochets <code>[</code> <code>]</code> avec des virgules</p>
                                <code>[en cours, courant de l'année]</code>
                                <small>→ Cherche dans tous les champs</small>
                            </div>
                            <div className={styles.helpSection}>
                                <strong>Exclure des mots (global) :</strong>
                                <p>Préfixe <code>-</code> (moins) devant le mot</p>
                                <code>artisan -refusé</code>
                                <small>→ Artisans SAUF si le mot "refusé" apparaît quelque part</small>
                            </div>
                            <div className={styles.helpSection}>
                                <strong>Exclure par champ précis :</strong>
                                <p>Préfixe <code>-</code> devant le champ</p>
                                <code>-statut:froid</code>
                                <code>-statut:[à contacter, froid, refusé]</code>
                                <code>-statut:"sans réponse"</code>
                                <small>→ Pour les valeurs avec espaces : guillemets ou crochets</small>
                            </div>
                            <div className={styles.helpSection}>
                                <strong>Tout combiner :</strong>
                                <code>statut:[en cours, courant de l'année] -statut:[froid, refusé]</code>
                                <code>artisan -statut:[à contacter, sans réponse]</code>
                                <small>→ Inclusions et exclusions ciblées sur un champ</small>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Controls;
