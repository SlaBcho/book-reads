import Catalog from './Catalog/Catalog';
import styles from './Main.module.css';

import  Slideshow  from './SlideShow/SlideShow';

const Main = () => {
    return (
        <main>
            <Slideshow />

            <Catalog />
        </main>
    );
};

export default Main;