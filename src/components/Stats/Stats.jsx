import { useState } from 'react';
import styles from './Stats.module.scss';

const Stats = ({ stats }) => {
    const [isRelanceOpen, setIsRelanceOpen] = useState(false);
    const [isSitesOpen, setIsSitesOpen] = useState(false);
    const [isAuditsOpen, setIsAuditsOpen] = useState(false);
    const [isMaquettesOpen, setIsMaquettesOpen] = useState(false);
    const [isDevisOpen, setIsDevisOpen] = useState(false);
    const [isAppelsOpen, setIsAppelsOpen] = useState(false);
    const [isCartesOpen, setIsCartesOpen] = useState(false);

    const detailStats = [
        { label: 'À contacter', value: stats.aContacter },
        { label: 'En cours', value: stats.enCours },
        { label: "Courant de l'année", value: stats.courantAnnee },
        { label: 'Relancés', value: stats.relance, isRelance: true },
        { label: 'Convertis', value: stats.convertis },
        { label: 'Refusés', value: stats.refuses },
        { label: 'Sans réponse', value: stats.sansReponse }
    ];

    return (
        <>
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <h3>Total Prospects</h3>
                    <div className={styles.number}>{stats.total}</div>
                </div>
                <div className={styles.statCard}>
                    <h3>À Contacter</h3>
                    <div className={styles.number}>{stats.aContacter}</div>
                </div>
                <div className={styles.statCard}>
                    <h3>Nécessitant Relance</h3>
                    <div className={styles.number}>{stats.relance}</div>
                </div>
                <div className={styles.statCard}>
                    <h3>En Cours</h3>
                    <div className={styles.number}>{stats.enCours}</div>
                </div>
                <div className={styles.statCard}>
                    <h3>Courant Année</h3>
                    <div className={styles.number}>{stats.courantAnnee}</div>
                </div>
                <div className={styles.statCard}>
                    <h3>Convertis</h3>
                    <div className={styles.number}>{stats.convertis}</div>
                </div>
                <div className={styles.statCard}>
                    <h3>Taux Conversion</h3>
                    <div className={styles.number}>{stats.taux}%</div>
                </div>
                <div className={styles.statCard}>
                    <h3>Refusés</h3>
                    <div className={styles.number}>{stats.refuses}</div>
                </div>
                <div className={styles.statCard}>
                    <h3>Sans Réponse</h3>
                    <div className={styles.number}>{stats.sansReponse}</div>
                </div>
            </div>

            {/* Section Offres Offertes */}
            <h3 className={styles.sectionTitle}>📊 Offres offertes & Suivi commercial</h3>
            <div className={styles.statsGrid}>
                <div className={styles.statCardOffert}>
                    <h3>🔍 Audits réalisés</h3>
                    <div className={styles.number}>{stats.audits || 0}</div>
                </div>
                <div className={styles.statCardOffert}>
                    <h3>🎨 Maquettes réalisées</h3>
                    <div className={styles.number}>{stats.maquettes || 0}</div>
                </div>
                <div className={styles.statCardOffert}>
                    <h3>📄 Devis envoyés</h3>
                    <div className={styles.number}>{stats.devisEnvoyes || 0}</div>
                </div>
                <div className={styles.statCardOffert}>
                    <h3>📞 Appels / RDV</h3>
                    <div className={styles.number}>{stats.appelsRdv || 0}</div>
                </div>
                <div className={styles.statCardPayant}>
                    <h3>🌐 Sites réalisés (payants)</h3>
                    <div className={styles.number}>{stats.sitesRealises || 0}</div>
                </div>
                <div className={styles.statCardCartes}>
                    <h3>🎴 Cartes de visite</h3>
                    <div className={styles.number}>{stats.cartesVisite || 0}</div>
                </div>
            </div>

            {/* Listes compactes des offres offertes */}
            <div className={styles.compactSection}>
                <div className={styles.compactGrid}>
                    <div className={styles.compactDetail}>
                        <div
                            className={styles.compactToggle}
                            onClick={() => setIsAuditsOpen(prev => !prev)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && setIsAuditsOpen(prev => !prev)}
                        >
                            <span className={styles.compactIcon}>{isAuditsOpen ? '▼' : '▶'}</span>
                            <span className={styles.compactTitle}>🔍 Audits ({stats.audits})</span>
                        </div>
                        {isAuditsOpen && stats.auditsListe?.length > 0 && (
                            <div className={styles.compactList}>
                                {stats.auditsListe.map((p, i) => <div key={i}>✅ {p.nomEntreprise}</div>)}
                            </div>
                        )}
                    </div>

                    <div className={styles.compactDetail}>
                        <div
                            className={styles.compactToggle}
                            onClick={() => setIsMaquettesOpen(prev => !prev)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && setIsMaquettesOpen(prev => !prev)}
                        >
                            <span className={styles.compactIcon}>{isMaquettesOpen ? '▼' : '▶'}</span>
                            <span className={styles.compactTitle}>🎨 Maquettes ({stats.maquettes})</span>
                        </div>
                        {isMaquettesOpen && stats.maquettesListe?.length > 0 && (
                            <div className={styles.compactList}>
                                {stats.maquettesListe.map((p, i) => <div key={i}>✅ {p.nomEntreprise}</div>)}
                            </div>
                        )}
                    </div>

                    <div className={styles.compactDetail}>
                        <div
                            className={styles.compactToggle}
                            onClick={() => setIsDevisOpen(prev => !prev)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && setIsDevisOpen(prev => !prev)}
                        >
                            <span className={styles.compactIcon}>{isDevisOpen ? '▼' : '▶'}</span>
                            <span className={styles.compactTitle}>📄 Devis ({stats.devisEnvoyes})</span>
                        </div>
                        {isDevisOpen && stats.devisListe?.length > 0 && (
                            <div className={styles.compactList}>
                                {stats.devisListe.map((p, i) => <div key={i}>✅ {p.nomEntreprise}</div>)}
                            </div>
                        )}
                    </div>

                    <div className={styles.compactDetail}>
                        <div
                            className={styles.compactToggle}
                            onClick={() => setIsAppelsOpen(prev => !prev)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && setIsAppelsOpen(prev => !prev)}
                        >
                            <span className={styles.compactIcon}>{isAppelsOpen ? '▼' : '▶'}</span>
                            <span className={styles.compactTitle}>📞 Appels/RDV ({stats.appelsRdv})</span>
                        </div>
                        {isAppelsOpen && stats.appelsListe?.length > 0 && (
                            <div className={styles.compactList}>
                                {stats.appelsListe.map((p, i) => <div key={i}>✅ {p.nomEntreprise}</div>)}
                            </div>
                        )}
                    </div>

                    <div className={styles.compactDetail}>
                        <div
                            className={styles.compactToggle}
                            onClick={() => setIsSitesOpen(prev => !prev)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && setIsSitesOpen(prev => !prev)}
                        >
                            <span className={styles.compactIcon}>{isSitesOpen ? '▼' : '▶'}</span>
                            <span className={styles.compactTitle}>🌐 Sites payants ({stats.sitesRealises})</span>
                        </div>
                        {isSitesOpen && stats.sitesRealisesListe?.length > 0 && (
                            <div className={styles.compactList}>
                                {stats.sitesRealisesListe.map((s, i) => (
                                    <div key={i}>
                                        ✅ {s.nomEntreprise}
                                        {s.suiviSite && <span className={styles.suiviBadge}> 🔧</span>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={styles.compactDetail}>
                        <div
                            className={styles.compactToggle}
                            onClick={() => setIsCartesOpen(prev => !prev)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && setIsCartesOpen(prev => !prev)}
                        >
                            <span className={styles.compactIcon}>{isCartesOpen ? '▼' : '▶'}</span>
                            <span className={styles.compactTitle}>🎴 Cartes de visite ({stats.cartesVisite})</span>
                        </div>
                        {isCartesOpen && stats.cartesVisiteListe?.length > 0 && (
                            <div className={styles.compactList}>
                                {stats.cartesVisiteListe.map((p, i) => (
                                    <div key={i}>
                                        ✅ {p.nomEntreprise}
                                        {p.cartesVisiteEndroits?.length > 0 && (
                                            <span style={{ fontSize: '0.8em', color: '#666' }}> ({p.cartesVisiteEndroits.join(', ')})</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.statsDetail}>
                <h3>Répartition par statut</h3>
                {detailStats.map((stat, index) => (
                    <div key={index}>
                        <div
                            className={stat.isRelance ? styles.statRowToggle : styles.statRow}
                            onClick={stat.isRelance ? () => setIsRelanceOpen(prev => !prev) : undefined}
                            role={stat.isRelance ? 'button' : undefined}
                            tabIndex={stat.isRelance ? 0 : undefined}
                            onKeyDown={stat.isRelance ? (event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    setIsRelanceOpen(prev => !prev);
                                }
                            } : undefined}
                        >
                            <span className={styles.rowLabel}>
                                {stat.isRelance && (
                                    <span className={styles.toggleIcon}>{isRelanceOpen ? '▼' : '▶'}</span>
                                )}
                                <strong>{stat.label}</strong>
                            </span>
                            <span className={styles.value}>{stat.value}</span>
                        </div>
                        {stat.isRelance && isRelanceOpen && (
                            <div className={styles.subList}>
                                <div className={styles.subRow}>
                                    <span>Relancé J+1</span>
                                    <span className={styles.value}>{stats.relanceDetail?.j1 ?? 0}</span>
                                </div>
                                <div className={styles.subRow}>
                                    <span>Relancé J+3</span>
                                    <span className={styles.value}>{stats.relanceDetail?.j3 ?? 0}</span>
                                </div>
                                <div className={styles.subRow}>
                                    <span>Relancé J+5</span>
                                    <span className={styles.value}>{stats.relanceDetail?.j5 ?? 0}</span>
                                </div>
                                <div className={styles.subRow}>
                                    <span>Relancé J+7</span>
                                    <span className={styles.value}>{stats.relanceDetail?.j7 ?? 0}</span>
                                </div>
                                <div className={styles.subRow}>
                                    <span>Autres relances</span>
                                    <span className={styles.value}>{stats.relanceDetail?.autres ?? 0}</span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

export default Stats;
