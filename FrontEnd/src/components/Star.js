import React, { useState} from "react";
import { FaStar } from "react-icons/fa";
import "../css/StarRating.css";

const Star = (props) => {
    return(
        <div className="d-inline">
            {[...Array(props.starsCount)].map((star, index) => {
                return(
                <label>
                    <FaStar
                        className="star"
                        color="#ffc107"
                        size={18}
                    />
                </label>
                );
            })}
        </div>
    );
};

export default Star;