import styles from './Notification.module.scss';

const Notification = ({ message, type = 'success' }) => {
    if (!message) return null;

    return (
        <div className={`${styles.notification} ${type === 'error' ? styles.error : ''}`}>
            {message}
        </div>
    );
};

export default Notification;
