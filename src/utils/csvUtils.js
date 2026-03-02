// Export CSV
export const exportToCSV = (prospects) => {
    let csv = 'Nom Entreprise,Secteur,Ville,Contact,Téléphone,Email,Canal,Statut,Dernier Contact,Prochaine Action,Projet (délai)\n';
    prospects.forEach(p => {
        csv += `"${p.nomEntreprise}","${p.secteur}","${p.ville}","${p.contactCle}","${p.telephone}","${p.email}","${p.canal}","${p.statut}","${p.dernierContact}","${p.prochaiAction}","${p.projetEcheance || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `CRM-Prospects-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    URL.revokeObjectURL(url);
};

// Import CSV
export const parseCSV = (csvContent) => {
    const lines = csvContent.split('\n').slice(1);
    const prospects = [];

    lines.forEach(line => {
        if (!line.trim()) return;
        const cells = line.match(/"[^"]*"|[^,]*/g)?.map(c => c.replace(/"/g, '').trim()) || [];

        if (cells.length >= 10) {
            prospects.push({
                nomEntreprise: cells[0] || '',
                secteur: cells[1] || '',
                adresse: '',
                ville: cells[2] || '',
                telephone: cells[4] || '',
                email: cells[5] || '',
                website: '',
                contactCle: cells[3] || '',
                canal: cells[6] || '',
                dateContact: new Date().toISOString().split('T')[0],
                statut: cells[7] || 'À contacter',
                repondu: 'NON',
                dernierContact: cells[8] || '',
                prochaiAction: cells[9] || '',
                projetEcheance: cells[10] || '',
                notes: ''
            });
        }
    });

    return prospects;
};

// Créer un input file pour l'import
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
