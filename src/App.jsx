import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Header,
  Controls,
  Tabs,
  DataTable,
  EntityForm,
  EntityViewModal,
  ConfirmModal,
  Notification,
  SettingsModal,
  InfoModal
} from './components';
import { useEntity } from './hooks/useEntity';
import { useSettings } from './hooks/useSettings';
import { useNotification } from './hooks/useNotification';
import { exportToCSV, parseCSV, triggerFileImport } from './utils/csvUtils';
import {
  clientsAPI, programmesAPI, campagnesAPI,
  landingpagesAPI, leadsAPI, templatesAPI, statistiquesAPI
} from './services/api';
import {
  CRM_TABS,
  clientColumns, clientFormFields, clientViewFields,
  programmeColumns, programmeFormFields, programmeViewFields,
  campagneColumns, campagneFormFields, campagneViewFields,
  landingpageColumns, landingpageFormFields, landingpageViewFields,
  leadColumns, leadFormFields, leadViewFields,
  templateColumns, templateFormFields, templateViewFields,
  statistiqueColumns, statistiqueFormFields, statistiqueViewFields
} from './data/crmSchema';
import './App.scss';

// Map API par clé d'onglet
const API_MAP = {
  clients: clientsAPI,
  programmes: programmesAPI,
  campagnes: campagnesAPI,
  landingpages: landingpagesAPI,
  leads: leadsAPI,
  templates: templatesAPI,
  statistiques: statistiquesAPI
};

// Map colonnes/champs par clé d'onglet
const SCHEMA_MAP = {
  clients:       { columns: clientColumns, formFields: clientFormFields, viewFields: clientViewFields },
  programmes:    { columns: programmeColumns, formFields: programmeFormFields, viewFields: programmeViewFields },
  campagnes:     { columns: campagneColumns, formFields: campagneFormFields, viewFields: campagneViewFields },
  landingpages:  { columns: landingpageColumns, formFields: landingpageFormFields, viewFields: landingpageViewFields },
  leads:         { columns: leadColumns, formFields: leadFormFields, viewFields: leadViewFields },
  templates:     { columns: templateColumns, formFields: templateFormFields, viewFields: templateViewFields },
  statistiques:  { columns: statistiqueColumns, formFields: statistiqueFormFields, viewFields: statistiqueViewFields }
};

function App() {
  // Hooks entités
  const clients       = useEntity(clientsAPI, 'client');
  const programmes    = useEntity(programmesAPI, 'programme');
  const campagnes     = useEntity(campagnesAPI, 'campagne');
  const landingpages  = useEntity(landingpagesAPI, 'landing page');
  const leads         = useEntity(leadsAPI, 'lead');
  const templates     = useEntity(templatesAPI, 'template');
  const statistiques  = useEntity(statistiquesAPI, 'statistique');

  const ENTITY_MAP = useMemo(() => ({
    clients, programmes, campagnes, landingpages, leads, templates, statistiques
  }), [clients, programmes, campagnes, landingpages, leads, templates, statistiques]);

  const { settings, saveSettings } = useSettings();
  const { notification, showNotification } = useNotification();

  const [searchFilter, setSearchFilter] = useState('');
  const [activeTabIndex, setActiveTabIndex] = useState(0);

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

  // Dark mode
  useEffect(() => {
    document.body.classList.toggle('dark-mode', settings.darkMode);
  }, [settings.darkMode]);

  // Onglet actif
  const activeTab = CRM_TABS[activeTabIndex] || CRM_TABS[0];
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

  // Tabs config
  const tabs = useMemo(() =>
    CRM_TABS.map(tab => ({
      icon: tab.icon,
      label: tab.label,
      content: (
        <DataTable
          columns={SCHEMA_MAP[tab.key].columns}
          data={ENTITY_MAP[tab.key].items}
          searchFilter={searchFilter}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          maxChars={settings.maxChars}
        />
      )
    })),
  [ENTITY_MAP, searchFilter, settings.maxChars, handleEdit, handleDelete, handleView]);

  return (
    <div className="container">
      <Header adminUser={settings.adminUser} />

      <Controls
        onAddClick={() => setIsAddOpen(true)}
        onExportClick={handleExport}
        onImportClick={handleImport}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onInfoClick={() => setIsInfoOpen(true)}
        addLabel={`+ ${activeTab.entityName}`}
        addContext={activeKey}
        searchValue={searchFilter}
        onSearchChange={setSearchFilter}
      />

      <Tabs tabs={tabs} onTabChange={setActiveTabIndex} />

      {/* Modal ajout */}
      <EntityForm
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
        fields={activeSchema.formFields}
        title={`Ajouter ${activeTab.entityName}`}
        mode="add"
      />

      {/* Modal édition */}
      <EntityForm
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingItem(null); }}
        onSubmit={handleSaveEdit}
        fields={activeSchema.formFields}
        initialData={editingItem}
        title={`Modifier ${activeTab.entityName}`}
        mode="edit"
      />

      {/* Modal vue détaillée */}
      <EntityViewModal
        isOpen={isViewOpen}
        onClose={() => { setIsViewOpen(false); setViewingItem(null); }}
        data={viewingItem}
        fields={activeSchema.viewFields}
        title={`Détail ${activeTab.entityName}`}
      />

      {/* Modal confirmation suppression */}
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

      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
    </div>
  );
}

export default App;
