import { useEffect } from 'react';
import styles from './ProspectViewModal.module.scss';

const normalizeToBadgeKey = (value) => (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, '')
    .replace(/\s+/g, '-')
    .replace(/\+/g, '')
    .replace(/[^a-z0-9-]/g, '');

const ProspectViewModal = ({ isOpen, onClose, prospect }) => {
    if (!isOpen || !prospect) return null;

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains(styles.modalOverlay)) {
            onClose();
        }
    };

    // Générer un message d'accroche personnalisé
    const generateAccroche = () => {
        if (prospect.messageAccroche) return prospect.messageAccroche;

        const nom = prospect.contactCle?.split(',')[0] || 'Monsieur/Madame';
        const entreprise = prospect.nomEntreprise || 'votre entreprise';
        const secteur = prospect.secteur || '';

        const accroches = {
            'Collectivité': `Bonjour ${nom}, je suis spécialisé dans l'optimisation de la présence digitale des collectivités locales. Je souhaiterais vous présenter comment améliorer la visibilité de ${entreprise} auprès de vos administrés. Seriez-vous disponible pour un audit gratuit de 30 minutes ?`,
            'Boulangerie': `Bonjour ${nom}, en tant qu'artisan boulanger, vous méritez une vitrine digitale à la hauteur de votre savoir-faire. Je propose des solutions de Click & Collect et de mise en valeur de vos produits. Puis-je vous présenter cela en 15 minutes ?`,
            'Restaurant': `Bonjour ${nom}, la visibilité en ligne est essentielle pour les restaurateurs. Je peux vous aider à optimiser votre présence Google et à augmenter vos réservations. Un échange rapide vous intéresserait ?`,
            'Pharmacie': `Bonjour ${nom}, les patients recherchent leur pharmacie en ligne. Je vous propose d'optimiser votre fiche Google pour être trouvé facilement. Audit offert de votre visibilité actuelle.`,
            'Coiffure': `Bonjour ${nom}, avec un système de réservation en ligne, vous pouvez gagner 3-4 clients par mois tout en libérant votre temps. Je vous offre une maquette gratuite en 48h. Cela vous intéresse ?`,
            'Fleuriste': `Bonjour ${nom}, les commandes en ligne pour mariages, deuils et fêtes représentent une opportunité importante. Je peux créer votre vitrine web rapidement. Souhaitez-vous en discuter ?`,
            'Artisan': `Bonjour ${nom}, votre savoir-faire mérite d'être vu. Un portfolio en ligne avec vos réalisations et un système de devis pourrait multiplier vos demandes. 15 minutes pour vous présenter mes solutions ?`,
            'Immobilier': `Bonjour ${nom}, une présence locale optimisée génère des mandats qualifiés. Je propose des solutions de référencement géographique pour agents immobiliers. Intéressé par un échange ?`,
            'Commerce': `Bonjour ${nom}, votre commerce mérite une présence digitale performante. Site vitrine, e-commerce local ou optimisation Google : je peux vous accompagner. Un café pour en discuter ?`,
            'default': `Bonjour ${nom}, Arx Systema accompagne les entreprises locales dans leur transformation digitale. Je souhaiterais vous présenter comment améliorer la visibilité de ${entreprise}. Seriez-vous disponible pour un échange de 20 minutes ?`
        };

        return accroches[secteur] || accroches['default'];
    };

    return (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <div className={styles.headerInfo}>
                        <h2>{prospect.nomEntreprise}</h2>
                        <span className={`badge badge-${normalizeToBadgeKey(prospect.statut)}`}>
                            {prospect.statut}
                        </span>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>

                <div className={styles.modalBody}>
                    {/* Section Identité & Localisation */}
                    <section className={styles.section}>
                        <h3>🏢 Identité & Localisation</h3>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Entreprise</span>
                                <span className={styles.value}>{prospect.nomEntreprise || '-'}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Secteur</span>
                                <span className={styles.value}>{prospect.secteur || '-'}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Contact clé</span>
                                <span className={styles.value}>{prospect.contactCle || '-'}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Adresse</span>
                                <span className={styles.value}>{prospect.adresse || '-'}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Ville</span>
                                <span className={styles.value}>{prospect.ville || '-'}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Distance gare</span>
                                <span className={styles.value}>{prospect.distanceGare || '-'}</span>
                            </div>
                        </div>
                    </section>

                    {/* Section Coordonnées */}
                    <section className={styles.section}>
                        <h3>📞 Coordonnées & Horaires</h3>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Téléphone</span>
                                <span className={styles.value}>
                                    {prospect.telephone ? (
                                        <a href={`tel:${prospect.telephone}`} className={styles.link}>{prospect.telephone}</a>
                                    ) : '-'}
                                </span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Courriel</span>
                                <span className={styles.value}>
                                    {prospect.email ? (
                                        <a href={`mailto:${prospect.email}`} className={styles.link}>{prospect.email}</a>
                                    ) : '-'}
                                </span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Site web</span>
                                <span className={styles.value}>
                                    {prospect.website ? (
                                        <a href={prospect.website.startsWith('http') ? prospect.website : `https://${prospect.website}`}
                                            target="_blank" rel="noopener noreferrer" className={styles.link}>
                                            {prospect.website}
                                        </a>
                                    ) : '-'}
                                </span>
                            </div>
                            <div className={`${styles.infoItem} ${styles.halfWidth}`}>
                                <span className={styles.label}>Horaires</span>
                                <span className={styles.value}>{prospect.horaires || '-'}</span>
                            </div>
                        </div>
                    </section>

                    {/* Section Prospection */}
                    <section className={styles.section}>
                        <h3>🎯 Suivi prospection</h3>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Canal</span>
                                <span className={styles.value}>{prospect.canal || '-'}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>1er contact</span>
                                <span className={styles.value}>{prospect.dateContact || '-'}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Dernier contact</span>
                                <span className={styles.value}>{prospect.dernierContact || '-'}</span>
                            </div>
                            <div className={`${styles.infoItem} ${styles.halfWidth}`}>
                                <span className={styles.label}>Prochaine action</span>
                                <span className={styles.value}>{prospect.prochaiAction || '-'}</span>
                            </div>
                            <div className={`${styles.infoItem} ${styles.halfWidth}`}>
                                <span className={styles.label}>Projet (délai)</span>
                                <span className={styles.value}>{prospect.projetEcheance || '-'}</span>
                            </div>
                        </div>
                    </section>

                    {/* Section Offres Offertes */}
                    <section className={styles.section}>
                        <h3>🎁 Offres offertes</h3>
                        <div className={styles.tagGrid}>
                            <span className={`${styles.tag} ${prospect.appelRdv ? styles.tagActive : styles.tagInactive}`}>
                                📞 Appel / RDV
                            </span>
                            <span className={`${styles.tag} ${prospect.auditRealise ? styles.tagActive : styles.tagInactive}`}>
                                🔍 Audit réalisé
                            </span>
                            <span className={`${styles.tag} ${prospect.maquetteRealisee ? styles.tagActive : styles.tagInactive}`}>
                                🎨 Maquette réalisée
                            </span>
                            <span className={`${styles.tag} ${prospect.devisEnvoye ? styles.tagActive : styles.tagInactive}`}>
                                📄 Devis envoyé
                            </span>
                        </div>
                    </section>

                    {/* Section Cartes de Visite */}
                    {prospect.cartesVisite && (
                        <section className={styles.section}>
                            <h3>🎴 Cartes de visite déposées</h3>
                            <div className={styles.tagGrid}>
                                {prospect.cartesVisiteEndroits && prospect.cartesVisiteEndroits.length > 0 ? (
                                    prospect.cartesVisiteEndroits.map((endroit, idx) => (
                                        <span key={idx} className={`${styles.tag} ${styles.tagActive}`}>
                                            📍 {endroit}
                                        </span>
                                    ))
                                ) : (
                                    <span className={styles.value}>Endroits non spécifiés</span>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Section Sites Réalisés */}
                    <section className={styles.section}>
                        <h3>🌐 Sites réalisés</h3>
                        <div className={styles.tagGrid}>
                            <span className={`${styles.tag} ${prospect.siteRealise ? styles.tagActive : styles.tagInactive}`}>
                                🌐 Site réalisé (payant)
                            </span>
                            <span className={`${styles.tag} ${prospect.suiviSite ? styles.tagActive : styles.tagInactive}`}>
                                🔧 Suivi du site
                            </span>
                        </div>
                    </section>

                    {/* Section Notes */}
                    <section className={styles.section}>
                        <h3>📝 Notes</h3>
                        <div className={styles.textBlock}>
                            {prospect.notes || 'Aucune note.'}
                        </div>
                    </section>

                    {/* Section Notes SEO */}
                    {prospect.notesSEO && (
                        <section className={styles.section}>
                            <h3>🔍 Analyse SEO</h3>
                            <div className={`${styles.textBlock} ${styles.seoBlock}`}>
                                {prospect.notesSEO}
                            </div>
                        </section>
                    )}

                    {/* Section Message d'accroche */}
                    <section className={`${styles.section} ${styles.accrocheSection}`}>
                        <h3>💬 Message d'accroche suggéré</h3>
                        <div className={styles.accrocheBlock}>
                            {prospect.messageAccroche || generateAccroche()}
                        </div>
                    </section>
                </div>

                <div className={styles.modalFooter}>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProspectViewModal;
