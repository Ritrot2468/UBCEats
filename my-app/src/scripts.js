/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


// This function checks the database connection and updates its status on the frontend.
export async function checkDbConnection() {
    const response = await fetch('/check-db-connection', {
        method: "GET"
    });
    return await response.text();
}

//HEDIE'S
export async function fetchAndDisplayUsersHedie() {
    const tableElement = document.getElementById('usertable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/usertable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const usertableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    usertableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// This function resets or initializes the demotable.
export async function resetDemotable() {
    const response = await fetch("/initiate-demotable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "demotable initiated successfully!";
        fetchTableData();
        resetAllTables();
    } else {
        alert("Error initiating table!");
    }
}

// HEDIE'S
export async function resetUsertable() {
    const response = await fetch("/initiate-usertable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "usertable initiated successfully!";
        fetchTableData();
        resetAllTables();
    } else {
        alert("Error initiating table!");
    }
}

// This function resets or initializes the demotable.
export async function resetAllTables() {
    const response = await fetch("/initiate-all-tables", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "all tables initiated successfully!";
        fetchTableData();
        
    } else {
        alert("Error initiating table!");
    }
}

// Inserts new records into the demotable.
export async function insertDemotable(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertId').value;
    const nameValue = document.getElementById('insertName').value;

    const response = await fetch('/insert-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            name: nameValue
        })
    });
}

// HEDIE'S
export async function insertUsertable(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertId').value;
    const nameValue = document.getElementById('insertName').value;

    const response = await fetch('/insert-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            name: nameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}
// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
export async function countDemotable() {
    const response = await fetch("/count-demotable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
    } else {
        alert("Error in count demotable!");
    }
}

// Updates names in the demotable.
export async function updateNameDemotable(event) {
    event.preventDefault();

    const oldNameValue = document.getElementById('updateOldName').value;
    const newNameValue = document.getElementById('updateNewName').value;

    const response = await fetch('/update-name-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldName: oldNameValue,
            newName: newNameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateNameResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Name updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating name!";
    }
}


// List restaurant locations based on given restaurant
export async function findRestaurantInfo(event) {
    event.preventDefault();

    const restaurantNameValue = document.getElementById('restaurantName').value;
    const url =`/find-restaurants?restaurantName=${encodeURIComponent(restaurantNameValue)}`;

    const response = await fetch(url, {
        method: 'GET'
    });
    const responseData = await response.json();
    console.log(responseData)
    const messageElement = document.getElementById('restaurantInfoMsg');

    if (responseData.success) {
        messageElement.textContent = "Found Restaurant Successfull!";
        //fetchTableData();
    } else {
        messageElement.textContent = "Restaurant not found";
    }
}

//TODO
// export async function updateUserReview(event) {
//     event.preventDefault();
// /// Have FRONT END ENSURE IF RATING IS BEING CHANGED THAT ONLY THE NUMBER VALUE IS BETWEEN 0 -5
// /// AND CONTENT CHAR LENGTH < 200 char
//     const oldContent = document.getElementById('....').value;
//     const newContent = document.getElementById('.....').value;
//
//     const response = await fetch('/update-review-content', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             newContent: newContent,
//             oldContent: oldContent,
//             columnName: columnName,
//             username: userName,
//             restLong: restLong,
//             restLat: restLat
//         })
//     });
//
//     const responseData = await response.json();
//     const messageElement = document.getElementById('updateNameResultMsg');
//
//     if (responseData.success) {
//         messageElement.textContent = "Name updated successfully!";
//         fetchTableData();
//     } else {
//         messageElement.textContent = "Error updating name!";
//     }
// }
//



// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.


// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
export function fetchTableData() {
    fetchAndDisplayUsers();
    fetchAndDisplayUsersHedie();

}
