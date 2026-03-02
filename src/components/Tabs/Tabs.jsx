import { useState } from 'react';
import styles from './Tabs.module.scss';

const Tabs = ({ tabs, onTabChange }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className={styles.tabContainer}>
            <div className={styles.tabs}>
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`${styles.tab} ${activeTab === index ? styles.active : ''}`}
                        onClick={() => {
                            setActiveTab(index);
                            if (onTabChange) onTabChange(index);
                        }}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>
            {tabs.map((tab, index) => (
                <div
                    key={index}
                    className={`${styles.tabContent} ${activeTab === index ? styles.active : ''}`}
                >
                    {tab.content}
                </div>
            ))}
        </div>
    );
};

export default Tabs;
