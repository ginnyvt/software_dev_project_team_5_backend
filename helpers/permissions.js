const jwtAuthz = require("express-jwt-authz");

exports.checkPermissions = (permissions) => {
    return jwtAuthz([permissions], {
      customScopeKey: "permissions",
      checkAllScopes: true,
      failWithError: true
    });
  };