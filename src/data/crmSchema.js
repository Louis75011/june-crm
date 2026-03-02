/**
 * Définition des champs pour chaque entité June Lab CRM
 * Utilisé par DataTable (columns), EntityForm (fields), EntityViewModal (fields)
 */

// ==================== CLIENTS ====================
export const clientColumns = [
    { key: 'nom', label: 'Nom du client', width: '180px' },
    {
        key: 'type', label: 'Type', type: 'badge', colorMap: {
            'Promoteur': '#3b82f6', 'Coopérative': '#8b5cf6', 'Bailleur social': '#10b981',
            'Aménageur': '#f59e0b', 'Autre': '#6b7280'
        }
    },
    { key: 'contactPrincipal', label: 'Contact principal' },
    { key: 'emailContact', label: 'Email' },
    { key: 'telephoneContact', label: 'Téléphone' },
    { key: 'ville', label: 'Ville' },
    {
        key: 'statut', label: 'Statut', type: 'badge', colorMap: {
            'Actif': '#10b981', 'Inactif': '#6b7280', 'Prospect': '#f59e0b'
        }
    }
];

export const clientFormFields = [
    { key: 'nom', label: 'Nom du client', type: 'text', required: true, placeholder: 'ex: CAPS, Rooj by GA' },
    { key: 'type', label: 'Type', type: 'select', required: true, options: ['Promoteur', 'Coopérative', 'Bailleur social', 'Aménageur', 'Autre'] },
    { key: 'contactPrincipal', label: 'Contact principal', type: 'text', placeholder: 'Nom et fonction' },
    { key: 'emailContact', label: 'Email contact', type: 'email' },
    { key: 'telephoneContact', label: 'Téléphone contact', type: 'tel' },
    { key: 'adresseSiege', label: 'Adresse siège', type: 'text' },
    { key: 'ville', label: 'Ville', type: 'text' },
    { key: 'siteWeb', label: 'Site web', type: 'url', placeholder: 'https://' },
    { key: 'statut', label: 'Statut', type: 'select', options: ['Actif', 'Inactif', 'Prospect'] },
    { key: 'notes', label: 'Notes', type: 'textarea' }
];

export const clientViewFields = [
    { key: 'nom', label: 'Nom du client' },
    { key: 'type', label: 'Type' },
    { key: 'contactPrincipal', label: 'Contact principal' },
    { key: 'emailContact', label: 'Email contact' },
    { key: 'telephoneContact', label: 'Téléphone contact' },
    { key: 'adresseSiege', label: 'Adresse siège' },
    { key: 'ville', label: 'Ville' },
    { key: 'siteWeb', label: 'Site web', type: 'url' },
    { key: 'statut', label: 'Statut' },
    { key: 'notes', label: 'Notes' }
];

// ==================== PROGRAMMES ====================
export const programmeColumns = [
    { key: 'nom', label: 'Programme', width: '180px' },
    { key: 'ville', label: 'Ville' },
    {
        key: 'typeProgramme', label: 'Type', type: 'badge', colorMap: {
            'Neuf': '#3b82f6', 'BRS': '#8b5cf6', 'Rénovation': '#f59e0b', 'Mixte': '#10b981', 'Autre': '#6b7280'
        }
    },
    { key: 'nombreLots', label: 'Lots' },
    { key: 'prixAPartirDe', label: 'Prix min', type: 'currency' },
    {
        key: 'statut', label: 'Statut', type: 'badge', colorMap: {
            'En préparation': '#f59e0b', 'Commercialisation': '#10b981',
            'En cours de construction': '#3b82f6', 'Livré': '#6b7280'
        }
    }
];

export const programmeFormFields = [
    { key: 'nom', label: 'Nom du programme', type: 'text', required: true, placeholder: 'ex: Les Traversées' },
    { key: 'clientId', label: 'Client', type: 'number', required: true },
    { key: 'ville', label: 'Ville du programme', type: 'text' },
    { key: 'adresse', label: 'Adresse du programme', type: 'text' },
    { key: 'typeProgramme', label: 'Type de programme', type: 'select', options: ['Neuf', 'BRS', 'Rénovation', 'Mixte', 'Autre'] },
    { key: 'nombreLots', label: 'Nombre de lots', type: 'number' },
    { key: 'prixAPartirDe', label: 'Prix à partir de (€)', type: 'currency' },
    { key: 'dateLancementCommercial', label: 'Date lancement commercial', type: 'date' },
    { key: 'dateLivraisonPrevisionnelle', label: 'Date livraison prévisionnelle', type: 'date' },
    { key: 'statut', label: 'Statut', type: 'select', options: ['En préparation', 'Commercialisation', 'En cours de construction', 'Livré'] },
    { key: 'charteCouleur', label: 'Charte couleur (hex)', type: 'text', placeholder: '#1A365D' },
    { key: 'briefCreatif', label: 'Brief créatif', type: 'textarea' }
];

