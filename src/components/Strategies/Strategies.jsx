import styles from './Strategies.module.scss';
import { strategies } from '../../data/initialData';

const Strategies = () => {
    return (
        <div className={styles.strategiesContainer}>
            <h2>🚀 Stratégies de Prospection par Canal</h2>

            {strategies.map((strategy, index) => (
                <div key={index} className={styles.strategyCard}>
                    <h4>{strategy.icon} {strategy.title}</h4>
                    <p><strong>Cible primaire :</strong> {strategy.cible}</p>
                    <div className={styles.tactics}>
                        {strategy.tactics.map((tactic, tacticIndex) => (
                            <div key={tacticIndex} className={styles.tactic}>
                                ✓ {tactic}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div className={styles.tip}>
                <strong>💡 Conseil Monsieur Rouanet :</strong> Combinez 2–3 canaux pour prospect (ex: visite terrain → mail → LinkedIn).
                Multi-canal augmente taux réponse de 40% vs canal unique.
            </div>
        </div>
    );
};

export default Strategies;
