import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {getRestaurantMenu} from "../scripts";
// import FindFood from './FindFood';
import '../css/MenuPage.css'

const MenuPage = () => {
    const [consolidatedItems, setConsolidatedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { location_name, lat, lon } = useParams();
    // const [filteredItems, setFilteredItems] = useState([]);

    // Consolidate menu items with the same name, description, and price
    const consolidateMenuItems = (items) => {
        // Convert each item to an object
        const itemsAsObjects = items.map(item => {
            return {
                name: item[0],
                description: item[1],
                price: item[2],
                diet: item[4],
                allergens: item[4]
            };
        });

        const consolidated = itemsAsObjects.reduce((menu, item) => {
            const { name, description, price, diet, allergens } = item;

            // Find if there's already a group with the same name, description, and price
            const existingItem = menu.find(
                (entry) => entry.name === name && entry.description === description && entry.price === price
            );

            if (existingItem) {
                if (diet && !existingItem.diet.includes(diet)) {
                    existingItem.diet.push(diet);
                }
                if (allergens && !existingItem.allergens.includes(allergens)) {
                    existingItem.allergens.push(allergens);
                }
            } else {
                // Create a new entry
                menu.push({
                    name,
                    description,
                    price,
                    diet: diet ? [diet] : [],
                    allergens: allergens ? [allergens] : []
                });
            }
            return menu;
        }, []);
        return consolidated;
    };

    // Fetch the menu when the component mounts or the params change
    useEffect(() => {
        const fetchMenu = async () => {
            setLoading(true);
            setError(null);

            try {
                // console.log(location_name);
                const menuItems = await getRestaurantMenu(location_name, lat, lon);
                const consolidatedItems = await consolidateMenuItems(menuItems.result);
                setConsolidatedItems(consolidatedItems);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (location_name && lat && lon) {
            fetchMenu();
        }
    }, [location_name, lat, lon]);

    // Render loading state
    if (loading) {
        return <p>Loading menu...</p>;
    }

    // Render error state
    if (error) {
        return <p style={{ color: 'red' }}>Error: {error}</p>;
    }

    return (
        <main className="menu-list-container">
            <h1 style={{ marginBottom: '1em'}} className="text-3xl font-extrabold font-mono">Menu: {location_name}</h1> 
                {consolidatedItems.length > 0 ? (
                    <ul className="menu-list">
                        {consolidatedItems.map((item, index) => (
                            <li key={index} className="menu-item">
                                <h3 className="text-lg font-extrabold">{item.name}</h3>
                                <p style={{fontWeight: 'bold', marginBottom: '12px'}}>
                                    {item.price != null ? `Price: $${item.price.toFixed(2)}` : "Price: N/A"}
                                </p>
                                <p style={{marginBottom: '12px'}}>{item.description}</p>
                                {item.diet && item.diet.length > 0 && (
                                    <div>
                                        <p><strong>Dietary Info:</strong> {item.diet.join(', ')}</p>
                                    </div>
                                )}
                                {item.allergens && item.allergens.length > 0 && (
                                    <div>
                                        <p><strong>Allergens:</strong> {"Contains " + item.allergens.join(', ')}</p>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>    
                ) : (
                    <p>No menu items available for this location.</p>
                )}
            <Link to="/restaurants" className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded font-mono">
                Back to Restaurants
            </Link>
        </main>
    );
};

export default MenuPage;