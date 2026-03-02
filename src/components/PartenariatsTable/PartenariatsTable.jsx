import { useMemo, useState } from 'react';
import styles from './PartenariatsTable.module.scss';

const truncateText = (text, maxLength) => {
    if (!text) return '-';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '…';
};

const getEngagementBadgeClass = (engagement) => {
    if (!engagement) return '';
    const engagementLower = engagement.toLowerCase();
    if (engagementLower.includes('accord')) return 'badge-engagement-accord-etabli';
    if (engagementLower.includes('intéressé') && !engagementLower.includes('non') && !engagementLower.includes('moyen')) return 'badge-engagement-interesse';
    if (engagementLower.includes('moyen')) return 'badge-engagement-moyennement-interesse';
    if (engagementLower.includes('non intéressé')) return 'badge-engagement-non-interesse';
    if (engagementLower.includes('premier')) return 'badge-engagement-premier-contact';
    return '';
};

const PartenariatsTable = ({ partenariats, searchFilter, onEdit, onDelete, onView, maxChars = 30 }) => {
    const [sortConfig, setSortConfig] = useState({ key: 'nom', direction: 'asc' });

    // Filtrage amélioré avec support d'exclusion (-mot)
    const filteredPartenariats = useMemo(() => {
        if (!searchFilter) return partenariats;
        const search = searchFilter.toLowerCase().trim();
        const searchTerms = search.split(/\s+/);

        // Séparer les termes à inclure et à exclure
        const includeTerms = searchTerms.filter(term => !term.startsWith('-'));
        const excludeTerms = searchTerms
            .filter(term => term.startsWith('-'))
            .map(term => term.substring(1)); // Retirer le préfixe -

        return partenariats.filter(p => {
            const searchableText = [
                p.nom,
                p.profil,
                p.relation,
                p.engagement,
                p.action,
                p.origine,
                p.lien
            ].filter(Boolean).join(' ').toLowerCase();

            // Tous les termes à inclure doivent matcher
            const includeMatch = includeTerms.length === 0 || includeTerms.every(term => searchableText.includes(term));

            // Aucun terme à exclure ne doit matcher
            const excludeMatch = excludeTerms.length === 0 || !excludeTerms.some(term => searchableText.includes(term));

            return includeMatch && excludeMatch;
        });
    }, [partenariats, searchFilter]);

    const sortedPartenariats = useMemo(() => {
        const sorted = [...filteredPartenariats];
        sorted.sort((a, b) => {
            const aVal = (a[sortConfig.key] || '').toLowerCase();
            const bVal = (b[sortConfig.key] || '').toLowerCase();

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [filteredPartenariats, sortConfig]);

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return '↕';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.actionsCol}>Actions</th>
                        <th className={styles.sortable} onClick={() => handleSort('nom')}>
                            Nom {getSortIcon('nom')}
                        </th>
                        <th className={styles.sortable} onClick={() => handleSort('profil')}>
                            Profil / rôle {getSortIcon('profil')}
                        </th>
                        <th className={styles.sortable} onClick={() => handleSort('relation')}>
                            Relation {getSortIcon('relation')}
                        </th>
                        <th className={styles.sortable} onClick={() => handleSort('engagement')}>
                            Engagement {getSortIcon('engagement')}
                        </th>
                        <th>Action requise / notes</th>
                        <th className={styles.sortable} onClick={() => handleSort('origine')}>
                            Origine / contexte {getSortIcon('origine')}
                        </th>
                        <th>Lien</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedPartenariats.map(p => (
                        <tr
                            key={p.id}
                            className={styles.clickableRow}
                            onClick={(e) => {
                                if (e.ctrlKey || e.metaKey) {
                                    onEdit(p);
                                    return;
                                }
                                onView(p);
                            }}
                            title="Cliquez pour voir la fiche"
                        >
                            <td className={styles.actionsCol}>
                                <div className={styles.actionButtons}>
                                    <button
                                        className="btn btn-small btn-primary"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(p);
                                        }}
                                        title="Éditer"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="btn btn-small btn-danger"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(p.id);
                                        }}
                                        title="Supprimer"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </td>
                            <td title={p.nom}><strong>{truncateText(p.nom, maxChars)}</strong></td>
                            <td title={p.profil}>{truncateText(p.profil, maxChars)}</td>
                            <td title={p.relation}>{truncateText(p.relation, maxChars)}</td>
                            <td title={p.engagement}>
                                {p.engagement ? (
                                    <span className={`badge-engagement ${getEngagementBadgeClass(p.engagement)}`}>
                                        {truncateText(p.engagement, maxChars)}
                                    </span>
                                ) : '-'}
                            </td>
                            <td className={styles.notesCol}>
                                <div className={styles.notesContent} title={p.action}>
                                    {truncateText(p.action, Math.round(maxChars * 2))}
                                </div>
                            </td>
                            <td title={p.origine}>{truncateText(p.origine, maxChars)}</td>
                            <td>
                                {p.lien ? (
                                    p.lien.startsWith('http') ? (
                                        <a
                                            href={p.lien}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={p.lien}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            🔗
                                        </a>
                                    ) : (
                                        <span title={p.lien}>{truncateText(p.lien, maxChars)}</span>
                                    )
                                ) : '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {sortedPartenariats.length === 0 && (
                <div className={styles.noResults}>
                    Aucun partenariat trouvé{searchFilter ? ` pour "${searchFilter}"` : ''}
                </div>
            )}
        </div>
    );
};

export default PartenariatsTable;
