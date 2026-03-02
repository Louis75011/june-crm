import styles from './DataTable.module.scss';

// Map des clés de lookup : champ ID → entité de lookup
const LOOKUP_KEY_MAP = {
    clientId: 'clients',
    programmeId: 'programmes',
    campagneId: 'campagnes',
    landingPageId: 'landingpages',
    landingPageSourceId: 'landingpages',
    campagneSourceId: 'campagnes',
};

/**
 * Composant tableau générique pour les entités June Lab CRM
 * Supporte les lookups/relations pour résoudre les IDs en noms lisibles
 */
const DataTable = ({ columns, data, searchFilter, onEdit, onDelete, onView, maxChars = 80, lookupMaps = {} }) => {
    const filteredData = searchFilter
        ? data.filter(item =>
            Object.values(item).some(val =>
                String(val || '').toLowerCase().includes(searchFilter.toLowerCase())
            )
        )
        : data;

    const truncate = (text, max = maxChars) => {
        if (!text) return '—';
        const str = String(text);
        return str.length > max ? str.slice(0, max) + '…' : str;
    };

    const resolveLookup = (key, value) => {
        const lookupEntity = LOOKUP_KEY_MAP[key];
        if (lookupEntity && lookupMaps[lookupEntity] && value != null) {
            const resolved = lookupMaps[lookupEntity][value];
            return resolved || `#${value}`;
        }
        return null;
    };

    const renderCell = (item, col) => {
        const value = item[col.key];

        if (col.render) return col.render(value, item);

        // Lookup resolution
        const lookupName = resolveLookup(col.key, value);
        if (lookupName) {
            return <span className={styles.lookup} title={`ID: ${value}`}>{lookupName}</span>;
        }

        if (col.type === 'badge') {
            const colorMap = col.colorMap || {};
            const color = colorMap[value] || 'var(--color-muted)';
            return <span className={styles.badge} style={{ background: color }}>{value || '—'}</span>;
        }

        if (col.type === 'boolean') {
            return value ? '✅' : '❌';
        }

        if (col.type === 'currency') {
            return value != null ? `${Number(value).toLocaleString('fr-FR')} €` : '—';
        }

        if (col.type === 'date') {
            if (!value) return '—';
            return new Date(value).toLocaleDateString('fr-FR');
        }

        if (col.type === 'url') {
            return value ? <a href={value} target="_blank" rel="noopener noreferrer" className={styles.link}>{truncate(value, 40)}</a> : '—';
        }

        return truncate(value);
    };

    if (filteredData.length === 0) {
        return (
            <div className={styles.empty}>
                <p>🔍 Aucun résultat{searchFilter ? ` pour "${searchFilter}"` : ''}</p>
            </div>
        );
    }

    return (
        <div className={styles.tableWrapper}>
            <div className={styles.tableInfo}>
                <span>{filteredData.length} élément{filteredData.length > 1 ? 's' : ''}</span>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {columns.map(col => (
                            <th key={col.key} style={col.width ? { width: col.width } : {}}>
                                {col.label}
                            </th>
                        ))}
                        <th className={styles.actionsCol}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map(item => (
                        <tr key={item.id}>
                            {columns.map(col => (
                                <td key={col.key}>{renderCell(item, col)}</td>
                            ))}
                            <td className={styles.actions}>
                                {onView && (
                                    <button className={styles.btnView} onClick={() => onView(item)} title="Voir">👁️</button>
                                )}
                                {onEdit && (
                                    <button className={styles.btnEdit} onClick={() => onEdit(item)} title="Modifier">✏️</button>
                                )}
                                {onDelete && (
                                    <button className={styles.btnDelete} onClick={() => onDelete(item.id)} title="Supprimer">🗑️</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
