import Modal from '../Modal/Modal';
import styles from './EntityViewModal.module.scss';

// Map des clés de lookup
const LOOKUP_KEY_MAP = {
    clientId: 'clients',
    programmeId: 'programmes',
    campagneId: 'campagnes',
    landingPageId: 'landingpages',
    landingPageSourceId: 'landingpages',
    campagneSourceId: 'campagnes',
};

/**
 * Modal de vue détaillée pour une entité
 * @param {Array} fields - [{ key, label, type }]
 * @param {Object} data - L'entité à afficher
 * @param {Object} lookupMaps - Maps de lookup pour résoudre les IDs
 */
const EntityViewModal = ({ isOpen, onClose, data, fields, title, lookupMaps = {} }) => {
    if (!data) return null;

    const resolveLookup = (key, value) => {
        const entity = LOOKUP_KEY_MAP[key];
        if (entity && lookupMaps[entity] && value != null) {
            return lookupMaps[entity][value] || `#${value}`;
        }
        return null;
    };

    const renderValue = (field) => {
        const value = data[field.key];

        // Lookup resolution
        const lookupName = resolveLookup(field.key, value);
        if (lookupName) return <span title={`ID: ${value}`}>🔗 {lookupName}</span>;

        if (field.type === 'boolean') return value ? '✅ Oui' : '❌ Non';
        if (field.type === 'currency') return value != null ? `${Number(value).toLocaleString('fr-FR')} €` : '—';
        if (field.type === 'date') return value ? new Date(value).toLocaleDateString('fr-FR') : '—';
        if (field.type === 'url') return value ? <a href={value} target="_blank" rel="noopener noreferrer">{value}</a> : '—';

        return value || '—';
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={styles.container}>
                <h2 className={styles.title}>{title || 'Détail'}</h2>
                <div className={styles.grid}>
                    {fields.map(field => (
                        <div key={field.key} className={styles.field}>
                            <span className={styles.label}>{field.label}</span>
                            <span className={styles.value}>{renderValue(field)}</span>
                        </div>
                    ))}
                </div>
                <div className={styles.actions}>
                    <button onClick={onClose} className={styles.btnClose}>Fermer</button>
                </div>
            </div>
        </Modal>
    );
};

export default EntityViewModal;
