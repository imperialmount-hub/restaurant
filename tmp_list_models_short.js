const API_KEY = "AIzaSyAQvD6LT7KlMqO3QNQZb-aZRsoln0Qjpw0";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function getAvailableModels() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        const models = data.models.slice(0, 50).map(m => m.name);
        console.log(JSON.stringify(models, null, 2));
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

getAvailableModels();
