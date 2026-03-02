import styles from './Header.module.scss';

const Header = ({ adminUser }) => {
    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <div className={styles.brand}>
                    <span className={styles.logoIcon}>◉</span>
                    <div className={styles.headerText}>
                        <h1>June Lab CRM</h1>
                        <p>Immobilier neuf · Gestion clients, programmes, campagnes & leads</p>
                    </div>
                </div>
                {adminUser && (
                    <div className={styles.userBadge}>
                        <span className={styles.userName}>{adminUser.name}</span>
                        <span className={styles.userAvatar}>{adminUser.initials}</span>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