export const programmeViewFields = [
    { key: 'nom', label: 'Nom du programme' },
    { key: 'clientId', label: 'Client' },
    { key: 'ville', label: 'Ville' },
    { key: 'adresse', label: 'Adresse' },
    { key: 'typeProgramme', label: 'Type de programme' },
    { key: 'nombreLots', label: 'Nombre de lots' },
    { key: 'prixAPartirDe', label: 'Prix à partir de', type: 'currency' },
    { key: 'dateLancementCommercial', label: 'Date lancement', type: 'date' },
    { key: 'dateLivraisonPrevisionnelle', label: 'Date livraison', type: 'date' },
    { key: 'statut', label: 'Statut' },
    { key: 'charteCouleur', label: 'Charte couleur' },
    { key: 'briefCreatif', label: 'Brief créatif' }
];

// ==================== CAMPAGNES ====================
export const campagneColumns = [
    { key: 'nom', label: 'Campagne', width: '200px' },
    {
        key: 'typeCampagne', label: 'Type', type: 'badge', colorMap: {
            'Lancement': '#3b82f6', 'Relance': '#f59e0b', 'Événement': '#8b5cf6'
        }
    },
    {
        key: 'canalSource', label: 'Canal', type: 'badge', colorMap: {
            'Meta Ads': '#3b82f6', 'Google Ads': '#10b981', 'Newsletter': '#f59e0b'
        }
    },
    { key: 'budget', label: 'Budget', type: 'currency' },
    {
        key: 'statut', label: 'Statut', type: 'badge', colorMap: {
            'Brouillon': '#6b7280', 'Active': '#10b981', 'En pause': '#f59e0b',
            'Terminée': '#3b82f6', 'Annulée': '#ef4444'
        }
    },
    { key: 'impressions', label: 'Impressions' },
    { key: 'clics', label: 'Clics' }
];

export const campagneFormFields = [
    { key: 'nom', label: 'Nom de la campagne', type: 'text', required: true, placeholder: 'caps_lestraversees_lancement_v1' },
    { key: 'programmeId', label: 'Programme', type: 'number', required: true },
    { key: 'typeCampagne', label: 'Type de campagne', type: 'select', options: ['Lancement', 'Relance', 'Événement'] },
    { key: 'canalSource', label: 'Canal / Source', type: 'select', options: ['Meta Ads', 'Google Ads', 'Newsletter', 'Événement'] },
    { key: 'utmSource', label: 'utm_source', type: 'text' },
    { key: 'utmMedium', label: 'utm_medium', type: 'text' },
    { key: 'utmCampaign', label: 'utm_campaign', type: 'text' },
    { key: 'utmContent', label: 'utm_content', type: 'text' },
    { key: 'budget', label: 'Budget (€)', type: 'currency' },
    { key: 'dateDebut', label: 'Date début', type: 'date' },
    { key: 'dateFin', label: 'Date fin', type: 'date' },
    { key: 'statut', label: 'Statut', type: 'select', options: ['Brouillon', 'Active', 'En pause', 'Terminée', 'Annulée'] },
    { key: 'landingPageId', label: 'Landing page', type: 'number' },
    { key: 'impressions', label: 'Impressions', type: 'number' },
    { key: 'clics', label: 'Clics', type: 'number' },
    { key: 'notesPerformance', label: 'Notes performance', type: 'textarea' }
];

export const campagneViewFields = [
    { key: 'nom', label: 'Nom de la campagne' },
    { key: 'programmeId', label: 'Programme' },
    { key: 'typeCampagne', label: 'Type' },
    { key: 'canalSource', label: 'Canal / Source' },
    { key: 'utmSource', label: 'utm_source' },
    { key: 'utmMedium', label: 'utm_medium' },
    { key: 'utmCampaign', label: 'utm_campaign' },
    { key: 'utmContent', label: 'utm_content' },
    { key: 'budget', label: 'Budget', type: 'currency' },
    { key: 'dateDebut', label: 'Date début', type: 'date' },
    { key: 'dateFin', label: 'Date fin', type: 'date' },
    { key: 'statut', label: 'Statut' },
    { key: 'impressions', label: 'Impressions' },
    { key: 'clics', label: 'Clics' },
    { key: 'notesPerformance', label: 'Notes performance' }
];

