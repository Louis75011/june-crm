import { useEffect } from 'react';
import styles from './ConfirmModal.module.scss';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Supprimer', cancelText = 'Annuler' }) => {
    if (!isOpen) return null;

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains(styles.modalOverlay)) {
            onClose();
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>{title}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.warningIcon}>⚠️</div>
                    <p className={styles.message}>{message}</p>
                </div>
                <div className={styles.modalButtons}>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
