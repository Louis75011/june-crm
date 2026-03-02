import styles from './Header.module.scss';
import arxLogo from '../../assets/arx-systema-logo-transparent.png';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <img src={arxLogo} alt="ARX Systema" className={styles.logo} />
                <div className={styles.headerText}>
                    <h1>ARX CRM PROSPECTION</h1>
                    <p>Gestion intelligente de vos prospects – Relances automatisées, stratégies digitales intégrées</p>
                </div>
            </div>
        </header>
    );
};

export default Header;
