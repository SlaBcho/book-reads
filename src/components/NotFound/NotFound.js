import styles from './NotFound.module.css';

const NotFound = () => {
    return (
        <section className={styles['container']}> 

            <div className={styles['error-404']}>
                <img src={'/img/404.png'} alt={'404'} />
            </div>
        </section>
    );
};

export default NotFound;