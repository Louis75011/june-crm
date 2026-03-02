import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Header,
  DataTable,
  EntityForm,
  EntityViewModal,
  Modal,
  ConfirmModal,
  Notification,
  SettingsModal,
  InfoModal,
  EmailPreview
} from './components';
import { useEntity } from './hooks/useEntity';
import { useSettings } from './hooks/useSettings';
import { useNotification } from './hooks/useNotification';
import { exportToCSV, parseCSV, triggerFileImport } from './utils/csvUtils';
import {
  clientsAPI, programmesAPI, campagnesAPI,
  landingpagesAPI, prospectsAPI, templatesAPI, statistiquesAPI
} from './services/api';
import {
  CRM_TABS,
  clientColumns, clientFormFields, clientViewFields,
  programmeColumns, programmeFormFields, programmeViewFields,
  campagneColumns, campagneFormFields, campagneViewFields,
  landingpageColumns, landingpageFormFields, landingpageViewFields,
  prospectColumns, prospectFormFields, prospectViewFields,
  templateColumns, templateFormFields, templateViewFields,
  statistiqueColumns, statistiqueFormFields, statistiqueViewFields
} from './data/crmSchema';
import juneLogo from './assets/june-lab-logo.png';
import './App.scss';

// Map colonnes/champs par clé d'onglet
const SCHEMA_MAP = {
  clients: { columns: clientColumns, formFields: clientFormFields, viewFields: clientViewFields },
  programmes: { columns: programmeColumns, formFields: programmeFormFields, viewFields: programmeViewFields },
  campagnes: { columns: campagneColumns, formFields: campagneFormFields, viewFields: campagneViewFields },
  landingpages: { columns: landingpageColumns, formFields: landingpageFormFields, viewFields: landingpageViewFields },
  prospects: { columns: prospectColumns, formFields: prospectFormFields, viewFields: prospectViewFields },
  templates: { columns: templateColumns, formFields: templateFormFields, viewFields: templateViewFields },
  statistiques: { columns: statistiqueColumns, formFields: statistiqueFormFields, viewFields: statistiqueViewFields }
};

// Liens vers les landing pages déployées
const LP_LINKS = [
  { label: 'Les Traversées – CAPS', url: 'https://les-traversees-caps.vercel.app/', icon: '🏠' },
  { label: 'Mini June Lab Immo Neuf', url: 'https://june-lab-immobilier-neuf.vercel.app/', icon: '🏢' },
];

