# June Lab CRM

CRM interne de **June Lab**, agence marketing spécialisée dans la promotion immobilière neuf en Île-de-France. Conçu pour centraliser la gestion commerciale de l'agence : suivi des clients promoteurs, programmes, campagnes digitales, prospects et templates email.

---

## Stack technique

| Couche          | Technologie                             |
| --------------- | --------------------------------------- |
| Frontend        | React 19 + Vite 7                       |
| Styles          | Sass (CSS Modules) + Tailwind CSS 3     |
| Backend         | Express 5 (API REST, fichiers JSON)     |
| Tests           | Jest 30 (35 tests)                      |
| Déploiement     | Vercel (frontend) / Express local (API) |
| Package manager | pnpm                                    |

---

## Lancement rapide

```bash
# 1. Installer les dépendances
pnpm install

# 2. Lancer le serveur API + le frontend en parallèle
pnpm run dev:full

# → Frontend : http://localhost:5173
# → API :      http://localhost:3001
```

**Commandes disponibles** :

| Commande        | Description                          |
| --------------- | ------------------------------------ |
| `pnpm dev`      | Frontend seul (Vite dev server)      |
| `pnpm server`   | API Express seule                    |
| `pnpm dev:full` | Les deux en parallèle (concurrently) |
| `pnpm build`    | Build production (dist/)             |
| `pnpm test`     | Lancer les 35 tests Jest             |
| `pnpm preview`  | Prévisualiser le build               |

---

## Architecture

```
├── server/               # Backend Express (port 3001)
│   ├── index.js          # Point d'entrée, routes API
│   ├── routes/
│   │   ├── crud.js       # Routeur CRUD générique (toutes entités)
│   │   └── settings.js   # Route paramètres utilisateur
│   ├── data/             # Données JSON persistantes
│   │   ├── clients.json
│   │   ├── programmes.json
│   │   ├── campagnes.json
│   │   ├── landingpages.json
│   │   ├── prospects.json
│   │   ├── templates.json
│   │   ├── statistiques.json
│   │   └── settings.json
│   └── utils/
│       └── fileUtils.js  # Lecture/écriture JSON, génération d'ID
│
├── src/                  # Frontend React
│   ├── App.jsx           # Composant principal (sidebar, toolbar, CRUD)
│   ├── App.scss          # Layout sidebar + toolbar + responsive
│   ├── index.scss        # Styles globaux, palette, dark mode, boutons
│   ├── main.jsx          # Point d'entrée React
│   ├── assets/           # Images (logo, photo profil)
│   ├── components/       # Composants réutilisables (CSS Modules)
│   │   ├── DataTable/    # Tableau générique avec tri, recherche, badges
│   │   ├── EntityForm/   # Formulaire CRUD générique (grille 2 colonnes)
│   │   ├── EntityViewModal/  # Modal détail lecture seule
│   │   ├── Modal/        # Modal de base (overlay, fermeture, wide)
│   │   ├── ConfirmModal/ # Confirmation de suppression
│   │   ├── Header/       # En-tête (salutation, avatar, boutons)
│   │   ├── SettingsModal/# Paramètres (maxChars, dark mode)
│   │   ├── InfoModal/    # Aide / raccourcis
│   │   ├── EmailPreview/ # Prévisualisation template email
│   │   └── Notification/ # Toast notifications
│   ├── data/
│   │   └── crmSchema.js  # Colonnes, champs formulaires, champs vue (7 entités)
│   ├── hooks/
│   │   ├── useEntity.js  # Hook CRUD générique (items, add, update, delete, import)
│   │   ├── useSettings.js# Hook paramètres (load, save via API)
│   │   └── useNotification.js
│   ├── services/
│   │   └── api.js        # Clients HTTP (fetchAPI, createEntityAPI, settingsAPI)
│   └── utils/
│       └── csvUtils.js   # Export/import CSV
│
├── landingpages/         # Sous-projets landing pages (React/Vite)
│   ├── Les-Travers-es---CAPS-Saint-Denis-main/
│   └── June-Lab---Immobilier-Neuf-main/
│
├── vercel.json           # Config déploiement Vercel
├── .env.example          # Variables d'environnement (Brevo, GA4, Meta, Clarity)
└── jest.config.js        # Config tests
```