// ==================== LANDING PAGES ====================
export const landingpageColumns = [
    { key: 'nom', label: 'Landing page', width: '200px' },
    { key: 'url', label: 'URL', type: 'url' },
    { key: 'typePage', label: 'Type' },
    {
        key: 'statut', label: 'Statut', type: 'badge', colorMap: {
            'Maquette': '#6b7280', 'Dev': '#f59e0b', 'Préprod': '#3b82f6',
            'Live': '#10b981', 'Archivée': '#9ca3af'
        }
    },
    { key: 'sessions', label: 'Sessions' },
    { key: 'formulaireActif', label: 'Form.', type: 'boolean' }
];

export const landingpageFormFields = [
    { key: 'nom', label: 'Nom de la page', type: 'text', required: true, placeholder: 'LP Les Traversées – Lancement V1' },
    { key: 'programmeId', label: 'Programme', type: 'number', required: true },
    { key: 'url', label: 'URL de la page', type: 'url', placeholder: 'https://' },
    { key: 'typePage', label: 'Type de page', type: 'select', options: ['Mini landing', 'Landing complète'] },
    { key: 'statut', label: 'Statut', type: 'select', options: ['Maquette', 'Dev', 'Préprod', 'Live', 'Archivée'] },
    { key: 'dateMiseEnLigne', label: 'Date mise en ligne', type: 'date' },
    { key: 'ga4Installe', label: 'GA4 installé', type: 'checkbox' },
    { key: 'metaPixelInstalle', label: 'Meta Pixel installé', type: 'checkbox' },
    { key: 'clarityInstalle', label: 'Clarity installé', type: 'checkbox' },
    { key: 'utmsConfigures', label: 'UTMs configurés', type: 'checkbox' },
    { key: 'formulaireActif', label: 'Formulaire actif', type: 'checkbox' },
    { key: 'sessions', label: 'Sessions (depuis GA4)', type: 'number' },
    { key: 'lienMaquetteFigma', label: 'Lien maquette Figma', type: 'url' },
    { key: 'notes', label: 'Notes', type: 'textarea' }
];

export const landingpageViewFields = [
    { key: 'nom', label: 'Nom de la page' },
    { key: 'programmeId', label: 'Programme' },
    { key: 'url', label: 'URL', type: 'url' },
    { key: 'typePage', label: 'Type de page' },
    { key: 'statut', label: 'Statut' },
    { key: 'dateMiseEnLigne', label: 'Date mise en ligne', type: 'date' },
    { key: 'ga4Installe', label: 'GA4', type: 'boolean' },
    { key: 'metaPixelInstalle', label: 'Meta Pixel', type: 'boolean' },
    { key: 'clarityInstalle', label: 'Clarity', type: 'boolean' },
    { key: 'utmsConfigures', label: 'UTMs', type: 'boolean' },
    { key: 'formulaireActif', label: 'Formulaire actif', type: 'boolean' },
    { key: 'sessions', label: 'Sessions' },
    { key: 'lienMaquetteFigma', label: 'Lien Figma', type: 'url' },
    { key: 'notes', label: 'Notes' }
];

// ==================== LEADS ====================
export const prospectColumns = [
    { key: 'nomComplet', label: 'Nom', width: '150px' },
    { key: 'email', label: 'Email' },
    { key: 'telephone', label: 'Téléphone' },
    { key: 'typologieRecherchee', label: 'Typo' },
    { key: 'utmSource', label: 'Source' },
    { key: 'dateSoumission', label: 'Date', type: 'date' },
    {
        key: 'statutProspect', label: 'Statut', type: 'badge', colorMap: {
            'Nouveau': '#3b82f6', 'À contacter': '#f59e0b', 'Contacté': '#8b5cf6',
            'RDV': '#10b981', 'Converti': '#059669'
        }
    },
    {
        key: 'priorite', label: 'Priorité', type: 'badge', colorMap: {
            'Haute': '#ef4444', 'Moyenne': '#f59e0b', 'Faible': '#6b7280'
        }
    },
    { key: 'transmisClient', label: 'Transmis', type: 'boolean' }
];

