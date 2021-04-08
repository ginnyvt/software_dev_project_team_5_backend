const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/all", controller.AllUsers);

  app.get(
    "/api/employee",
    [authJwt.verifyToken, authJwt.isEmployee],
    controller.employeeProfile
  );
  app.get(
    "/api/employer",
    [authJwt.verifyToken, authJwt.isEmployer],
    controller.EmployerProfile
  );
};