---

## Fonctionnalités

### 7 entités CRM

| Entité              | Description                                                  | Données clés                                                             |
| ------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------ |
| **Clients**         | Promoteurs et bailleurs (CAPS, Rooj by GA, Nexity, Eiffage…) | Nom, type, contact, téléphone, statut, notes                             |
| **Programmes**      | Opérations immobilières (Les Traversées, Rooj Romainville…)  | Nom, ville, client, nombre de lots, statut                               |
| **Campagnes**       | Actions marketing digitales (Meta Ads, Google Ads, emailing) | Nom, type, client, programme, budget, dates, résultats                   |
| **Landing Pages**   | Pages d'atterrissage déployées                               | Nom, URL, programme, campagne, taux conversion                           |
| **Prospects**       | Contacts entrants + cibles commerciales (26 prospects)       | Nom, email, téléphone, source UTM, statut, priorité, transmission client |
| **Templates Email** | Modèles d'emails (confirmation, relance, newsletter)         | Nom, type, objet, expéditeur, contenu, statut                            |
| **Statistiques**    | Métriques de performance par campagne                        | Campagne, impressions, clics, CTR, prospects générés, coût/lead          |

### CRUD complet

Chaque entité dispose de :

- **Ajouter** : formulaire modal en grille 2 colonnes
- **Modifier** : formulaire pré-rempli
- **Voir** : modal détail lecture seule
- **Supprimer** : confirmation modale
- **Export CSV** : téléchargement des données en CSV
- **Import CSV** : import en masse depuis fichier

### Tableau de données (DataTable)

- Tri par colonne (clic sur en-tête, ascendant/descendant)
- Recherche textuelle globale en temps réel
- Badges colorés pour les statuts et priorités
- Résolution des relations entre entités (ID → nom via lookupMaps)
- Troncature configurable du texte (paramètre maxChars)
- Responsive (scroll horizontal sur mobile)

### Sidebar navigation

- 7 onglets avec compteurs de données en temps réel
- Liens directs vers les landing pages déployées (avec ↗)
- Repliable (icônes seules) pour gagner de l'espace
- Responsive : icônes seules sur tablette, barre horizontale sur mobile

### Dark mode

