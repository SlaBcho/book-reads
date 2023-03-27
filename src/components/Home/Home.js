import Catalog from './Catalog/Catalog';
import  Slideshow  from './SlideShow/SlideShow';
import styles from './Home.module.css';

const Home = () => {
    return (
        <main>
            <Slideshow />

            <Catalog />

            <div className={styles['banner']}>
                <img src="/img/banner3.png" alt="banner" />
            </div>
        </main>
    );
};

export default Home;