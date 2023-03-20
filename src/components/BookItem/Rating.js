import ReactStars from 'react-rating-stars-component';

const Rating = ({ rating, canRate, onRatingChange }) => {
    const ratingChange = (newRating) => {
        onRatingChange(newRating);
    };

    return (
        <ReactStars
            key={`stars_${rating}`}
            count={5}
            onChange={ratingChange}
            size={24}
            isHalf={true}
            emptyIcon={<i className="far fa-star"></i>}
            halfIcon={<i className="fa fa-star-half-alt"></i>}
            fullIcon={<i className="fa fa-star"></i>}
            activeColor="#ffd700"
            value={rating}
            edit={canRate}
        />
    );
};

export default Rating;
