import styles from './SlideShow.module.css';

import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const slideImages = [
    {
        url: 'img/picture1.jpg',
    },
    {
        url: 'img/picture2.jpg',
    },
    {
        url: 'img/picture3.jpg',
    },
    {
        url: 'img/picture4.jpg',
    },

];

const Slideshow = () => {
    return (
        <section className={styles['slide-container']}>
            <Slide>
                {slideImages.map((slideImage, index) => (
                    <div className="each-slide" key={index}>
                        <div style={{ 'backgroundImage': `url(${slideImage.url})` }}>
                            <span>{slideImage.caption}</span>
                        </div>
                    </div>
                ))}
            </Slide>
        </section>
    );
};

export default Slideshow;