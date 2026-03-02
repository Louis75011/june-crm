/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, 
  Home, 
  Megaphone, 
  Globe, 
  Users, 
  Mail, 
  BarChart3, 
  ChevronRight, 
  Copy, 
  CheckCircle2,
  Database,
  ArrowRightLeft,
  Zap,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TABLES = [
  {
    id: 'clients',
    name: '🏢 Clients',
    icon: <Building2 className="w-5 h-5" />,
    description: 'Les promoteurs / coopératives / entreprises clientes de June Lab.',
    fields: [
      { name: 'Nom du client', type: 'Single line text', desc: 'ex. "CAPS", "Rooj by GA"' },
      { name: 'Type', type: 'Single select', desc: 'Promoteur, Coopérative, Bailleur social, Aménageur, Autre' },
      { name: 'Contact principal', type: 'Single line text', desc: 'Nom et fonction' },
      { name: 'Email contact', type: 'Email', desc: '' },
      { name: 'Téléphone contact', type: 'Phone', desc: '' },
      { name: 'Adresse siège', type: 'Single line text', desc: '' },
      { name: 'Ville', type: 'Single line text', desc: '' },
      { name: 'Site web', type: 'URL', desc: '' },
      { name: 'Logo', type: 'Attachment', desc: '' },
      { name: 'Programmes', type: 'Link to 🏗️ Programmes', desc: 'Relation 1:N' },
      { name: 'Campagnes', type: 'Lookup', desc: 'Via Programmes' },
      { name: 'Nombre de programmes', type: 'Rollup', desc: 'COUNT(Programmes)', formula: 'COUNT(values)' },
      { name: 'Nombre total de leads', type: 'Rollup', desc: 'SUM(Programmes -> Leads)', formula: 'SUM(values)' },
      { name: 'Statut collaboration', type: 'Single select', desc: 'Prospect, Actif, En pause, Terminé' },
      { name: 'Date début collaboration', type: 'Date', desc: '' },
      { name: 'Notes', type: 'Long text', desc: '' },
    ],
    views: [
      'Tous les clients (Grid, tri par nom)',
      'Clients actifs (Grid, filtre Statut = Actif)',
      'Kanban par statut (Kanban, groupé par Statut collaboration)'
    ]
  },
  {
    id: 'programmes',
    name: '🏗️ Programmes',
    icon: <Home className="w-5 h-5" />,
    description: 'Chaque programme immobilier géré pour un client.',
    fields: [
      { name: 'Nom du programme', type: 'Single line text', desc: 'ex. "Les Traversées"' },
      { name: 'Client', type: 'Link to 🏢 Clients', desc: 'Relation N:1' },
      { name: 'Ville du programme', type: 'Single line text', desc: '' },
      { name: 'Adresse du programme', type: 'Single line text', desc: '' },
      { name: 'Type de programme', type: 'Single select', desc: 'Neuf, BRS, Rénovation, Mixte, Autre' },
      { name: 'Nombre de lots', type: 'Number', desc: '' },
      { name: 'Prix à partir de', type: 'Currency €', desc: '' },
      { name: 'Date lancement commercial', type: 'Date', desc: '' },
      { name: 'Date livraison prévisionnelle', type: 'Date', desc: '' },
      { name: 'Statut', type: 'Single select', desc: 'En préparation, Commercialisation, En cours de construction, Livré' },
      { name: 'Campagnes', type: 'Link to 📣 Campagnes', desc: 'Relation 1:N' },
      { name: 'Landing pages', type: 'Link to 🌐 Landing Pages', desc: 'Relation 1:N' },
      { name: 'Templates email', type: 'Link to ✉️ Templates Email', desc: 'Relation 1:N' },
      { name: 'Leads', type: 'Link to 👤 Leads', desc: 'Relation 1:N' },
      { name: 'Nombre de leads', type: 'Rollup', desc: 'COUNT(Leads)', formula: 'COUNT(values)' },
      { name: 'Taux de conversion', type: 'Formula', desc: 'Convertis / Total leads', formula: 'IF({Nombre de leads} > 0, ({Leads convertis} / {Nombre de leads}) * 100, 0)' },
      { name: 'Charte couleur principale', type: 'Single line text', desc: 'Hex codes' },
      { name: 'Visuels programme', type: 'Attachment', desc: '' },
      { name: 'Brief créatif', type: 'Long text', desc: '' },
      { name: 'Notes', type: 'Long text', desc: '' },
    ],
    views: [
      'Tous les programmes (Grid)',
      'Par client (Grid, groupé par Client)',
      'En commercialisation (Grid, filtre Statut = Commercialisation)',
      'Calendrier lancements (Calendar, sur Date lancement commercial)'
    ]
  },
  {
    id: 'campagnes',
    name: '📣 Campagnes',
    icon: <Megaphone className="w-5 h-5" />,
    description: 'Chaque campagne média lancée pour un programme.',
    fields: [
      { name: 'Nom de la campagne', type: 'Single line text', desc: 'caps_lestraversees_lancement_v1' },
      { name: 'Programme', type: 'Link to 🏗️ Programmes', desc: 'Relation N:1' },
      { name: 'Client', type: 'Lookup', desc: 'Via Programme -> Client' },
      { name: 'Type de campagne', type: 'Single select', desc: 'Lancement, Relance, Événement, etc.' },
      { name: 'Canal / Source', type: 'Single select', desc: 'Meta Ads, Google Ads, Newsletter, etc.' },
      { name: 'utm_source', type: 'Single line text', desc: '' },
      { name: 'utm_medium', type: 'Single line text', desc: '' },
      { name: 'utm_campaign', type: 'Single line text', desc: '' },
      { name: 'utm_content', type: 'Single line text', desc: '' },
      { name: 'Budget', type: 'Currency €', desc: '' },
      { name: 'Date début', type: 'Date', desc: '' },
      { name: 'Date fin', type: 'Date', desc: '' },
      { name: 'Statut', type: 'Single select', desc: 'Brouillon, Active, En pause, Terminée, Annulée' },
      { name: 'Landing page associée', type: 'Link to 🌐 Landing Pages', desc: '' },
      { name: 'Leads générés', type: 'Rollup', desc: 'COUNT(Leads)', formula: 'COUNT(values)' },
      { name: 'Coût par lead', type: 'Formula', desc: 'Budget / Leads', formula: 'IF({Leads générés} > 0, {Budget} / {Leads générés}, 0)' },
      { name: 'Impressions', type: 'Number', desc: '' },
      { name: 'Clics', type: 'Number', desc: '' },
      { name: 'CTR', type: 'Formula', desc: 'Clics / Impressions', formula: 'IF({Impressions} > 0, ({Clics} / {Impressions}) * 100, 0)' },
      { name: 'Notes performance', type: 'Long text', desc: '' },
      { name: 'Visuels campagne', type: 'Attachment', desc: '' },
    ],
    views: [
      'Toutes les campagnes (Grid)',
      'Par programme (Grid, groupé par Programme)',
      'Par canal (Grid, groupé par Canal / Source)',
      'Actives (Grid, filtre Statut = Active)',
      'Kanban pipeline (Kanban, groupé par Statut)',
      'Calendrier (Calendar, sur Date début)'
    ]
  },
  {
    id: 'landing',
    name: '🌐 Landing Pages',
    icon: <Globe className="w-5 h-5" />,
    description: 'Chaque landing page créée pour un programme/campagne.',
    fields: [
      { name: 'Nom de la page', type: 'Single line text', desc: 'LP Les Traversées – Lancement V1' },
      { name: 'Programme', type: 'Link to 🏗️ Programmes', desc: 'Relation N:1' },
      { name: 'Client', type: 'Lookup', desc: 'Via Programme -> Client' },
      { name: 'Campagne(s) associée(s)', type: 'Link to 📣 Campagnes', desc: 'Relation N:N' },
      { name: 'URL de la page', type: 'URL', desc: '' },
      { name: 'Type de page', type: 'Single select', desc: 'Mini landing, Landing complète, etc.' },
      { name: 'Statut', type: 'Single select', desc: 'Maquette, Dev, Préprod, Live, Archivée' },
      { name: 'Date mise en ligne', type: 'Date', desc: '' },
      { name: 'GA4 installé', type: 'Checkbox', desc: '' },
      { name: 'Meta Pixel installé', type: 'Checkbox', desc: '' },
      { name: 'Clarity installé', type: 'Checkbox', desc: '' },
      { name: 'UTMs configurés', type: 'Checkbox', desc: '' },
      { name: 'Formulaire actif', type: 'Checkbox', desc: '' },
      { name: 'Leads collectés', type: 'Rollup', desc: 'COUNT(Leads)', formula: 'COUNT(values)' },
      { name: 'Taux de conversion page', type: 'Formula', desc: 'Leads / Sessions', formula: 'IF({Sessions} > 0, ({Leads collectés} / {Sessions}) * 100, 0)' },
      { name: 'Sessions', type: 'Number', desc: 'Depuis GA4' },
      { name: 'Lien maquette Figma', type: 'URL', desc: '' },
      { name: 'Capture d\'écran', type: 'Attachment', desc: '' },
      { name: 'Notes', type: 'Long text', desc: '' },
    ],
    views: [
      'Toutes les LP (Grid)',
      'Par programme (Grid, groupé par Programme)',
      'Statut dev (Kanban, groupé par Statut)',
      'Galerie (Gallery, miniature = Capture d\'écran)'
    ]
  },
  {
    id: 'leads',
    name: '👤 Leads',
    icon: <Users className="w-5 h-5" />,
    description: 'Chaque prospect remonté par un formulaire de landing page.',
    fields: [
      { name: 'Nom complet', type: 'Single line text', desc: '' },
      { name: 'Prénom', type: 'Single line text', desc: '' },
      { name: 'Email', type: 'Email', desc: '' },
      { name: 'Téléphone', type: 'Phone', desc: '' },
      { name: 'Ville de résidence', type: 'Single line text', desc: '' },
      { name: 'Typologie recherchée', type: 'Single select', desc: 'Studio, 2P, 3P, 4P, 5P, Maison, Autre' },
      { name: 'Programme', type: 'Link to 🏗️ Programmes', desc: 'Relation N:1' },
      { name: 'Client', type: 'Lookup', desc: 'Via Programme -> Client' },
      { name: 'Landing page source', type: 'Link to 🌐 Landing Pages', desc: 'Relation N:1' },
      { name: 'Campagne source', type: 'Link to 📣 Campagnes', desc: 'Relation N:1' },
      { name: 'utm_source', type: 'Single line text', desc: '' },
      { name: 'utm_medium', type: 'Single line text', desc: '' },
      { name: 'utm_campaign', type: 'Single line text', desc: '' },
      { name: 'utm_content', type: 'Single line text', desc: '' },
      { name: 'Date soumission formulaire', type: 'Date with time', desc: '' },
      { name: 'Statut lead', type: 'Single select', desc: 'Nouveau, À contacter, Contacté, RDV, Converti, etc.' },
      { name: 'Priorité', type: 'Single select', desc: 'Haute, Moyenne, Faible' },
      { name: 'Transmis au client', type: 'Checkbox', desc: '' },
      { name: 'Date transmission client', type: 'Date', desc: '' },
      { name: 'Notes', type: 'Long text', desc: '' },
      { name: 'Consentement RGPD', type: 'Checkbox', desc: '' },
    ],
    views: [
      'Tous les leads (Grid, tri par Date soumission desc)',
      'Par programme (Grid, groupé par Programme)',
      'Par campagne (Grid, groupé par Campagne source)',
      'Par source UTM (Grid, groupé par utm_source)',
      'Nouveaux à traiter (Grid, filtre Statut = Nouveau)',
      'Kanban suivi (Kanban, groupé par Statut lead)',
      'Non transmis au client (Grid, filtre Transmis = false)'
    ]
  },
  {
    id: 'templates',
    name: '✉️ Templates Email',
    icon: <Mail className="w-5 h-5" />,
    description: 'Les gabarits d\'emailing HTML livrés par programme/client.',
    fields: [
      { name: 'Nom du template', type: 'Single line text', desc: 'Confirmation inscription – Les Traversées' },
      { name: 'Programme', type: 'Link to 🏗️ Programmes', desc: 'Relation N:1' },
      { name: 'Client', type: 'Lookup', desc: 'Via Programme -> Client' },
      { name: 'Type de template', type: 'Single select', desc: 'Confirmation, Relance, Newsletter, etc.' },
      { name: 'Statut', type: 'Single select', desc: 'Brouillon, En validation, Validé, Livré' },
      { name: 'Date livraison', type: 'Date', desc: '' },
      { name: 'Fichier HTML', type: 'Attachment', desc: '' },
      { name: 'Capture d\'écran', type: 'Attachment', desc: '' },
      { name: 'ESP cible', type: 'Single select', desc: 'Brevo, Mailchimp, HubSpot, etc.' },
      { name: 'Compatible mobile', type: 'Checkbox', desc: '' },
      { name: 'Testé Litmus', type: 'Checkbox', desc: '' },
      { name: 'Notes', type: 'Long text', desc: '' },
    ],
    views: [
      'Tous les templates (Grid)',
      'Par programme (Grid, groupé par Programme)',
      'Galerie (Gallery, miniature = Capture d\'écran)'
    ]
  },
  {
    id: 'stats',
    name: '📊 Statistiques Campagnes',
    icon: <BarChart3 className="w-5 h-5" />,
    description: 'Vue agrégée pour le reporting consolidé.',
    fields: [
      { name: 'Campagne', type: 'Link to 📣 Campagnes', desc: '' },
      { name: 'Programme', type: 'Lookup', desc: 'Via Campagne -> Programme' },
      { name: 'Client', type: 'Lookup', desc: 'Via Campagne -> Programme -> Client' },
      { name: 'Période', type: 'Single line text', desc: 'ex. "Mars 2026"' },
      { name: 'Impressions', type: 'Number', desc: '' },
      { name: 'Clics', type: 'Number', desc: '' },
      { name: 'CTR', type: 'Formula', desc: '', formula: 'IF({Impressions} > 0, ({Clics} / {Impressions}) * 100, 0)' },
      { name: 'Sessions landing', type: 'Number', desc: '' },
      { name: 'Leads générés', type: 'Number', desc: '' },
      { name: 'Taux conversion landing', type: 'Formula', desc: '', formula: 'IF({Sessions landing} > 0, ({Leads générés} / {Sessions landing}) * 100, 0)' },
      { name: 'Coût total', type: 'Currency €', desc: '' },
      { name: 'Coût par lead', type: 'Formula', desc: '', formula: 'IF({Leads générés} > 0, {Coût total} / {Leads générés}, 0)' },
      { name: 'Leads transmis client', type: 'Number', desc: '' },
      { name: 'Leads convertis', type: 'Number', desc: '' },
      { name: 'Taux conversion final', type: 'Formula', desc: '', formula: 'IF({Leads générés} > 0, ({Leads convertis} / {Leads générés}) * 100, 0)' },
      { name: 'Source de données', type: 'Single select', desc: 'GA4, Meta, Google Ads, Manuel' },
      { name: 'Date mise à jour', type: 'Date', desc: '' },
    ],
    views: [
      'Dashboard global (Grid, groupé par Client)',
      'Par campagne (Grid, tri par Leads générés desc)',
      'Performance mensuelle (Grid, groupé par Période)'
    ]
  }
];

