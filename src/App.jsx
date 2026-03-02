import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Header,
  Controls,
  Tabs,
  ProspectsTable,
  PartenariatsTable,
  PartenariatForm,
  PartenariatViewModal,
  Stats,
  RelanceCalendar,
  Strategies,
  ProspectForm,
  ConfirmModal,
  ProspectViewModal,
  Notification,
  SettingsModal,
  InfoModal
} from './components';
import { useProspects } from './hooks/useProspects';
import { usePartenariats } from './hooks/usePartenariats';
import { useSettings } from './hooks/useSettings';
import { useNotification } from './hooks/useNotification';
import { exportToCSV, parseCSV, triggerFileImport } from './utils/csvUtils';
import './App.scss';

function App() {
  const { prospects, loading: prospectsLoading, addProspect, updateProspect, deleteProspect, importProspects, getStats } = useProspects();
  const { partenariats, loading: partenariatsLoading, addPartenariat, updatePartenariat, deletePartenariat } = usePartenariats();
  const { settings, saveSettings } = useSettings();
  const { notification, showNotification } = useNotification();

  const [searchFilter, setSearchFilter] = useState('');
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProspect, setEditingProspect] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [prospectToDelete, setProspectToDelete] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingProspect, setViewingProspect] = useState(null);
  const [isPartenariatAddOpen, setIsPartenariatAddOpen] = useState(false);
  const [isPartenariatEditOpen, setIsPartenariatEditOpen] = useState(false);
  const [editingPartenariat, setEditingPartenariat] = useState(null);
  const [isPartenariatViewOpen, setIsPartenariatViewOpen] = useState(false);
  const [viewingPartenariat, setViewingPartenariat] = useState(null);
  const [isPartenariatDeleteOpen, setIsPartenariatDeleteOpen] = useState(false);
  const [partenariatToDelete, setPartenariatToDelete] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // Appliquer le dark mode
  useEffect(() => {
    document.body.classList.toggle('dark-mode', settings.darkMode);
  }, [settings.darkMode]);

  // Sauvegarder les paramètres
  const handleSaveSettings = useCallback(async (newSettings) => {
    try {
      await saveSettings(newSettings);
      showNotification('Paramètres enregistrés !');
    } catch (err) {
      showNotification('Erreur lors de la sauvegarde', 'error');
    }
  }, [saveSettings, showNotification]);

  const stats = useMemo(() => getStats(), [getStats]);

  // Handlers
  const handleAddProspect = useCallback(async (prospectData) => {
    try {
      await addProspect(prospectData);
      showNotification('Prospect ajouté avec succès!');
    } catch (err) {
      showNotification('Erreur lors de l\'ajout', 'error');
    }
  }, [addProspect, showNotification]);

  const handleAddPartenariat = useCallback(async (partenariatData) => {
    try {
      await addPartenariat(partenariatData);
      showNotification('Partenariat ajouté avec succès!');
    } catch (err) {
      showNotification('Erreur lors de l\'ajout', 'error');
    }
  }, [addPartenariat, showNotification]);

  const handleEditProspect = useCallback((prospect) => {
    setEditingProspect(prospect);
    setIsEditModalOpen(true);
  }, []);

  const handleViewProspect = useCallback((prospect) => {
    setViewingProspect(prospect);
    setIsViewModalOpen(true);
  }, []);

  const handleEditPartenariat = useCallback((partenariat) => {
    setEditingPartenariat(partenariat);
    setIsPartenariatEditOpen(true);
  }, []);

  const handleViewPartenariat = useCallback((partenariat) => {
    setViewingPartenariat(partenariat);
    setIsPartenariatViewOpen(true);
  }, []);

  const handleSaveProspect = useCallback(async (prospectData) => {
    if (editingProspect) {
      try {
        await updateProspect(editingProspect.id, prospectData);
        showNotification('Prospect mis à jour!');
        setEditingProspect(null);
      } catch (err) {
        showNotification('Erreur lors de la mise à jour', 'error');
      }
    }
  }, [editingProspect, updateProspect, showNotification]);

  const handleDeleteProspect = useCallback((id) => {
    setProspectToDelete(id);
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeletePartenariat = useCallback((id) => {
    setPartenariatToDelete(id);
    setIsPartenariatDeleteOpen(true);
  }, []);

  const confirmDeleteProspect = useCallback(async () => {
    if (prospectToDelete) {
      try {
        await deleteProspect(prospectToDelete);
        showNotification('Prospect supprimé');
        setIsDeleteModalOpen(false);
        setProspectToDelete(null);
      } catch (err) {
        showNotification('Erreur lors de la suppression', 'error');
      }
    }
  }, [prospectToDelete, deleteProspect, showNotification]);

  const cancelDeleteProspect = useCallback(() => {
    setIsDeleteModalOpen(false);
    setProspectToDelete(null);
  }, []);

  const confirmDeletePartenariat = useCallback(async () => {
    if (partenariatToDelete) {
      try {
        await deletePartenariat(partenariatToDelete);
        showNotification('Partenariat supprimé');
        setIsPartenariatDeleteOpen(false);
        setPartenariatToDelete(null);
      } catch (err) {
        showNotification('Erreur lors de la suppression', 'error');
      }
    }
  }, [partenariatToDelete, deletePartenariat, showNotification]);

  const cancelDeletePartenariat = useCallback(() => {
    setIsPartenariatDeleteOpen(false);
    setPartenariatToDelete(null);
  }, []);

  const handleSavePartenariat = useCallback(async (partenariatData) => {
    if (editingPartenariat) {
      try {
        await updatePartenariat(editingPartenariat.id, partenariatData);
        showNotification('Partenariat mis à jour!');
        setEditingPartenariat(null);
      } catch (err) {
        showNotification('Erreur lors de la mise à jour', 'error');
      }
    }
  }, [editingPartenariat, updatePartenariat, showNotification]);

  const handleExport = useCallback(() => {
    exportToCSV(prospects);
    showNotification('CSV exporté avec succès!');
  }, [prospects, showNotification]);

  const handleImport = useCallback(() => {
    triggerFileImport(async (csvContent) => {
      try {
        const newProspects = parseCSV(csvContent);
        if (newProspects.length > 0) {
          await importProspects(newProspects);
          showNotification(`${newProspects.length} prospect(s) importé(s)!`);
        } else {
          showNotification('Aucun prospect trouvé dans le fichier', 'error');
        }
      } catch {
        showNotification('Erreur lors de l\'import', 'error');
      }
    });
  }, [importProspects, showNotification]);

  // Configuration des onglets
  const tabs = useMemo(() => [
    {
      icon: '📊',
      label: 'TABLEAU PROSPECTS',
      type: 'prospects',
      content: (
        <ProspectsTable
          prospects={prospects}
          searchFilter={searchFilter}
          onEdit={handleEditProspect}
          onDelete={handleDeleteProspect}
          onView={handleViewProspect}
          maxChars={settings.maxChars}
        />
      )
    },
    {
      icon: '📈',
      label: 'STATISTIQUES',
      content: <Stats stats={stats} />
    },
    {
      icon: '⏰',
      label: 'CALENDRIER RELANCES',
      content: <RelanceCalendar />
    },
    {
      icon: '🎯',
      label: 'STRATÉGIES DIGITALES',
      content: <Strategies />
    },
    {
      icon: '🤝',
      label: 'TABLEAU PARTENARIATS',
      type: 'partenariats',
      content: (
        <PartenariatsTable
          partenariats={partenariats}
          searchFilter={searchFilter}
          onEdit={handleEditPartenariat}
          onDelete={handleDeletePartenariat}
          onView={handleViewPartenariat}
          maxChars={settings.maxChars}
        />
      )
    }
  ], [prospects, partenariats, searchFilter, stats, settings.maxChars, handleEditProspect, handleDeleteProspect, handleViewProspect, handleEditPartenariat, handleDeletePartenariat, handleViewPartenariat]);

  const activeTabType = tabs[activeTabIndex]?.type || 'prospects';
  const addLabel = activeTabType === 'partenariats'
    ? 'Ajouter un partenaire'
    : 'Ajouter un prospect';

  const handleAddClick = useCallback(() => {
    if (activeTabType === 'partenariats') {
      setIsPartenariatAddOpen(true);
      return;
    }
    setIsAddModalOpen(true);
  }, [activeTabType]);

  return (
    <div className="container">
      <Header />

      <Controls
        onAddClick={handleAddClick}
        onExportClick={handleExport}
        onImportClick={handleImport}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onInfoClick={() => setIsInfoOpen(true)}
        addLabel={addLabel}
        addContext={activeTabType}
        searchValue={searchFilter}
        onSearchChange={setSearchFilter}
      />

      <Tabs tabs={tabs} onTabChange={setActiveTabIndex} />

      <ProspectForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddProspect}
        mode="add"
      />

      <PartenariatForm
        isOpen={isPartenariatAddOpen}
        onClose={() => setIsPartenariatAddOpen(false)}
        onSubmit={handleAddPartenariat}
        mode="add"
      />

      <ProspectForm
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingProspect(null);
        }}
        onSubmit={handleSaveProspect}
        prospect={editingProspect}
        mode="edit"
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDeleteProspect}
        onConfirm={confirmDeleteProspect}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer ce prospect ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
      />

      <PartenariatForm
        isOpen={isPartenariatEditOpen}
        onClose={() => {
          setIsPartenariatEditOpen(false);
          setEditingPartenariat(null);
        }}
        onSubmit={handleSavePartenariat}
        partenariat={editingPartenariat}
        mode="edit"
      />

      <ConfirmModal
        isOpen={isPartenariatDeleteOpen}
        onClose={cancelDeletePartenariat}
        onConfirm={confirmDeletePartenariat}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer ce partenariat ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
      />

      <ProspectViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingProspect(null);
        }}
        prospect={viewingProspect}
      />

      <PartenariatViewModal
        isOpen={isPartenariatViewOpen}
        onClose={() => {
          setIsPartenariatViewOpen(false);
          setViewingPartenariat(null);
        }}
        partenariat={viewingPartenariat}
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
