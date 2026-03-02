import { useState, useMemo } from 'react';
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
 * Supporte le tri ascendant/descendant par colonne
 */
const DataTable = ({ columns, data, searchFilter, onEdit, onDelete, onView, maxChars = 80, lookupMaps = {} }) => {
    const [sortKey, setSortKey] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'

    const handleSort = (colKey) => {
        if (sortKey === colKey) {
            if (sortDirection === 'asc') {
                setSortDirection('desc');
            } else {
                // Third click → reset sort
                setSortKey(null);
                setSortDirection('asc');
            }
        } else {
            setSortKey(colKey);
            setSortDirection('asc');
        }
    };

    const filteredData = searchFilter
        ? data.filter(item =>
            Object.values(item).some(val =>
                String(val || '').toLowerCase().includes(searchFilter.toLowerCase())
            )
        )
        : data;

    const sortedData = useMemo(() => {
        if (!sortKey) return filteredData;
        return [...filteredData].sort((a, b) => {
            let valA = a[sortKey];
            let valB = b[sortKey];

            // Resolve lookups for sorting
            const lookupEntity = LOOKUP_KEY_MAP[sortKey];
            if (lookupEntity && lookupMaps[lookupEntity]) {
                valA = lookupMaps[lookupEntity][valA] || valA;
                valB = lookupMaps[lookupEntity][valB] || valB;
            }

            // Handle nulls
            if (valA == null && valB == null) return 0;
            if (valA == null) return 1;
            if (valB == null) return -1;

            // Numeric sort
            if (typeof valA === 'number' && typeof valB === 'number') {
                return sortDirection === 'asc' ? valA - valB : valB - valA;
            }

            // Boolean sort
            if (typeof valA === 'boolean') {
                return sortDirection === 'asc'
                    ? (valA === valB ? 0 : valA ? -1 : 1)
                    : (valA === valB ? 0 : valA ? 1 : -1);
            }

            // String sort
            const strA = String(valA).toLowerCase();
            const strB = String(valB).toLowerCase();
            const cmp = strA.localeCompare(strB, 'fr');
            return sortDirection === 'asc' ? cmp : -cmp;
        });
    }, [filteredData, sortKey, sortDirection, lookupMaps]);

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

    if (sortedData.length === 0) {
        return (
            <div className={styles.empty}>
                <p>🔍 Aucun résultat{searchFilter ? ` pour "${searchFilter}"` : ''}</p>
            </div>
        );
    }

    const renderSortIndicator = (colKey) => {
        if (sortKey !== colKey) return <span className={styles.sortIcon}>⇅</span>;
        return <span className={styles.sortIconActive}>{sortDirection === 'asc' ? '▲' : '▼'}</span>;
    };

    return (
        <div className={styles.tableWrapper}>
            <div className={styles.tableInfo}>
                <span>{sortedData.length} élément{sortedData.length > 1 ? 's' : ''}</span>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {columns.map(col => (
                            <th
                                key={col.key}
                                style={col.width ? { width: col.width } : {}}
                                className={styles.sortableTh}
                                onClick={() => handleSort(col.key)}
                                title={`Trier par ${col.label}`}
                            >
                                <span className={styles.thContent}>
                                    {col.label}
                                    {renderSortIndicator(col.key)}
                                </span>
                            </th>
                        ))}
                        <th className={styles.actionsCol}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map(item => (
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
