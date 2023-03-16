import Catalog from './Catalog/Catalog';
import  Slideshow  from './SlideShow/SlideShow';

const Home = () => {
    return (
        <main>
            <Slideshow />

            <Catalog />
        </main>
    );
};

export default Home;