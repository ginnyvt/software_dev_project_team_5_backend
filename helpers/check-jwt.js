const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const domain = process.env.AUTH0_DOMAIN;

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${domain}/.well-known/jwks.json`,
  }),

  audience: `https://${process.env.AUTH0_DOMAIN}/api/v2`,
  issuer: `https://${domain}/`,
  algorithms: ['RS256'],
});

exports.checkJwt = checkJwt;
