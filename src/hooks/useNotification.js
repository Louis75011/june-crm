import { useState, useCallback, useEffect } from 'react';

export const useNotification = () => {
    const [notification, setNotification] = useState(null);

    const showNotification = useCallback((message, type = 'success') => {
        setNotification({ message, type });
    }, []);

    const hideNotification = useCallback(() => {
        setNotification(null);
    }, []);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    return { notification, showNotification, hideNotification };
};
