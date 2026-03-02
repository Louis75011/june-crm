import { useEffect, useRef } from 'react';
import styles from './Modal.module.scss';

const Modal = ({ isOpen, onClose, title, children, wide = false }) => {
    const isMouseDownOnOverlay = useRef(false);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleOverlayMouseDown = (e) => {
        isMouseDownOnOverlay.current = e.target.classList.contains(styles.modalOverlay);
    };

    const handleOverlayMouseUp = (e) => {
        if (isMouseDownOnOverlay.current && e.target.classList.contains(styles.modalOverlay)) {
            onClose();
        }
        isMouseDownOnOverlay.current = false;
    };

    return (
        <div
            className={`${styles.modalOverlay} ${isOpen ? styles.active : ''}`}
            onMouseDown={handleOverlayMouseDown}
            onMouseUp={handleOverlayMouseUp}
        >
            <div className={`${styles.modalContent} ${wide ? styles.modalWide : ''}`}>
                <div className={styles.modalHeader}>
                    <h2>{title}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;