- Basculement via Paramètres > Mode sombre
- **Aperçu instantané** au toggle (sans besoin d'enregistrer)
- Annulation automatique si on ferme sans sauvegarder
- Couvre l'intégralité de l'interface : sidebar, header, toolbar, tableaux, modales, formulaires, search, badges, scrollbars
- Implémenté via CSS custom properties (`--bg-card`, `--text-primary`, `--border-color`…) + `:global(body.dark-mode)` dans chaque module SCSS

### Prévisualisation email

- Disponible sur l'onglet Templates via le bouton « Prévisualiser »
- Rendu visuel fidèle d'un email June Lab avec en-tête, coordonnées prospect, message, CTA et footer

### Paramètres

- Nombre max de caractères affichés dans les tableaux (slider 10–100)
- Toggle dark mode avec aperçu live
- Persistés côté serveur (settings.json)

### Aide (InfoModal)

- Guide des raccourcis et des actions disponibles

---

## API REST

Base URL : `http://localhost:3001/api`

### Routes CRUD (identiques pour chaque entité)

| Méthode  | Route                  | Description     |
| -------- | ---------------------- | --------------- |
| `GET`    | `/api/{entité}`        | Lister tout     |
| `GET`    | `/api/{entité}/:id`    | Détail par ID   |
| `POST`   | `/api/{entité}`        | Créer           |
| `PUT`    | `/api/{entité}/:id`    | Modifier        |
| `DELETE` | `/api/{entité}/:id`    | Supprimer       |
| `POST`   | `/api/{entité}/import` | Import en masse |

Entités : `clients`, `programmes`, `campagnes`, `landingpages`, `prospects`, `templates`, `statistiques`

### Routes spécifiques

| Méthode | Route           | Description                  |
| ------- | --------------- | ---------------------------- |
| `GET`   | `/api/settings` | Lire les paramètres          |
| `PUT`   | `/api/settings` | Mettre à jour les paramètres |
| `GET`   | `/api/health`   | Health check                 |

---

## Tests

35 tests Jest couvrant :

- **API CRUD** (7 entités × mock fetch) : getAll, create, update, delete
- **prospectsAPI** : vérification endpoint `/prospects`
- **Schema** : cohérence colonnes/formFields/viewFields (5 tests)
- **Navigation** : CRM_TABS présent, prospect dans les onglets
- **Recherche** : filtrage textuel (6 scénarios)
- **Intégrité JSON** : validité des 7 fichiers, champs `statutProspect` (pas `statutLead`), `prospectsGeneres`, IDs uniques

```bash
pnpm test
# → 35 passed, 0 failed
```

---

## Déploiement

### Vercel (frontend)

Le frontend est déployé automatiquement via Vercel à chaque push sur `main`. La config `vercel.json` gère le build Vite et le SPA routing.

> **Note** : Le backend Express n'est pas déployé sur Vercel (pas de serverless functions). En production, l'API doit tourner séparément (VPS, Railway, Render…) et l'URL être configurée dans `src/services/api.js` (`API_BASE`).

### Variables d'environnement

Voir `.env.example` pour la liste complète : Brevo (emailing transactionnel), GA4 (analytics), Meta Pixel, Microsoft Clarity, RGPD.

---

## Données embarquées

Le CRM est livré avec des données réalistes pré-remplies reflétant l'activité de June Lab :

- **5 clients** : CAPS, Rooj by GA, Plaine Commune Habitat, Nexity, Eiffage Immobilier
- **4 programmes** : Les Traversées (Saint-Denis), Rooj Romainville, Le Clos de Corbeville, Passage Foubert
- **4 campagnes** : Meta Ads CAPS, Relance CAPS, Google Ads Rooj, Emailing Rooj
- **3 landing pages** : Les Traversées, Immo Neuf, Rooj Romainville
- **26 prospects** : 7 leads entrants (formulaires landing pages) + 6 prospects chauds (réseau direct Alexia / Izïa / CAPS) + 6 prospects tièdes (écosystème Rooj / IDF) + 7 prospects stratégiques (grands promoteurs franciliens)
- **4 templates email** : Confirmation, Relance J+3, Newsletter, Relance J+7
- **4 statistiques** : Métriques des 4 campagnes

---

## Axes futurs

### Court terme (v2.1)

- **Brevo / emailing** : envoi automatique de confirmations et relances via l'API Brevo, déclenché depuis le CRM
- **GA4 Measurement Protocol** : tracking côté serveur des conversions (formulaire LP → prospect CRM)
- **Filtres avancés** : filtrage multi-critères (par statut, priorité, date, source UTM) en plus de la recherche texte
- **Dashboard / statistiques visuelles** : graphiques Chart.js (conversion funnel, répartition sources, évolution mensuelle)

### Moyen terme (v3)

- **Authentification** : login JWT multi-utilisateurs, rôles admin/commercial/lecture
- **Pipeline visuel (Kanban)** : vue drag & drop du tunnel de vente prospect → RDV → converti → signé
- **Notifications email** : alertes automatiques (nouveau prospect, relance en retard)
- **Historique / audit log** : traçabilité des actions (qui a modifié quoi, quand)
- **Relations enrichies** : liens cliquables entre entités (client → ses programmes → ses campagnes → ses prospects)

### Long terme

- **API externe + webhooks** : recevoir les prospects directement depuis les landing pages (webhook POST)
- **Multi-agence** : support de plusieurs agences/marques au sein du même CRM
- **RGPD avancé** : anonymisation automatique, portabilité des données, consentement granulaire
- **Mobile PWA** : version installable sur smartphone pour consultation terrain
- **IA / scoring prospect** : scoring automatique des prospects selon le comportement (temps sur page, source, budget) via modèle ML léger
