import styles from './Spinner.module.css';

const Spinner = () =>
    <div className={styles['spinner-container']}>

        <div className={styles['loader']}></div>
    </div>
    ;

export default Spinner;