function App() {
  // Hooks entités
  const clients = useEntity(clientsAPI, 'client');
  const programmes = useEntity(programmesAPI, 'programme');
  const campagnes = useEntity(campagnesAPI, 'campagne');
  const landingpages = useEntity(landingpagesAPI, 'landing page');
  const prospects = useEntity(prospectsAPI, 'prospect');
  const templates = useEntity(templatesAPI, 'template');
  const statistiques = useEntity(statistiquesAPI, 'statistique');

  const ENTITY_MAP = useMemo(() => ({
    clients, programmes, campagnes, landingpages, prospects, templates, statistiques
  }), [clients, programmes, campagnes, landingpages, prospects, templates, statistiques]);

  // Lookup maps pour résoudre les relations (ID → nom)
  const lookupMaps = useMemo(() => ({
    clients: Object.fromEntries((clients.items || []).map(c => [c.id, c.nom])),
    programmes: Object.fromEntries((programmes.items || []).map(p => [p.id, p.nom])),
    campagnes: Object.fromEntries((campagnes.items || []).map(c => [c.id, c.nom])),
    landingpages: Object.fromEntries((landingpages.items || []).map(lp => [lp.id, lp.nom])),
  }), [clients.items, programmes.items, campagnes.items, landingpages.items]);

  const { settings, saveSettings } = useSettings();
  const { notification, showNotification } = useNotification();

  const [searchFilter, setSearchFilter] = useState('');
  const [activeTabKey, setActiveTabKey] = useState('clients');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [emailPreviewData, setEmailPreviewData] = useState(null);

  // Dark mode
  useEffect(() => {
    document.body.classList.toggle('dark-mode', settings.darkMode);
  }, [settings.darkMode]);

  // Onglet actif
  const activeTab = CRM_TABS.find(t => t.key === activeTabKey) || CRM_TABS[0];
  const activeKey = activeTab.key;
  const activeEntity = ENTITY_MAP[activeKey];
  const activeSchema = SCHEMA_MAP[activeKey];

  // Handlers CRUD
  const handleAdd = useCallback(async (data) => {
    try {
      await activeEntity.addItem(data);
      showNotification(`${activeTab.entityName} ajouté(e) !`);
    } catch {
      showNotification('Erreur lors de l\'ajout', 'error');
    }
  }, [activeEntity, activeTab, showNotification]);

  const handleEdit = useCallback((item) => {
    setEditingItem(item);
    setIsEditOpen(true);
  }, []);

  const handleSaveEdit = useCallback(async (data) => {
    if (!editingItem) return;
    try {
      await activeEntity.updateItem(editingItem.id, data);
      showNotification(`${activeTab.entityName} mis(e) à jour !`);
      setEditingItem(null);
    } catch {
      showNotification('Erreur lors de la modification', 'error');
    }
  }, [editingItem, activeEntity, activeTab, showNotification]);

  const handleDelete = useCallback((id) => {
    setItemToDelete(id);
    setIsDeleteOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!itemToDelete) return;
    try {
      await activeEntity.deleteItem(itemToDelete);
      showNotification(`${activeTab.entityName} supprimé(e)`);
      setIsDeleteOpen(false);
      setItemToDelete(null);
    } catch {
      showNotification('Erreur lors de la suppression', 'error');
    }
  }, [itemToDelete, activeEntity, activeTab, showNotification]);

  const handleView = useCallback((item) => {
    setViewingItem(item);
    setIsViewOpen(true);
  }, []);

  // Export / Import CSV
  const handleExport = useCallback(() => {
    exportToCSV(activeEntity.items, activeSchema.columns, `JuneLab-${activeKey}`);
    showNotification(`CSV ${activeTab.label} exporté !`);
  }, [activeEntity, activeSchema, activeKey, activeTab, showNotification]);

  const handleImport = useCallback(() => {
    triggerFileImport(async (csvContent) => {
      try {
        const newItems = parseCSV(csvContent, activeSchema.formFields);
        if (newItems.length > 0) {
          await activeEntity.importItems(newItems);
          showNotification(`${newItems.length} ${activeTab.entityName}(s) importé(s) !`);
        } else {
          showNotification('Aucune donnée trouvée dans le fichier', 'error');
        }
      } catch {
        showNotification('Erreur lors de l\'import', 'error');
      }
    });
  }, [activeEntity, activeSchema, activeTab, showNotification]);

  // Settings
  const handleSaveSettings = useCallback(async (newSettings) => {
    try {
      await saveSettings(newSettings);
      showNotification('Paramètres enregistrés !');
    } catch {
      showNotification('Erreur lors de la sauvegarde', 'error');
    }
  }, [saveSettings, showNotification]);

  return (
    <div className="app-layout">
      {/* ===== SIDEBAR ===== */}
      <aside className={`sidebar ${sidebarCollapsed ? 'sidebar--collapsed' : ''}`}>
        <div className="sidebar__brand">
          <img src={juneLogo} alt="June Lab" className="sidebar__logo" />
          {!sidebarCollapsed && <span className="sidebar__title">June Lab CRM</span>}
        </div>

        <nav className="sidebar__nav">
          <div className="sidebar__section-label">Navig.</div>
          {CRM_TABS.map(tab => (
            <button
              key={tab.key}
              className={`sidebar__item ${activeTabKey === tab.key ? 'sidebar__item--active' : ''}`}
              onClick={() => { setActiveTabKey(tab.key); setSearchFilter(''); }}
              title={tab.label}
            >
              <span className="sidebar__item-icon">{tab.icon}</span>
              {!sidebarCollapsed && <span className="sidebar__item-label">{tab.label}</span>}
              {!sidebarCollapsed && (
                <span className="sidebar__item-count">{ENTITY_MAP[tab.key].items?.length || 0}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar__lp-section">
          {!sidebarCollapsed && <div className="sidebar__section-label">Landing Pages Live</div>}
          {LP_LINKS.map((lp, i) => (
            <a key={i} href={lp.url} target="_blank" rel="noopener noreferrer" className="sidebar__lp-link" title={lp.label}>
              <span className="sidebar__item-icon">{lp.icon}</span>
              {!sidebarCollapsed && <span className="sidebar__item-label">{lp.label}</span>}
              {!sidebarCollapsed && <span className="sidebar__lp-ext">↗</span>}
            </a>
          ))}
        </div>

        <div className="sidebar__footer">
          <button className="sidebar__toggle" onClick={() => setSidebarCollapsed(c => !c)} title="Réduire / Étendre">
            {sidebarCollapsed ? '»' : '«'}
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="main-content">
        <Header
          adminUser={settings.adminUser}
          onSettingsClick={() => setIsSettingsOpen(true)}
          onInfoClick={() => setIsInfoOpen(true)}
        />

        {/* Toolbar */}
        <div className="toolbar">
          <div className="toolbar__left">
            <h2 className="toolbar__title">
              <span className="toolbar__title-icon">{activeTab.icon}</span>
              {activeTab.label}
            </h2>
            <button className="toolbar__btn toolbar__btn--primary" onClick={() => setIsAddOpen(true)}>
              + Ajouter
            </button>
            <button className="toolbar__btn toolbar__btn--outline" onClick={handleExport}>
              📥 Export
            </button>
            <button className="toolbar__btn toolbar__btn--outline" onClick={handleImport}>
              📤 Import
            </button>
            {activeKey === 'templates' && (
              <button
                className="toolbar__btn toolbar__btn--outline"
                onClick={() => setEmailPreviewData({
                  prospect: prospects.items?.[0] || null,
                  template: templates.items?.[0] || null
                })}
              >
                👁️ Prévisualiser
              </button>
            )}
          </div>
          <div className="toolbar__right">
            <div className="toolbar__search">
              <span className="toolbar__search-icon">🔍</span>
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
              {searchFilter && (
                <button className="toolbar__search-clear" onClick={() => setSearchFilter('')}>×</button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="content-area">
          <DataTable
            columns={activeSchema.columns}
            data={activeEntity.items}
            searchFilter={searchFilter}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            maxChars={settings.maxChars}
            lookupMaps={lookupMaps}
          />
        </div>
      </main>

      {/* ===== MODALS ===== */}
      <EntityForm
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
        fields={activeSchema.formFields}
        title={`Ajouter ${activeTab.entityName}`}
        mode="add"
        lookupMaps={lookupMaps}
      />

      <EntityForm
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingItem(null); }}
        onSubmit={handleSaveEdit}
        fields={activeSchema.formFields}
        initialData={editingItem}
        title={`Modifier ${activeTab.entityName}`}
        mode="edit"
        lookupMaps={lookupMaps}
      />

      <EntityViewModal
        isOpen={isViewOpen}
        onClose={() => { setIsViewOpen(false); setViewingItem(null); }}
        data={viewingItem}
        fields={activeSchema.viewFields}
        title={`Détail ${activeTab.entityName}`}
        lookupMaps={lookupMaps}
      />

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setItemToDelete(null); }}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />

      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />

      {emailPreviewData && (
        <Modal isOpen={true} onClose={() => setEmailPreviewData(null)}>
          <EmailPreview
            prospect={emailPreviewData.prospect}
            template={emailPreviewData.template}
            lookupMaps={lookupMaps}
            onClose={() => setEmailPreviewData(null)}
          />
        </Modal>
      )}

      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
    </div>
  );
}

export default App;