const AUTOMATIONS = [
  { title: 'Alerte Nouveau Lead', desc: 'Quand un lead est créé → notification email à Alexia.' },
  { title: 'Sync Conversion', desc: 'Quand Statut lead passe à "Converti" → incrémenter compteur dans Programmes.' },
  { title: 'Vérification LP', desc: 'Quand une campagne passe à "Active" → vérifier que la LP associée est "Live".' },
  { title: 'Export Client', desc: 'Export CSV hebdomadaire des leads par client (via N8N).' },
  { title: 'Auto-UTM', desc: 'Remplissage automatique des champs UTM via webhook N8N.' },
  { title: 'Relance Lead', desc: 'Alerte si un lead est "Nouveau" depuis plus de 48h sans traitement.' }
];

export default function App() {
  const [activeTable, setActiveTable] = useState(TABLES[0]);
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF6321] rounded-lg flex items-center justify-center text-white">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">June Lab CRM Architect</h1>
              <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wider">Airtable Schema • Paris 18e</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-[#6B7280]">Alexia Belle-Croix</span>
            <div className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center text-xs font-bold">AB</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm">
              <h2 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-4 px-2">Tables du CRM</h2>
              <nav className="space-y-1">
                {TABLES.map((table) => (
                  <button
                    key={table.id}
                    onClick={() => setActiveTable(table)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeTable.id === table.id 
                        ? 'bg-[#FF6321]/10 text-[#FF6321]' 
                        : 'text-[#4B5563] hover:bg-[#F3F4F6]'
                    }`}
                  >
                    {table.icon}
                    {table.name}
                    {activeTable.id === table.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </button>
                ))}
              </nav>
            </div>

            <div className="bg-[#111827] rounded-2xl p-5 text-white shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-[#FF6321]" />
                <h3 className="font-bold text-sm">Automatisations</h3>
              </div>
              <ul className="space-y-3">
                {AUTOMATIONS.slice(0, 3).map((auto, i) => (
                  <li key={i} className="text-xs">
                    <span className="block font-bold text-[#FF6321] mb-0.5">{auto.title}</span>
                    <p className="text-[#9CA3AF] leading-relaxed">{auto.desc}</p>
                  </li>
                ))}
              </ul>
              <button className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors">
                Voir toutes les automatisations
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* Table Detail Card */}
            <motion.div 
              key={activeTable.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden"
            >
              <div className="p-8 border-b border-[#F3F4F6]">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="p-2 bg-[#F3F4F6] rounded-lg text-[#111827]">
                        {activeTable.icon}
                      </span>
                      <h2 className="text-2xl font-bold tracking-tight">{activeTable.name}</h2>
                    </div>
                    <p className="text-[#6B7280] max-w-2xl">{activeTable.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-[#111827] text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-black transition-colors">
                      <LayoutDashboard className="w-4 h-4" />
                      Aperçu Airtable
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#FF6321]" />
                  Structure des champs
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[#F3F4F6]">
                        <th className="pb-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-widest">Nom du champ</th>
                        <th className="pb-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-widest">Type Airtable</th>
                        <th className="pb-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-widest">Description / Formule</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F3F4F6]">
                      {activeTable.fields.map((field, idx) => (
                        <tr key={idx} className="group hover:bg-[#F9FAFB] transition-colors">
                          <td className="py-4 pr-4">
                            <span className="font-bold text-sm text-[#111827]">{field.name}</span>
                          </td>
                          <td className="py-4 pr-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F3F4F6] text-[#4B5563] uppercase tracking-wider border border-[#E5E7EB]">
                              {field.type}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex flex-col">
                                <span className="text-sm text-[#6B7280]">{field.desc}</span>
                                {field.formula && (
                                  <code className="mt-1.5 px-2 py-1 bg-[#F3F4F6] rounded text-[11px] text-[#FF6321] font-mono break-all">
                                    {field.formula}
                                  </code>
                                )}
                              </div>
                              {field.formula && (
                                <button 
                                  onClick={() => copyToClipboard(field.formula!)}
                                  className="p-1.5 text-[#9CA3AF] hover:text-[#FF6321] hover:bg-[#FF6321]/5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                  title="Copier la formule"
                                >
                                  {copied === field.formula ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-8 bg-[#F9FAFB] border-t border-[#F3F4F6]">
                <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#FF6321]" />
                  Vues recommandées
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeTable.views.map((view, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E5E7EB] text-sm text-[#4B5563]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FF6321]" />
                      {view}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Relations Schema Visualization */}
            <section className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-[#FF6321]" />
                Schéma des relations
              </h3>
              <div className="relative p-8 bg-[#F9FAFB] rounded-2xl border border-dashed border-[#D1D5DB] overflow-hidden">
                <div className="flex flex-col items-center gap-8">
                  <div className="px-6 py-3 bg-white border-2 border-[#111827] rounded-xl font-bold shadow-md z-10">🏢 CLIENTS</div>
                  <div className="w-px h-8 bg-[#111827]" />
                  <div className="px-6 py-3 bg-white border-2 border-[#FF6321] rounded-xl font-bold shadow-md z-10">🏗️ PROGRAMMES</div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-4">
                    <div className="flex flex-col items-center">
                      <div className="w-px h-8 bg-[#D1D5DB]" />
                      <div className="px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs font-bold text-[#6B7280]">📣 CAMPAGNES</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-px h-8 bg-[#D1D5DB]" />
                      <div className="px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs font-bold text-[#6B7280]">🌐 LANDING PAGES</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-px h-8 bg-[#D1D5DB]" />
                      <div className="px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs font-bold text-[#6B7280]">👤 LEADS</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-px h-8 bg-[#D1D5DB]" />
                      <div className="px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs font-bold text-[#6B7280]">✉️ TEMPLATES</div>
                    </div>
                  </div>
                </div>
                
                {/* Background Grid Accent */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#111827 1px, transparent 0)', backgroundSize: '24px 24px' }} />
              </div>
            </section>

            {/* Example Data Section */}
            <section className="bg-[#111827] rounded-3xl p-8 text-white">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold">Données d'exemple : CAPS</h3>
                <span className="px-3 py-1 bg-[#FF6321] rounded-full text-[10px] font-bold uppercase tracking-widest">Live Demo</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[#9CA3AF] text-xs uppercase font-bold tracking-widest mb-2">Client</p>
                    <p className="text-lg font-bold">CAPS (Coopérative)</p>
                    <p className="text-sm text-[#6B7280]">Statut : Actif • www.caps.coop</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[#9CA3AF] text-xs uppercase font-bold tracking-widest mb-2">Programme</p>
                    <p className="text-lg font-bold">Les Traversées</p>
                    <p className="text-sm text-[#6B7280]">Saint-Denis (93) • 50 lots • BRS</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-[#FF6321]/10 rounded-2xl border border-[#FF6321]/20">
                    <p className="text-[#FF6321] text-xs uppercase font-bold tracking-widest mb-2">Campagne Active</p>
                    <p className="text-lg font-bold font-mono">caps_lestraversees_lancement_v1</p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="text-[10px] bg-white/5 p-2 rounded border border-white/10">
                        <span className="block text-[#6B7280]">Source</span> meta
                      </div>
                      <div className="text-[10px] bg-white/5 p-2 rounded border border-white/10">
                        <span className="block text-[#6B7280]">Medium</span> paid_social
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E7EB] py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 bg-[#F3F4F6] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Database className="w-6 h-6 text-[#111827]" />
          </div>
          <h2 className="text-xl font-bold mb-2">June Lab CRM Architect</h2>
          <p className="text-[#6B7280] text-sm max-w-md mx-auto">
            Structure optimisée pour Airtable, prête à être déployée pour Alexia Belle-Croix.
            Conçu avec précision pour le marketing immobilier.
          </p>
        </div>
      </footer>
    </div>
  );
}
