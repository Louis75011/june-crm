// Re-export des prospects depuis le fichier dédié
export { initialProspects } from './initialProspects';

// Options pour les formulaires
export const secteurOptions = [
    { value: "", label: "-- Sélectionner --" },
    { value: "Collectivité", label: "Collectivité / Mairie" },
    { value: "Boulangerie", label: "Boulangerie" },
    { value: "Restaurant", label: "Restaurant / Café" },
    { value: "Commerce", label: "Commerce" },
    { value: "Grande Distribution", label: "Grande distribution" },
    { value: "Caviste", label: "Caviste / Vins" },
    { value: "Artisan", label: "Artisan / BTP" },
    { value: "Pharmacie", label: "Pharmacie / Santé" },
    { value: "Coiffure", label: "Coiffure / Beauté" },
    { value: "Fleuriste", label: "Fleuriste" },
    { value: "Immobilier", label: "Immobilier" },
    { value: "Finance", label: "Finance" },
    { value: "Art", label: "Art" },
    { value: "Médiation", label: "Médiation" },
    { value: "Église", label: "Église / Paroisse" },
    { value: "Informatique", label: "Informatique / Service" },
    { value: "HoReCa", label: "HoReCa (Hôtel/Resto/Café)" },
    { value: "Autre", label: "Autre" }
];

export const canalOptions = [
    { value: "", label: "-- Sélectionner --" },
    { value: "Web", label: "Web" },
    { value: "Meta", label: "Meta business" },
    { value: "LinkedIn", label: "LinkedIn" },
    { value: "Terrain", label: "Visite terrain" },
    { value: "Boutique", label: "Visite boutique" },
    { value: "Téléphone", label: "Téléphone" },
    { value: "Email", label: "Email direct" },
    { value: "Connaissance", label: "Connaissance" }
];

export const engagementOptions = [
    { value: "", label: "-- Sélectionner --" },
    { value: "Premier contact", label: "Premier contact" },
    { value: "Intéressé", label: "Intéressé" },
    { value: "Moyennement intéressé", label: "Moyennement intéressé" },
    { value: "Non intéressé", label: "Non intéressé" },
    { value: "Accord établi", label: "Accord établi" }
];

export const statutOptions = [
    { value: "À contacter", label: "À contacter" },
    { value: "En cours", label: "En cours" },
    { value: "Courant de l'année", label: "Courant de l'année" },
    { value: "Relancé J+1", label: "Relancé J+1" },
    { value: "Relancé J+3", label: "Relancé J+3" },
    { value: "Relancé J+5", label: "Relancé J+5" },
    { value: "Relancé J+7", label: "Relancé J+7" },
    { value: "Froid", label: "Froid" },
    { value: "Converti", label: "Converti" },
    { value: "Refusé", label: "Refusé" },
    { value: "Sans réponse", label: "Sans réponse" }
];

// Protocole de relance
export const relanceProtocol = [
    {
        jour: "J+0",
        action: "🎯 1er Contact",
        moyen: "Selon canal d'origine",
        objet: "Présentation, proposition de valeur"
    },
    {
        jour: "J+1",
        action: "💌 Relance Légère",
        moyen: "Mail court ou SMS",
        objet: "« Suite à mon message hier... »"
    },
    {
        jour: "J+3",
        action: "☎️ Relance Contexte",
        moyen: "Appel téléphonique",
        objet: "Conversation directe, lever objections"
    },
    {
        jour: "J+5",
        action: "📎 Relance Professionnelle",
        moyen: "Mail + Ressource (PDF, lien)",
        objet: "Document utile, preuve sociale"
    },
    {
        jour: "J+7",
        action: "🤝 Dernier Contact",
        moyen: "Appel ou visite terrain",
        objet: "Clarifier intérêt, proposer RDV"
    }
];

// Stratégies digitales
export const strategies = [
    {
        icon: "🎨",
        title: "Meta Business Suite (Facebook / Instagram)",
        cible: "Restaurateurs, commerçants, artisans locaux dans rayon 5-10 km",
        tactics: [
            "Audiences géolocalisées : créer segments par zone géographique",
            "Lead Magnets : « Guide 5 tendances 2026 pour votre commerce »",
            "CTA primaire : « Réserver appel gratuit » avec formulaire pré-rempli",
            "Budget conseillé : 300–500 €/mois pour tests initiaux",
            "Fréquence : 3–5 annonces par semaine, A/B testing"
        ]
    },
    {
        icon: "💼",
        title: "LinkedIn Sales Navigator",
        cible: "Responsables marketing, gérants, propriétaires PME",
        tactics: [
            "Filtres : par secteur (HoReCa, commerce), taille entreprise, localité",
            "Message personnalisé : citer un détail du profil/entreprise",
            "Séquence : InMail → appel → mail officiel en 48h",
            "Taux réponse attendu : 15–25% pour InMail qualifiés",
            "Fréquence : 5–10 messages par jour (ne pas spammer)"
        ]
    },
    {
        icon: "🌐",
        title: "Campagnes Google Ads (Search + Display)",
        cible: "Prospects cherchant activement vos solutions",
        tactics: [
            "Mots-clés : « [secteur] + [ville] + [votre solution] »",
            "Landing page : valeur claire en haut, formulaire court",
            "Display : retargeting des visiteurs site non convertis",
            "Budget initial : 500–800 €/mois pour optimisation",
            "KPI : coût par lead qualifié < 25 €"
        ]
    },
    {
        icon: "📧",
        title: "Prospection Email Ciblée",
        cible: "Listes segmentées achetées ou collectées par secteur/localité",
        tactics: [
            "Objet accrocheur : question ou chiffre (ex: « 73% des restaurants... »)",
            "Corps : 5–7 lignes max, 1 CTA clair, preuve sociale en bas",
            "Suivi : relance J+3 et J+7 pour taux ouverture < 25%",
            "Fréquence : 100–200 emails/jour (respecter limits serveur)",
            "Taux réponse cible : 2–5% pour prospect froid"
        ]
    },
    {
        icon: "🚶",
        title: "Prospection Terrain (Visite boutique / Démarchage)",
        cible: "Commerces locaux, restaurants, artisans sans web fort",
        tactics: [
            "Timing : mardi–jeudi, 10h–12h ou 15h–17h (éviter rushes)",
            "Approche : 30 sec pitch + question besoin + brochure/QR code",
            "Suivi : appel J+2, mail J+3 si contact pris, visite J+7 si intérêt",
            "Cible quotidienne : 8–12 visites pour 1–2 conversions/semaine",
            "Tracking : noter n° direct/email du responsable vu"
        ]
    }
];
