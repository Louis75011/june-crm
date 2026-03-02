import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import styles from './ProspectsTable.module.scss';

const normalizeToBadgeKey = (value) => (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, '')
    .replace(/\s+/g, '-')
    .replace(/\+/g, '')
    .replace(/[^a-z0-9-]/g, '');

const getStatutBadgeClass = (statut) => {
    return `badge-${normalizeToBadgeKey(statut)}`;
};

const getRowClass = (statut) => {
    if (statut === 'Converti') return styles.rowConverti;
    if (statut === 'Refusé') return styles.rowRefuse;
    if (statut === 'Sans réponse') return styles.rowSansReponse;
    if (statut === 'Froid') return styles.rowFroid;
    return '';
};

// Ordre de priorité des statuts pour le tri
const statutOrder = {
    'À contacter': 1,
    'En cours': 2,
    "Courant de l'année": 3,
    'Relancé J+1': 4,
    'Relancé J+3': 5,
    'Relancé J+5': 6,
    'Relancé J+7': 7,
    'Froid': 8,
    'Converti': 9,
    'Refusé': 10,
    'Sans réponse': 11
};

const prioriteOrder = {
    'URGENTE': 1,
    'Très haute': 2,
    'Haute': 3,
    'Moyenne': 4,
    'Faible': 5
};

// ─── Persistance des préférences du tableau ─────────────────────────────────
const STORAGE_KEY = 'prospectsTable';
const loadPref = (key, fallback) => {
    try { const v = localStorage.getItem(`${STORAGE_KEY}_${key}`); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
};
const savePref = (key, value) => {
    try { localStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(value)); } catch { }
};

// Fonction pour tronquer le texte
const truncateText = (text, maxLength) => {
    if (!text) return '-';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '…';
};

const INITIAL_COL_WIDTHS = {
    actions: 95,
    nomEntreprise: 160,
    statut: 130,
    telephone: 145,
    email: 175,
    secteur: 90,
    adresse: 135,
    ville: 120,
    horaires: 110,
    canal: 90,
    website: 55,
    contactCle: 160,
    distGare: 80,
    dateContact: 100,
    dernierContact: 145,
    prochaiAction: 165,
    projetEcheance: 115,
    priorite: 90,
    notes: 210,
};

const INITIAL_COL_ORDER = Object.keys(INITIAL_COL_WIDTHS);

// Définition des colonnes : label affiché + clé de tri (null = pas de tri)
const COL_DEFS = {
    actions: { label: 'Actions', sortKey: null },
    nomEntreprise: { label: 'Entreprise', sortKey: 'nomEntreprise' },
    statut: { label: 'Statut', sortKey: 'statut' },
    telephone: { label: 'Téléphone', sortKey: 'telephone' },
    email: { label: 'Courriel', sortKey: 'email' },
    secteur: { label: 'Secteur', sortKey: 'secteur' },
    adresse: { label: 'Adresse', sortKey: 'adresse' },
    ville: { label: 'Ville', sortKey: 'ville' },
    horaires: { label: 'Horaires', sortKey: 'horaires' },
    canal: { label: 'Canal', sortKey: 'canal' },
    website: { label: 'Web', sortKey: 'website' },
    contactCle: { label: 'Contact', sortKey: 'contactCle' },
    distGare: { label: 'Dist. Gare', sortKey: null },
    dateContact: { label: 'Date Contact', sortKey: null },
    dernierContact: { label: 'Dernier Contact', sortKey: null },
    prochaiAction: { label: 'Prochaine Action', sortKey: null },
    projetEcheance: { label: 'Projet (délai)', sortKey: 'projetEcheance' },
    priorite: { label: 'Priorité', sortKey: 'priorite' },
    notes: { label: 'Notes', sortKey: null },
};

