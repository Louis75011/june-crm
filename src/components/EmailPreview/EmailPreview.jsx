import styles from './EmailPreview.module.scss';

/**
 * Prévisualisation d'un email de notification contact
 * Style inspiré du template Arx Systema, adapté June Lab
 * @param {Object} prospect - Données du prospect (nom, email, telephone, etc.)
 * @param {Object} template - Données du template (nom, typeTemplate, etc.)
 * @param {Object} lookupMaps - Maps de lookup pour résoudre les IDs
 */
const EmailPreview = ({ prospect, template, lookupMaps = {}, onClose }) => {
    // Données par défaut si pas de prospect fourni
    const data = prospect || {
        nomComplet: 'Sophie Martin',
        email: 'sophie.martin@email.com',
        telephone: '06 12 34 56 78',
        villeResidence: 'Saint-Denis',
        typologieRecherchee: '3P',
        utmSource: 'meta',
        utmCampaign: 'caps_lestraversees_lancement_v1',
        notes: 'Très intéressée par le T3 BRS, budget confirmé. Éligible BRS (revenus < plafond PLS).',
        consentementRGPD: true,
        dateSoumission: new Date().toISOString()
    };

    const programmeName = data.programmeId && lookupMaps.programmes
        ? lookupMaps.programmes[data.programmeId] || `Programme #${data.programmeId}`
        : 'Les Traversées – CAPS';

    const templateName = template?.nom || 'Confirmation inscription';
    const templateType = template?.typeTemplate || 'Confirmation';

    const formatDate = (dateStr) => {
        if (!dateStr) return new Date().toLocaleDateString('fr-FR');
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className={styles.previewContainer}>
            <div className={styles.previewHeader}>
                <h3>📧 Prévisualisation email</h3>
                <span className={styles.templateBadge}>{templateType}</span>
                {onClose && <button className={styles.closeBtn} onClick={onClose}>×</button>}
            </div>

            {/* Email frame */}
            <div className={styles.emailFrame}>
                {/* Email header - June Lab branding */}
                <div className={styles.emailHeader}>
                    <div className={styles.brandRow}>
                        <span className={styles.brandLogo}>●</span>
                        <span className={styles.brandName}>June Lab</span>
                    </div>
                    <div className={styles.emailSubject}>
                        🔔 Nouveau prospect — {programmeName}
                    </div>
                </div>

                {/* Email body */}
                <div className={styles.emailBody}>
                    <p className={styles.greeting}>Bonjour,</p>
                    <p className={styles.intro}>
                        Un nouveau prospect vient de remplir le formulaire de contact sur la landing page
                        <strong> {programmeName}</strong>. Voici les détails :
                    </p>

                    {/* Contact details card */}
                    <div className={styles.contactCard}>
                        <div className={styles.contactCardHeader}>
                            Détails du contact
                        </div>
                        <div className={styles.contactCardBody}>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Nom</span>
                                <span className={styles.detailValue}>{data.nomComplet || '—'}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Email</span>
                                <span className={styles.detailValue}>
                                    <a href={`mailto:${data.email}`}>{data.email || '—'}</a>
                                </span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Téléphone</span>
                                <span className={styles.detailValue}>{data.telephone || '—'}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Ville</span>
                                <span className={styles.detailValue}>{data.villeResidence || '—'}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Typologie</span>
                                <span className={styles.detailValue}>{data.typologieRecherchee || '—'}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Origine</span>
                                <span className={styles.detailValue}>{data.utmSource || 'Direct'}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Campagne</span>
                                <span className={styles.detailValue}>{data.utmCampaign || '—'}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>RGPD</span>
                                <span className={styles.detailValue}>{data.consentementRGPD ? '✅ Consentement donné' : '❌ Non consenti'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Message / Notes */}
                    {data.notes && (
                        <div className={styles.messageBlock}>
                            <div className={styles.messageLabel}>📝 Message / Notes</div>
                            <div className={styles.messageContent}>{data.notes}</div>
                        </div>
                    )}

                    {/* CTA Button */}
                    <div className={styles.ctaContainer}>
                        <button className={styles.ctaButton}>
                            Répondre au prospect →
                        </button>
                    </div>

                    {/* Footer date */}
                    <p className={styles.dateInfo}>
                        Formulaire soumis le {formatDate(data.dateSoumission)}
                    </p>
                </div>

                {/* Email footer */}
                <div className={styles.emailFooter}>
                    <p>Cet email a été envoyé automatiquement par <strong>June Lab CRM</strong></p>
                    <p>Template : {templateName} • Programme : {programmeName}</p>
                </div>
            </div>
        </div>
    );
};

export default EmailPreview;
