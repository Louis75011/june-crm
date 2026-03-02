import styles from './Header.module.scss';

let alexiaPhoto;
try {
    alexiaPhoto = new URL('../../assets/alexia-bc.jpg', import.meta.url).href;
} catch { alexiaPhoto = null; }

const Header = ({ adminUser, onSettingsClick, onInfoClick }) => {
    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <div className={styles.headerLeft}>
                    <span className={styles.greeting}>
                        Bonjour{adminUser?.name ? `, ${adminUser.name.split(' ')[0]}` : ''} 👋
                    </span>
                    <span className={styles.subtitle}>Gestion immobilier neuf</span>
                </div>
                <div className={styles.headerRight}>
                    {onInfoClick && (
                        <button className={styles.headerBtn} onClick={onInfoClick} title="Aide">
                            ℹ️
                        </button>
                    )}
                    {onSettingsClick && (
                        <button className={styles.headerBtn} onClick={onSettingsClick} title="Paramètres">
                            ⚙️
                        </button>
                    )}
                    {adminUser && (
                        <div className={styles.userBadge}>
                            <span className={styles.userName}>{adminUser.name}</span>
                            {alexiaPhoto ? (
                                <img src={alexiaPhoto} alt={adminUser.name} className={styles.userPhoto} />
                            ) : (
                                <span className={styles.userAvatar}>{adminUser.initials}</span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
