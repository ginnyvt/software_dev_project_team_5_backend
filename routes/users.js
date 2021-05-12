const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const env = require('dotenv');
const axios = require('axios');
env.config();
const { checkJwt } = require('../helpers/check-jwt');
const { checkPermissions } = require('../helpers/permissions');
const { ITEM_PERMISSION } = require('../itemPermission');
const { getAccessToken } = require('../helpers/accessToken');

/**
 * Get a user profile
 * This endpoint contains ID_TOKEN stored with the field name: sub in the response_body.
 * It is a public endpoint so no authentication is needed. Anyone can access it.
 */

// console.log(checkJwt);

router.get('/userprofile', async (req, res) => {
  try {
    const result = await fetch({
      url: `https://${process.env.AUTH0_DOMAIN}/api/v2/userInfo`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
  '/:user_id',

  async (req, res) => {
    const { user_id } = req.params;

    const token = await getAccessToken();

    try {
      const { data } = await axios({
        url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${user_id}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
      });
      // console.log(result);
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }
);

/**
 *
 */
router.patch(
  '/updateprofile',
  checkJwt,
  // checkPermissions(ITEM_PERMISSION.UPDATE_USER),
  async (req, res) => {
    const user_id = req.user.sub;

    let userData = {};
    let given_name;
    let family_name;

    if (req.body.given_name !== '') {
      given_name = req.body.given_name;
    }

    if (req.body.given_name !== '') {
      family_name = req.body.family_name;
    }

    if (req.body.company !== '') {
      userData.company = req.body.company;
    }

    if (req.body.location !== '') {
      userData.location = req.body.location;
    }

    if (req.body.title !== '') {
      userData.title = req.body.title;
    }

    if (req.body.contact_number !== '') {
      userData.contact_number = req.body.contact_number;
    }

    if (req.body.bio !== '') {
      userData.bio = req.body.bio;
    }

    // console.log(userData)
    try {
      const token = await getAccessToken();
      const { data } = await axios({
        url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${user_id}`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        data: {
          given_name: given_name,
          family_name: family_name,
          user_metadata: userData,
        },
      });
      console.log(data);
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      res.sendStatus(500).send(err.message);
    }
  }
);

module.exports = router;
