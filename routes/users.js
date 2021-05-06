const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const env = require("dotenv");
env.config();
const { checkJwt } = require('./helpers/check-jwt');
const { checkPersmissions } = require("../helpers/permissions");
const { ITEM_PERMISSION } = require("../itemPermission");
const { getAccessToken } = require("../helpers/accessToken");

/**
 * Get a user profile
 * This endpoint contains ID_TOKEN stored with the field name: sub in the response_body.
 * It is a public endpoint so no authentication is needed. Anyone can access it.
 */

router.get("/userprofile", async (req, res) => {
  try {
    const result = await fetch({
      url: `https://${process.env.AUTH0_DOMAIN}/api/v2/userInfo`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${getAccessToken}`,
      },
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * Get a users details including meta-data
 * This endpoint is used to retrieve a user details.
 */
router.get(
  "/user",

  async (req, res) => {
    try {
      const result = await fetch({
        url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${user_id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${getAccessToken}`,
        },
      });
      res.status(200).json(result);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);
app.use(checkJwt)
/**
 *
 */
router.post(
  "/updateprofile",
  checkPersmissions(ITEM_PERMISSION.UPDATE_USER),
  async (req, res) => {
    try {
      const result = await fetch({
        url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${user_id}`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          given_name: req.body.firstname,
          family_name: req.body.lastname,
          user_metadata: {
            company: req.body.company,
            title: req.body.title,
            contact_number: req.body.contact_number,
            bio: req.body.bio,
          },
        }),
      });
      res.status(200).json(result);
    } catch (err) {
      res.sendStatus(500).send(err.message);
    }
  }
);

module.exports = router;