export const prospectFormFields = [
    { key: 'nomComplet', label: 'Nom complet', type: 'text', required: true },
    { key: 'prenom', label: 'Prénom', type: 'text' },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'telephone', label: 'Téléphone', type: 'tel' },
    { key: 'villeResidence', label: 'Ville de résidence', type: 'text' },
    { key: 'typologieRecherchee', label: 'Typologie recherchée', type: 'select', options: ['Studio', '2P', '3P', '4P', '5P', 'Maison', 'Autre'] },
    { key: 'programmeId', label: 'Programme', type: 'number', required: true },
    { key: 'landingPageSourceId', label: 'Landing page source', type: 'number' },
    { key: 'campagneSourceId', label: 'Campagne source', type: 'number' },
    { key: 'utmSource', label: 'utm_source', type: 'text' },
    { key: 'utmMedium', label: 'utm_medium', type: 'text' },
    { key: 'utmCampaign', label: 'utm_campaign', type: 'text' },
    { key: 'utmContent', label: 'utm_content', type: 'text' },
    { key: 'statutProspect', label: 'Statut prospect', type: 'select', options: ['Nouveau', 'À contacter', 'Contacté', 'RDV', 'Converti'] },
    { key: 'priorite', label: 'Priorité', type: 'select', options: ['Haute', 'Moyenne', 'Faible'] },
    { key: 'transmisClient', label: 'Transmis au client', type: 'checkbox' },
    { key: 'dateTransmissionClient', label: 'Date transmission client', type: 'date' },
    { key: 'consentementRGPD', label: 'Consentement RGPD', type: 'checkbox' },
    { key: 'notes', label: 'Notes', type: 'textarea' }
];

export const prospectViewFields = [
    { key: 'nomComplet', label: 'Nom complet' },
    { key: 'prenom', label: 'Prénom' },
    { key: 'email', label: 'Email' },
    { key: 'telephone', label: 'Téléphone' },
    { key: 'villeResidence', label: 'Ville' },
    { key: 'typologieRecherchee', label: 'Typologie' },
    { key: 'programmeId', label: 'Programme' },
    { key: 'utmSource', label: 'utm_source' },
    { key: 'utmMedium', label: 'utm_medium' },
    { key: 'utmCampaign', label: 'utm_campaign' },
    { key: 'dateSoumission', label: 'Date soumission', type: 'date' },
    { key: 'statutProspect', label: 'Statut prospect' },
    { key: 'priorite', label: 'Priorité' },
    { key: 'transmisClient', label: 'Transmis au client', type: 'boolean' },
    { key: 'dateTransmissionClient', label: 'Date transmission', type: 'date' },
    { key: 'consentementRGPD', label: 'Consentement RGPD', type: 'boolean' },
    { key: 'notes', label: 'Notes' }
];

// ==================== TEMPLATES EMAIL ====================
export const templateColumns = [
    { key: 'nom', label: 'Template', width: '200px' },
    {
        key: 'typeTemplate', label: 'Type', type: 'badge', colorMap: {
            'Confirmation': '#3b82f6', 'Relance': '#f59e0b', 'Newsletter': '#8b5cf6'
        }
    },
    {
        key: 'statut', label: 'Statut', type: 'badge', colorMap: {
            'Brouillon': '#6b7280', 'En validation': '#f59e0b', 'Validé': '#10b981', 'Livré': '#3b82f6'
        }
    },
    { key: 'espCible', label: 'ESP' },
    { key: 'compatibleMobile', label: 'Mobile', type: 'boolean' },
    { key: 'testeLitmus', label: 'Litmus', type: 'boolean' }
];

export const templateFormFields = [
    { key: 'nom', label: 'Nom du template', type: 'text', required: true, placeholder: 'Confirmation inscription – Les Traversées' },
    { key: 'programmeId', label: 'Programme', type: 'number', required: true },
    { key: 'typeTemplate', label: 'Type de template', type: 'select', options: ['Confirmation', 'Relance', 'Newsletter'] },
    { key: 'statut', label: 'Statut', type: 'select', options: ['Brouillon', 'En validation', 'Validé', 'Livré'] },
    { key: 'dateLivraison', label: 'Date livraison', type: 'date' },
    { key: 'espCible', label: 'ESP cible', type: 'select', options: ['Brevo', 'Mailchimp', 'HubSpot'] },
    { key: 'compatibleMobile', label: 'Compatible mobile', type: 'checkbox' },
    { key: 'testeLitmus', label: 'Testé Litmus', type: 'checkbox' },
    { key: 'notes', label: 'Notes', type: 'textarea' }
];

