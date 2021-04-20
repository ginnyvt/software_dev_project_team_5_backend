const axios = require('axios');

const domain = process.env.AUTH0_DOMAIN;
const clientId = process.env.API_MANAGEMENT_CLIENT_ID;
const clientSecret = process.env.API_MANAGEMENT_CLIENT_SECRET;

const config = {
  method: 'POST',
  url: `https://${domain}/oauth/token`,
  headers: {
    'content-type': 'application/json',
  },
  data: {
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    audience: `https://${domain}/api/v2/`,
  },
};

const getAccessToken = async () => {
  try {
    const response = await axios(config);
    return response.data.access_token;
  } catch (err) {
    console.log(err);
  }
};

exports.getAccessToken = getAccessToken;
