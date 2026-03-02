import styles from './RelanceCalendar.module.scss';
import { relanceProtocol } from '../../data/initialData';

const RelanceCalendar = () => {
    return (
        <div className={styles.calendarSection}>
            <h2>📅 Protocole de Relance Automatisé</h2>
            <table className={styles.calendarTable}>
                <thead>
                    <tr>
                        <th>Jour</th>
                        <th>Action</th>
                        <th>Moyen Recommandé</th>
                        <th>Objet / Ton</th>
                    </tr>
                </thead>
                <tbody>
                    {relanceProtocol.map((item, index) => (
                        <tr key={index}>
                            <td><div className={styles.jour}>{item.jour}</div></td>
                            <td><div className={styles.action}>{item.action}</div></td>
                            <td><div className={styles.moyen}>{item.moyen}</div></td>
                            <td className={styles.objet}>{item.objet}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className={styles.note}>
                <strong>Codification :</strong> Le statut de votre prospect dans le CRM met à jour automatiquement selon les dates de contact.
                « Relancé J+1 » signifie que le mail de J+1 a été envoyé.
            </p>
        </div>
    );
};

export default RelanceCalendar;
