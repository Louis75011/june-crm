/**
 * Export CSV générique pour les entités June Lab CRM
 * @param {Array} items - Données à exporter
 * @param {Array} columns - Colonnes [{ key, label }]
 * @param {string} filename - Nom du fichier (sans extension)
 */
export const exportToCSV = (items, columns, filename = 'export') => {
    if (!items || items.length === 0) return;

    const headers = columns.map(c => c.label);
    const rows = items.map(item =>
        columns.map(c => {
            const val = item[c.key];
            if (val === null || val === undefined) return '';
            if (typeof val === 'boolean') return val ? 'Oui' : 'Non';
            return String(val).replace(/"/g, '""');
        })
    );

    let csv = headers.map(h => `"${h}"`).join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    URL.revokeObjectURL(url);
};

/**
 * Import CSV générique
 * @param {string} csvContent - Contenu CSV brut
 * @param {Array} columns - Colonnes attendues [{ key, label, type }]
 * @returns {Array} items parsés
 */
export const parseCSV = (csvContent, columns) => {
    const lines = csvContent.split('\n').slice(1); // skip header
    const items = [];

    lines.forEach(line => {
        if (!line.trim()) return;
        const cells = line.match(/"[^"]*"|[^,]*/g)?.map(c => c.replace(/^"|"$/g, '').replace(/""/g, '"').trim()) || [];

        if (cells.length >= columns.length) {
            const item = {};
            columns.forEach((col, idx) => {
                let val = cells[idx] || '';
                if (col.type === 'boolean' || col.type === 'checkbox') {
                    val = val.toLowerCase() === 'oui' || val === 'true' || val === '1';
                } else if (col.type === 'number' || col.type === 'currency') {
                    val = val ? Number(val) : null;
                }
                item[col.key] = val;
            });
            items.push(item);
        }
    });

    return items;
};

/**
 * Crée un input file pour l'import CSV
 */
export const triggerFileImport = (callback) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = e => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = event => {
            const content = event.target?.result;
            if (typeof content === 'string') {
                callback(content);
            }
        };
        reader.readAsText(file);
    };
    input.click();
};
