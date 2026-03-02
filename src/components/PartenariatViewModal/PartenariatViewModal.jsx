import { useEffect } from 'react';
import styles from './PartenariatViewModal.module.scss';

const PartenariatViewModal = ({ isOpen, onClose, partenariat }) => {
    if (!isOpen || !partenariat) return null;

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

    const getEngagementBadgeClass = (engagement) => {
        if (!engagement) return '';
        const engagementLower = engagement.toLowerCase();
        if (engagementLower.includes('accord')) return styles.badgeAccord;
        if (engagementLower.includes('intéressé') && !engagementLower.includes('non') && !engagementLower.includes('moyen')) return styles.badgeInteresse;
        if (engagementLower.includes('moyen')) return styles.badgeMoyen;
        if (engagementLower.includes('non intéressé')) return styles.badgeNonInteresse;
        if (engagementLower.includes('premier')) return styles.badgePremierContact;
        return '';
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <div className={styles.headerInfo}>
                        <h2>🤝 {partenariat.nom || 'Partenariat'}</h2>
                        {partenariat.engagement && (
                            <span className={`${styles.badge} ${getEngagementBadgeClass(partenariat.engagement)}`}>
                                {partenariat.engagement}
                            </span>
                        )}
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>

                <div className={styles.modalBody}>
                    {/* Section Identité */}
                    <div className={styles.section}>
                        <h3>👤 Identité</h3>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Nom</span>
                                <span className={styles.value}>{partenariat.nom || '-'}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Profil / Rôle</span>
                                <span className={styles.value}>{partenariat.profil || '-'}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Relation</span>
                                <span className={styles.value}>{partenariat.relation || '-'}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Lien</span>
                                <span className={styles.value}>
                                    {partenariat.lien ? (
                                        partenariat.lien.startsWith('http') ? (
                                            <a href={partenariat.lien} target="_blank" rel="noopener noreferrer" className={styles.link}>
                                                {partenariat.lien}
                                            </a>
                                        ) : (
                                            partenariat.lien
                                        )
                                    ) : '-'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Section Contexte */}
                    <div className={styles.section}>
                        <h3>📍 Contexte</h3>
                        <div className={styles.infoGrid}>
                            <div className={`${styles.infoItem} ${styles.halfWidth}`}>
                                <span className={styles.label}>Origine / Contexte</span>
                                <span className={styles.value}>{partenariat.origine || '-'}</span>
                            </div>
                            <div className={`${styles.infoItem} ${styles.halfWidth}`}>
                                <span className={styles.label}>Engagement</span>
                                <span className={styles.value}>
                                    {partenariat.engagement ? (
                                        <span className={`${styles.badge} ${getEngagementBadgeClass(partenariat.engagement)}`}>
                                            {partenariat.engagement}
                                        </span>
                                    ) : '-'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Section Actions / Notes */}
                    <div className={styles.section}>
                        <h3>📝 Action requise / Notes</h3>
                        <div className={styles.textBlock}>{partenariat.action || '-'}</div>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className="btn-secondary" onClick={onClose}>Fermer</button>
                </div>
            </div>
        </div>
    );
};

export default PartenariatViewModal;
