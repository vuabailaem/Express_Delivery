import React, { useState} from "react";
import { FaStar } from "react-icons/fa";
import "../css/StarRating.css";

const StarRating = (props) => {
    const [hover, setHover] = useState(null);
    return(
        <div className="d-inline">
            {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1;
                return(
                <label>
                    <input
                        type="radio"
                        name="rating"
                        value={ratingValue}
                        onClick={ () => props.setRating(ratingValue)}
                    />
                    <FaStar
                        className="star"
                        color={ratingValue <= (hover || props.rating) ? "#ffc107" : "#e4e5e9" }
                        size={18}
                        onMouseEnter={ () => setHover(ratingValue) }
                        onMouseLeave={ () => setHover(null) }
                    />
                </label>
                );
            })}
            {/* <p>The rating is {props.rating}</p> */}
        </div>
    );
};

export default StarRating;