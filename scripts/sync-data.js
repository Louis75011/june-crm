/**
 * scripts/sync-data.js
 *
 * Synchronise les données live (server/data/*.json) vers les fichiers
 * statiques (src/data/initial*.js) utilisés par le build GitLab Pages.
 *
 * Usage :
 *   pnpm run sync          → sync manuelle
 *   pnpm run build         → sync automatique avant chaque build
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function syncFile(jsonPath, jsPath, exportName, comment) {
    try {
        const raw = readFileSync(jsonPath, 'utf-8');
        const data = JSON.parse(raw);
        const timestamp = new Date().toISOString();
        const content = [
            `// ${comment}`,
            `// ⚠️  Fichier généré automatiquement par scripts/sync-data.js`,
            `// ⚠️  NE PAS MODIFIER MANUELLEMENT — relancer \`pnpm run sync\``,
            `// Dernière sync : ${timestamp}`,
            ``,
            `export const ${exportName} = ${JSON.stringify(data, null, 4)};`,
            ``
        ].join('\n');

        mkdirSync(dirname(jsPath), { recursive: true });
        writeFileSync(jsPath, content, 'utf-8');

        const relJson = jsonPath.replace(ROOT, '').replace(/\\/g, '/');
        const relJs = jsPath.replace(ROOT, '').replace(/\\/g, '/');
        console.log(`  ✅  ${relJson} → ${relJs}  (${data.length} entrées)`);
    } catch (err) {
        console.error(`  ❌  Erreur sync ${jsonPath} : ${err.message}`);
        process.exit(1);
    }
}

console.log('\n🔄  Synchronisation données server → src/data...\n');

syncFile(
    join(ROOT, 'server/data/prospects.json'),
    join(ROOT, 'src/data/initialProspects.js'),
    'initialProspects',
    'Données prospects – générées depuis server/data/prospects.json'
);

syncFile(
    join(ROOT, 'server/data/partenariats.json'),
    join(ROOT, 'src/data/initialPartenariats.js'),
    'initialPartenariats',
    'Données partenariats – générées depuis server/data/partenariats.json'
);

console.log('\n✔   Sync terminée — données prêtes pour le build.\n');
