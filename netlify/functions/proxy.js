const fetch = require('node-fetch');
const fetchCookie = require('fetch-cookie');
const { JSDOM } = require('jsdom');

const fetchWithCookies = fetchCookie(fetch);

exports.handler = async function (event, context) {
  try {
    const baseUrl = 'https://admediatex.net/serve/';
    const step1Url = `${baseUrl}fv.php?var1=971&var2=https%3A%2F%2Fstep11110.blogspot.com%2F&var3=cbdaaffbbc&var4=1750854851`;

    // Send first POST request to initialize session
    const step1Response = await fetchWithCookies(step1Url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      body: '1=1'
    });

    if (!step1Response.ok) {
      throw new Error(`First request failed: ${step1Response.statusText}`);
    }

    const html = await step1Response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Extract the redirect-form
    const form = document.querySelector('form#redirect-form');
    if (!form) {
      throw new Error('redirect-form not found in first response');
    }

    // Extract action URL for second POST request
    let action = form.getAttribute('action');
    if (!action.startsWith('http')) {
      action = baseUrl + action;
    }

    // Extract all hidden inputs
    const inputs = form.querySelectorAll('input[type="hidden"]');
    const formData = new URLSearchParams();

    inputs.forEach((input) => {
      const name = input.getAttribute('name');
      let value = input.getAttribute('value');
      if (name === 'con') value = 'US';
      formData.append(name, value);
    });

    // Send second POST request with form data and cookies
    const step2Response = await fetchWithCookies(action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      body: formData.toString()
    });

    if (!step2Response.ok) {
      throw new Error(`Second request failed: ${step2Response.statusText}`);
    }

    const finalHtml = await step2Response.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*'
      },
      body: finalHtml
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};