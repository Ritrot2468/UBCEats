import React, { useState, useEffect } from 'react';

const RestaurantMenu = ({ restaurantId }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const host = 'http://localhost:50001'

  // Fetch the menu when the component mounts or the restaurantId changes
  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${host}/${restaurantId}/menu`);
        if (!response.ok) {
          throw new Error(`Error fetching menu: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setMenuItems(data.result || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchMenu();
    }
  }, [restaurantId]);

  // Render loading state
  if (loading) {
    return <p>Loading menu...</p>;
  }

  // Render error state
  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  // Render menu items
  return (
    <div>
      <h1>{restaurantId}: Restaurant Menu</h1>
      {menuItems.length === 0 ? (
        <p>No menu items available for this restaurant.</p>
      ) : (
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>Price: ${item.price}</p>
              {item.allergens && <p>Allergens: {item.allergens}</p>}
              {item.dietary_restrictions && <p>Dietary Info: {item.dietary_restrictions}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RestaurantMenu;