export const templateViewFields = [
    { key: 'nom', label: 'Nom du template' },
    { key: 'programmeId', label: 'Programme' },
    { key: 'typeTemplate', label: 'Type' },
    { key: 'statut', label: 'Statut' },
    { key: 'dateLivraison', label: 'Date livraison', type: 'date' },
    { key: 'espCible', label: 'ESP cible' },
    { key: 'compatibleMobile', label: 'Compatible mobile', type: 'boolean' },
    { key: 'testeLitmus', label: 'Testé Litmus', type: 'boolean' },
    { key: 'notes', label: 'Notes' }
];

// ==================== STATISTIQUES CAMPAGNES ====================
export const statistiqueColumns = [
    { key: 'campagneId', label: 'Campagne' },
    { key: 'periode', label: 'Période' },
    { key: 'impressions', label: 'Impressions' },
    { key: 'clics', label: 'Clics' },
    { key: 'sessionsLanding', label: 'Sessions LP' },
    { key: 'leadsGeneres', label: 'Leads' },
    { key: 'coutTotal', label: 'Coût total', type: 'currency' },
    { key: 'leadsConvertis', label: 'Convertis' },
    {
        key: 'sourceDonnees', label: 'Source', type: 'badge', colorMap: {
            'GA4': '#3b82f6', 'Meta': '#8b5cf6', 'Google Ads': '#10b981', 'Manuel': '#6b7280'
        }
    }
];

export const statistiqueFormFields = [
    { key: 'campagneId', label: 'Campagne', type: 'number', required: true },
    { key: 'periode', label: 'Période', type: 'text', placeholder: 'ex: Mars 2026' },
    { key: 'impressions', label: 'Impressions', type: 'number' },
    { key: 'clics', label: 'Clics', type: 'number' },
    { key: 'sessionsLanding', label: 'Sessions landing', type: 'number' },
    { key: 'leadsGeneres', label: 'Leads générés', type: 'number' },
    { key: 'coutTotal', label: 'Coût total (€)', type: 'currency' },
    { key: 'leadsTransmisClient', label: 'Leads transmis client', type: 'number' },
    { key: 'leadsConvertis', label: 'Leads convertis', type: 'number' },
    { key: 'sourceDonnees', label: 'Source de données', type: 'select', options: ['GA4', 'Meta', 'Google Ads', 'Manuel'] },
    { key: 'dateMiseAJour', label: 'Date mise à jour', type: 'date' }
];

export const statistiqueViewFields = [
    { key: 'campagneId', label: 'Campagne' },
    { key: 'periode', label: 'Période' },
    { key: 'impressions', label: 'Impressions' },
    { key: 'clics', label: 'Clics' },
    { key: 'sessionsLanding', label: 'Sessions landing' },
    { key: 'leadsGeneres', label: 'Leads générés' },
    { key: 'coutTotal', label: 'Coût total', type: 'currency' },
    { key: 'leadsTransmisClient', label: 'Leads transmis client' },
    { key: 'leadsConvertis', label: 'Leads convertis' },
    { key: 'sourceDonnees', label: 'Source' },
    { key: 'dateMiseAJour', label: 'Date mise à jour', type: 'date' }
];

// ==================== CONFIG ONGLETS CRM ====================
export const CRM_TABS = [
    { key: 'clients', icon: '🏢', label: 'Clients', entityName: 'client' },
    { key: 'programmes', icon: '🏗️', label: 'Programmes', entityName: 'programme' },
    { key: 'campagnes', icon: '🎯', label: 'Campagnes', entityName: 'campagne' },
    { key: 'landingpages', icon: '🌐', label: 'Landing Pages', entityName: 'landing page' },
    { key: 'prospects', icon: '👤', label: 'Prospects', entityName: 'prospect' },
    { key: 'templates', icon: '✉️', label: 'Templates Email', entityName: 'template' },
    { key: 'statistiques', icon: '📊', label: 'Statistiques', entityName: 'statistique' }
];
