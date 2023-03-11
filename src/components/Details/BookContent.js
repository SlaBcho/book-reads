import styles from './Details.module.css';

import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';


const BookContent = ({book}) => {
    const slideImages = [
        {
            url: `/img/${book.name}/page1.jpg`,
        },
        {
            url: `/img/${book.name}/page2.jpg`,
        },
        {
            url: `/img/${book.name}/page3.jpg`,
        },
        {
            url: `/img/${book.name}/page4.jpg`,
        },
        {
            url: `/img/${book.name}/page5.jpg`,
        }
    ];
    return (
            <div className={styles['slide-content']}>
                <Slide>
                    {slideImages.map((slideImage, index) => (
                        <div className="each-slide" key={index}>
                            <div style={{ 'backgroundImage': `url(${slideImage.url})` }}>
                                <span>{slideImage.caption}</span>
                            </div>
                        </div>
                    ))}
                </Slide>
            </div>
    );
};

export default BookContent;