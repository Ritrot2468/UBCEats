
import React, {useEffect, useState} from 'react';
import {fetchAllRestaurants} from "../scripts";
import RestaurantPage from "./RestaurantPage";
import '../css/RestaurantPage.css';

const RestaurantsContainer = () => {
    const [allRestaurants, setAllRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRestaurant] = useState(null);

<<<<<<< HEAD
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
=======
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);

    const [tempFilters, setTempFilters] = useState({
        cuisine: '',
        minRating: '',
        maxPrice: ''
    });
>>>>>>> c8a26c21f1a1d88ea779be5b5fa59db0edd5cab7

    // Final state for filters applied on "Submit"
    const [filters, setFilters] = useState({
        cuisine: '',
        minRating: '',
        maxPrice: ''
    });

    useEffect(() => {
        const viewAllRestaurants = async () => {
            setLoading(true);

            try {
                const response = await fetchAllRestaurants()
                const finalResult = await setRestaurants(response);
                setAllRestaurants(finalResult);
                setFilteredRestaurants(finalResult);
            } catch (error) {
                console.error("Failed to fetch restaurants:", error);
            }
            setLoading(false);

        };
            viewAllRestaurants()
    }, []);

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

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setTempFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value
        }));
    };

    // Apply filters when the user clicks "Submit"
    const applyFilters = () => {
        setFilters(tempFilters);
    };

    // Update displayed restaurants based on filters
    useEffect(() => {
        const filtered = allRestaurants.filter((restaurant) => {
            const matchesCuisine = filters.cuisine
                ? restaurant.CUISINE_TYPE.toLowerCase().includes(filters.cuisine.toLowerCase())
                : true;
            const matchesRating = filters.minRating
                ? parseFloat(restaurant.AVERAGE_RATING) >= parseFloat(filters.minRating)
                : true;
            const matchesPrice = filters.maxPrice
                ? parseFloat(restaurant.AVERAGE_PRICE) <= parseFloat(filters.maxPrice)
                : true;

            return matchesCuisine && matchesRating && matchesPrice;
        });
        setFilteredRestaurants(filtered);
    }, [filters, allRestaurants]);


    return (
        <div className="restaurants-container">
            {selectedRestaurant ? (
                <RestaurantPage restaurant={selectedRestaurant} />
            ) : (
<<<<<<< HEAD
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
=======
                <div className="flex gap-4 p-4">
                    <aside className="w-64 bg-gray-100 p-4 rounded-lg shadow">
                        <h3 className="text-lg contain-style flex align-middle font-extrabold font-mono mb-4 text-center">Filter Restaurants</h3>
                        <div>
                            <label className="text-ellipsis contain-style font-mono">Cuisine Type</label>
                            <input
                                type="text"
                                name="cuisine"
                                value={tempFilters.cuisine}
                                onChange={handleFilterChange}
                                placeholder="e.g., Italian, Cafe"
                            />
                        </div>
                        <div>
                            <label className="text-ellipsis contain-style font-mono">Minimum Rating</label>
                            <input
                                type="number"
                                name="minRating"
                                value={tempFilters.minRating}
                                onChange={handleFilterChange}
                                placeholder="e.g., 4.0"
                                step="0.1"
                            />
                        </div>
                        <div>
                            <label className="text-ellipsis contain-style font-mono">Maximum Price</label>
                            <input
                                type="number"
                                name="maxPrice"
                                value={tempFilters.maxPrice}
                                onChange={handleFilterChange}
                                placeholder="e.g., 50"
                            />
                        </div>
                        <button className="text-ellipsis space-x-3 text-lg font-extrabold font-mono" onClick={applyFilters}>Submit</button>
                    </aside>
                    <main className="restaurant-list-container">
                        {loading && <p>Loading...</p>}
                        {filteredRestaurants.length > 0 ? (
                            <ul className="restaurant-list">
                                {filteredRestaurants.map((restaurant, index) => (
                                    <li key={index} className="restaurant-item">
                                        <h3 className="text-lg font-extrabold">{restaurant.LOCATION_NAME}</h3>
                                        <p className={"italic font-thin"}> {restaurant.CUISINE_TYPE}</p>
                                        <p>Average Rating: {parseFloat(restaurant.AVERAGE_RATING).toFixed(1)}</p>
                                        <p>Average Price: {restaurant.AVERAGE_PRICE}</p>
                                        <p>Phone Number: {restaurant.PHONE_NUMBER}</p>
                                        <p>Address: {restaurant.STREET_ADDRESS}, {restaurant.CITY}, {restaurant.PROVINCE_OR_STATE}, {restaurant.POSTAL_CODE}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            !loading && <p>No restaurants match your criteria.</p>
                        )}
                    </main>
                </div>
>>>>>>> c8a26c21f1a1d88ea779be5b5fa59db0edd5cab7
            )}
        </div>
    );
};

export default RestaurantsContainer;
