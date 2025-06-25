exports.handler = async (event) => {
    const axios = require('axios');
    const baseUrl = 'https://admediatex.net/serve/';
    const fcUrl = `${baseUrl}fc.php`;

    try {
        const body = JSON.parse(event.body);
        const response = await axios.post(fcUrl, body, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        // Assuming the response may contain a redirect URL
        return {
            statusCode: 200,
            body: JSON.stringify({ redirect: response.data.redirect || 'https://www.google.com' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};