const ProspectsTable = ({ prospects, onEdit, onDelete, onView, searchFilter, maxChars = 30 }) => {
    const [sortConfig, setSortConfig] = useState(() => loadPref('sort', { key: 'statut', direction: 'asc' }));
    const [colWidths, setColWidths] = useState(() => ({ ...INITIAL_COL_WIDTHS, ...loadPref('widths', {}) }));
    const [colOrder, setColOrder] = useState(() => {
        const saved = loadPref('order', INITIAL_COL_ORDER);
        // Garder uniquement les clés connues, puis ajouter les nouvelles
        const valid = saved.filter(c => COL_DEFS[c]);
        const missing = INITIAL_COL_ORDER.filter(c => !valid.includes(c));
        return [...valid, ...missing];
    });
    const [dragOverCol, setDragOverCol] = useState(null);
    const resizeRef = useRef(null);
    const dragColRef = useRef(null);

    const startResize = useCallback((e, col) => {
        e.preventDefault();
        e.stopPropagation();
        const currentW = colWidths[col] ?? INITIAL_COL_WIDTHS[col] ?? 100;
        resizeRef.current = { col, startX: e.clientX, startW: currentW };

        const onMove = (ev) => {
            if (!resizeRef.current) return;
            const { col: rCol, startX, startW } = resizeRef.current;
            const newW = Math.max(40, startW + (ev.clientX - startX));
            setColWidths(prev => ({ ...prev, [rCol]: newW }));
        };
        const onUp = () => {
            // Sauvegarder la largeur finale dans localStorage au relâchement
            setColWidths(prev => { savePref('widths', prev); return prev; });
            resizeRef.current = null;
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    }, [colWidths]);

    // Remise à zéro d'une colonne (double-clic sur le handle)
    const resetCol = useCallback((e, col) => {
        e.preventDefault();
        e.stopPropagation();
        setColWidths(prev => {
            const next = { ...prev, [col]: INITIAL_COL_WIDTHS[col] };
            savePref('widths', next);
            return next;
        });
    }, []);

    // ─── Persistance ──────────────────────────────────────────────────────────
    useEffect(() => { savePref('sort', sortConfig); }, [sortConfig]);
    useEffect(() => { savePref('widths', colWidths); }, [colWidths]);
    useEffect(() => { savePref('order', colOrder); }, [colOrder]);

    // ─── Réorganisation des colonnes (drag & drop sur le header) ──────────────
    const handleDragStart = useCallback((e, col) => {
        // Annuler si un resize est en cours (mousedown sur handle déclenche dragstart sur le th parent)
        if (resizeRef.current) { e.preventDefault(); return; }
        dragColRef.current = col;
        e.dataTransfer.effectAllowed = 'move';
        // setData requis pour Firefox et autres navigateurs
        e.dataTransfer.setData('text/plain', col);
    }, []);
    const handleDragOver = useCallback((e, col) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (col !== dragColRef.current) setDragOverCol(col);
    }, []);
    const handleDragLeave = useCallback(() => setDragOverCol(null), []);
    const handleDrop = useCallback((e, col) => {
        e.preventDefault();
        setDragOverCol(null);
        const src = dragColRef.current;
        if (!src || src === col) return;
        dragColRef.current = null;
        setColOrder(prev => {
            const next = [...prev];
            const from = next.indexOf(src);
            const to = next.indexOf(col);
            if (from === -1 || to === -1) return prev;
            next.splice(from, 1);
            next.splice(to, 0, src);
            savePref('order', next); // sauvegarder immédiatement
            return next;
        });
    }, []);
    const handleDragEnd = useCallback(() => { dragColRef.current = null; setDragOverCol(null); }, []);

    const rh = (col) => (
        <div
            data-resize-handle="true"
            className={styles.resizeHandle}
            onMouseDown={(e) => startResize(e, col)}
            onDoubleClick={(e) => resetCol(e, col)}
            onClick={(e) => e.stopPropagation()}
            onDragStart={(e) => e.preventDefault()}
            draggable={false}
            title="Drag pour redimensionner · Double-clic pour réinitialiser"
        />
    );

    // Table de correspondance champ:alias → valeur du prospect
    const FIELD_MAP = {
        statut: p => (p.statut || '').toLowerCase(),
        nom: p => (p.nomEntreprise || '').toLowerCase(),
        entreprise: p => (p.nomEntreprise || '').toLowerCase(),
        ville: p => (p.ville || '').toLowerCase(),
        contact: p => (p.contactCle || '').toLowerCase(),
        secteur: p => (p.secteur || '').toLowerCase(),
        canal: p => (p.canal || '').toLowerCase(),
        priorite: p => (p.priorite || '').toLowerCase(),
        notes: p => `${p.notes || ''} ${p.notesSEO || ''}`.toLowerCase(),
        tel: p => (p.telephone || '').toLowerCase(),
        telephone: p => (p.telephone || '').toLowerCase(),
        email: p => (p.email || '').toLowerCase(),
        action: p => (p.prochaiAction || '').toLowerCase(),
        adresse: p => (p.adresse || '').toLowerCase(),
    };

    // Filtrage avancé :
    //  - champ:[a,b]     → OU ciblé sur un champ précis  ex: statut:[en cours, courant de l'année]
    //  - champ:"phrase"  → phrase exacte sur un champ    ex: ville:"étang-la-ville"
    //  - champ:mot       → mot sur un champ précis       ex: statut:froid
    //  - [a, b, c]       → OU global tous champs
    //  - "phrase"        → phrase exacte tous champs
    //  - -mot            → exclure un mot
    //  - mots libres     → ET : tous doivent matcher
    const filteredProspects = useMemo(() => {
        if (!searchFilter) return prospects;
        const raw = searchFilter.trim();

        const fieldTerms = []; // { field, opts[] } inclusion ciblée sur un champ
        const fieldExcludeTerms = []; // { field, opts[] } exclusion ciblée sur un champ
        const bracketGroups = []; // OR global
        const includeTerms = []; // ET global
        const excludeTerms = []; // exclusions globales

        let rem = raw;

        // 1a. -champ:[opt1, opt2]  → exclure si le champ contient l'une des options
        rem = rem.replace(/-(\w+):\[([^\]]*)\]/g, (_, fieldName, inner) => {
            const fn = fieldName.toLowerCase();
            if (FIELD_MAP[fn]) {
                const opts = inner.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
                if (opts.length) fieldExcludeTerms.push({ field: fn, opts });
            }
            return ' ';
        });

        // 1b. -champ:"phrase"  → exclure si le champ contient la phrase
        rem = rem.replace(/-(\w+):"([^"]*)"/g, (_, fieldName, phrase) => {
            const fn = fieldName.toLowerCase();
            const ph = phrase.trim().toLowerCase();
            if (FIELD_MAP[fn] && ph) fieldExcludeTerms.push({ field: fn, opts: [ph] });
            return ' ';
        });

        // 1c. -champ:mot  → exclure si le champ contient le mot
        rem = rem.replace(/-(\w+):(\S+)/g, (_, fieldName, word) => {
            const fn = fieldName.toLowerCase();
            const w = word.toLowerCase();
            if (FIELD_MAP[fn] && w) fieldExcludeTerms.push({ field: fn, opts: [w] });
            return ' ';
        });

        // 2. champ:[opt1, opt2]
        rem = rem.replace(/(\w+):\[([^\]]*)\]/g, (_, fieldName, inner) => {
            const fn = fieldName.toLowerCase();
            if (FIELD_MAP[fn]) {
                const opts = inner.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
                if (opts.length) fieldTerms.push({ field: fn, opts });
            }
            return ' ';
        });

        // 3. champ:"phrase exacte"
        rem = rem.replace(/(\w+):"([^"]*)"/g, (_, fieldName, phrase) => {
            const fn = fieldName.toLowerCase();
            const ph = phrase.trim().toLowerCase();
            if (FIELD_MAP[fn] && ph) fieldTerms.push({ field: fn, opts: [ph] });
            return ' ';
        });

        // 4. champ:mot
        rem = rem.replace(/(\w+):(\S+)/g, (_, fieldName, word) => {
            const fn = fieldName.toLowerCase();
            const w = word.toLowerCase();
            if (FIELD_MAP[fn] && w) fieldTerms.push({ field: fn, opts: [w] });
            return ' ';
        });

        // 5. Groupes [a, b, c] (OU global)
        rem = rem.replace(/\[([^\]]*)\]/g, (_, inner) => {
            const opts = inner.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
            if (opts.length) bracketGroups.push(opts);
            return ' ';
        });

        // 6. "phrases exactes" (global)
        rem = rem.replace(/"([^"]*)"/g, (_, phrase) => {
            const p = phrase.trim().toLowerCase();
            if (p) includeTerms.push(p);
            return ' ';
        });

        // 7. Mots restants : -mot = exclusion globale, mot = inclusion globale
        rem.split(/\s+/).filter(Boolean).forEach(word => {
            if (word.startsWith('-')) {
                const exc = word.substring(1).toLowerCase();
                if (exc) excludeTerms.push(exc);
            } else {
                includeTerms.push(word.toLowerCase());
            }
        });

        return prospects.filter(p => {
            const searchableText = [
                p.nomEntreprise, p.contactCle, p.ville, p.secteur, p.adresse,
                p.telephone, p.email, p.canal, p.statut, p.notes, p.notesSEO,
                p.dernierContact, p.prochaiAction, p.projetEcheance, p.horaires,
                p.distanceGare, p.priorite, p.cartesVisiteEndroits?.join(' ')
            ].filter(Boolean).join(' ').toLowerCase();

            // Exclusions ciblées par champ (si le champ contient une option → exclure)
            for (const ft of fieldExcludeTerms) {
                const fieldValue = FIELD_MAP[ft.field](p);
                if (ft.opts.some(opt => fieldValue.includes(opt))) return false;
            }
            // Filtres ciblés par champ (inclusion)
            for (const ft of fieldTerms) {
                const fieldValue = FIELD_MAP[ft.field](p);
                if (!ft.opts.some(opt => fieldValue.includes(opt))) return false;
            }
            // Groupes OR globaux
            if (!bracketGroups.every(group => group.some(opt => searchableText.includes(opt)))) return false;
            // Termes ET globaux
            if (!includeTerms.every(term => searchableText.includes(term))) return false;
            // Exclusions globales
            if (excludeTerms.some(term => searchableText.includes(term))) return false;
            return true;
        });
    }, [prospects, searchFilter]);

    // Tri des prospects
    const sortedProspects = useMemo(() => {
        const sorted = [...filteredProspects];
        sorted.sort((a, b) => {
            let aVal, bVal;

            if (sortConfig.key === 'statut') {
                aVal = statutOrder[a.statut] || 99;
                bVal = statutOrder[b.statut] || 99;
            } else if (sortConfig.key === 'priorite') {
                aVal = prioriteOrder[a.priorite] || 99;
                bVal = prioriteOrder[b.priorite] || 99;
            } else if (sortConfig.key === 'nomEntreprise' || sortConfig.key === 'contactCle' ||
                sortConfig.key === 'telephone' || sortConfig.key === 'email' ||
                sortConfig.key === 'secteur' || sortConfig.key === 'adresse' ||
                sortConfig.key === 'ville' || sortConfig.key === 'horaires' ||
                sortConfig.key === 'canal' || sortConfig.key === 'website' ||
                sortConfig.key === 'projetEcheance') {
                aVal = (a[sortConfig.key] || '').toLowerCase();
                bVal = (b[sortConfig.key] || '').toLowerCase();
            } else {
                aVal = a[sortConfig.key] || '';
                bVal = b[sortConfig.key] || '';
            }

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [filteredProspects, sortConfig]);

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

    // Largeur totale du tableau = somme des colonnes (pour que table-layout:fixed respecte les tailles exactes)
    const totalWidth = useMemo(() => colOrder.reduce((sum, col) => sum + (colWidths[col] ?? INITIAL_COL_WIDTHS[col] ?? 80), 0), [colOrder, colWidths]);

    const W = (col) => ({ width: colWidths[col], minWidth: 40 });

    // Rendu d'une cellule <td> selon la colonne
    const renderCell = (col, prospect) => {
        switch (col) {
            case 'actions':
                return (
                    <td key={col} className={styles.actionsCol}>
                        <div className={styles.actionButtons}>
                            <button className="btn btn-small btn-primary"
                                onClick={(e) => { e.stopPropagation(); onEdit(prospect); }} title="Éditer">✏️</button>
                            <button className="btn btn-small btn-danger"
                                onClick={(e) => { e.stopPropagation(); onDelete(prospect.id); }} title="Supprimer">🗑️</button>
                        </div>
                    </td>
                );
            case 'nomEntreprise':
                return <td key={col} title={prospect.nomEntreprise}><strong>{truncateText(prospect.nomEntreprise, maxChars)}</strong></td>;
            case 'statut':
                return (
                    <td key={col}>
                        <span className={`badge ${getStatutBadgeClass(prospect.statut)}`}>{prospect.statut}</span>
                    </td>
                );
            case 'telephone':
                return (
                    <td key={col}>
                        {prospect.telephone && <a href={`tel:${prospect.telephone}`} onClick={(e) => e.stopPropagation()}>{prospect.telephone}</a>}
                    </td>
                );
            case 'email':
                return (
                    <td key={col} title={prospect.email}>
                        {prospect.email && <a href={`mailto:${prospect.email}`} onClick={(e) => e.stopPropagation()}>{truncateText(prospect.email, maxChars)}</a>}
                    </td>
                );
            case 'secteur': return <td key={col} title={prospect.secteur}>{truncateText(prospect.secteur, maxChars)}</td>;
            case 'adresse': return <td key={col} title={prospect.adresse}>{truncateText(prospect.adresse, maxChars)}</td>;
            case 'ville': return <td key={col} title={prospect.ville}>{truncateText(prospect.ville, maxChars)}</td>;
            case 'horaires': return <td key={col} title={prospect.horaires}>{truncateText(prospect.horaires, maxChars)}</td>;
            case 'canal': return <td key={col}><span className={styles.canalBadge}>{prospect.canal}</span></td>;
            case 'website':
                return (
                    <td key={col}>
                        {prospect.website && (
                            <a href={prospect.website.startsWith('http') ? prospect.website : `https://${prospect.website}`}
                                target="_blank" rel="noopener noreferrer" title={prospect.website}
                                onClick={(e) => e.stopPropagation()}>🔗</a>
                        )}
                    </td>
                );
            case 'contactCle': return <td key={col} title={prospect.contactCle}>{truncateText(prospect.contactCle, maxChars)}</td>;
            case 'distGare': return <td key={col}>{truncateText(prospect.distanceGare, maxChars)}</td>;
            case 'dateContact': return <td key={col}>{prospect.dateContact || '-'}</td>;
            case 'dernierContact': return <td key={col} title={prospect.dernierContact}>{truncateText(prospect.dernierContact, maxChars)}</td>;
            case 'prochaiAction': return <td key={col} title={prospect.prochaiAction}>{truncateText(prospect.prochaiAction, maxChars)}</td>;
            case 'projetEcheance': return <td key={col} title={prospect.projetEcheance}>{truncateText(prospect.projetEcheance, maxChars)}</td>;
            case 'priorite': return <td key={col}>{prospect.priorite || '-'}</td>;
            case 'notes':
                return (
                    <td key={col} className={styles.notesCol}>
                        <div className={styles.notesContent} title={prospect.notes}>
                            {truncateText(prospect.notes, Math.round(maxChars * 1.5))}
                        </div>
                    </td>
                );
            default:
                return <td key={col}>-</td>;
        }
    };

    return (
        <div className={styles.tableWrapper}>
            <table className={`${styles.table} ${styles.tableFixed}`} style={{ width: totalWidth }}>
                <colgroup>
                    {colOrder.map(col => (
                        <col key={col} style={{ width: colWidths[col] }} />
                    ))}
                </colgroup>
                <thead>
                    <tr>
                        {colOrder.map(col => {
                            const def = COL_DEFS[col];
                            if (!def) return null; // clé obsolète ignorée
                            const thClass = [
                                def.sortKey ? styles.sortable : '',
                                col === 'actions' ? styles.actionsCol : '',
                                dragOverCol === col ? styles.dragOver : '',
                            ].filter(Boolean).join(' ');
                            return (
                                <th
                                    key={col}
                                    className={thClass}
                                    style={W(col)}
                                    onClick={def.sortKey ? () => handleSort(def.sortKey) : undefined}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, col)}
                                    onDragOver={(e) => handleDragOver(e, col)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, col)}
                                    onDragEnd={handleDragEnd}
                                    title={col !== 'actions' ? 'Glisser pour réordonner · Cliquer pour trier' : undefined}
                                >
                                    {def.sortKey ? <>{def.label} {getSortIcon(def.sortKey)}</> : def.label}
                                    {rh(col)}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {sortedProspects.map(prospect => (
                        <tr
                            key={prospect.id}
                            className={`${styles.clickableRow} ${getRowClass(prospect.statut)}`}
                            onClick={(e) => {
                                if (e.ctrlKey || e.metaKey) { onEdit(prospect); return; }
                                onView(prospect);
                            }}
                            title="Cliquez pour voir la fiche"
                        >
                            {colOrder.map(col => renderCell(col, prospect))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {sortedProspects.length === 0 && (
                <div className={styles.noResults}>
                    Aucun prospect trouvé{searchFilter ? ` pour "${searchFilter}"` : ''}
                </div>
            )}
        </div>
    );
};

export default ProspectsTable;
