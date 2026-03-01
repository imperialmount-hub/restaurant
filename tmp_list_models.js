const API_KEY = "AIzaSyAQvD6LT7KlMqO3QNQZb-aZRsoln0Qjpw0";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function getAvailableModels() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

getAvailableModels();
