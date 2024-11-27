// RestaurantsContainer.js
import React, { useState } from 'react';
import {fetchAllRestaurants} from "../scripts";
import RestaurantPage from "./RestaurantPage";

const RestaurantsContainer = () => {
    const [allRestaurants, setAllRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    const [viewMenu, setViewMenu] = useState(false); // New state for menu view
    const [error, setError] = useState(null);

    const viewAllRestaurants = async () => {
        setLoading(true);
        setError(null); //

        try {
            const response = await fetchAllRestaurants()
            //console.log(response);
            //console.log(result);
            //console.log(Array.isArray(response));
            const finalResult = await setRestaurants(response);
            // console.log(finalResult)
            setAllRestaurants(finalResult);
        } catch (error) {
            console.error("Failed to fetch restaurants:", error);
            setError('Failed to load restaurants. Please try again.');
        }
        setLoading(false);

    };

    const setRestaurants = async (response) => {
        const {metaData, rows} = response.result;

        const columns = metaData.map(col => col.name);
        //console.log(metaData)

        return rows.map(row =>
            columns.reduce((acc, col, index) => {
                acc[col] = row[index];
                return acc;
            }, {})
        );

    }
    return (
        <div className="restaurants-container">
            {selectedRestaurant ? (
                <RestaurantPage restaurant={selectedRestaurant} />
            ) : (
                <>
                    <button onClick={viewAllRestaurants}>View All Restaurants</button>

                    {loading && <p>Loading...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    {allRestaurants.length > 0 && (
                        <ul>
                            {allRestaurants.map((restaurant, index) => (
                                <li key={index}>
                                    <p>{restaurant.LOCATION_NAME}</p>
                                    <button onClick={() => setSelectedRestaurant(restaurant)}>
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => {
                                          setSelectedRestaurant(restaurant);
                                          setViewMenu(true); // Activate menu view
                                        }}>
                                        View Menu
                                    </button>   
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
};

export default RestaurantsContainer;
