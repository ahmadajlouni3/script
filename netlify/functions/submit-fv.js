exports.handler = async (event) => {
    const axios = require('axios');
    const baseUrl = 'https://admediatex.net/serve/';
    const fvUrl = `${baseUrl}fv.php?var1=971&var2=https%3A%2F%2Fwww.google.com&var3=ebbfedfcecab&var4=1750870828`;

    try {
        const response = await axios.post(fvUrl, { '1': '1' }, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};