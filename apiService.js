// JavaScript Example: Reading Entities
// Filterable fields: title, category, impact_score, notes, date
async function fetchActivityEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/68558b5689d96e9d198fe22c/entities/Activity`, {
        headers: {
            'api_key': '10d9e9d33a504b25a445ef34c2daf0ca', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: title, category, impact_score, notes, date
async function updateActivityEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/68558b5689d96e9d198fe22c/entities/Activity/${entityId}`, {
        method: 'PUT',
        headers: {
            'api_key': '10d9e9d33a504b25a445ef34c2daf0ca', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    console.log(data);
}