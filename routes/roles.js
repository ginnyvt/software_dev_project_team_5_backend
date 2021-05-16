const express = require('express');
const router = express.Router();
const { checkJwt } = require('../helpers/check-jwt');
const { checkRoles } = require('../helpers/checkRoles');
const { getAccessToken } = require('../helpers/accessToken');
const axios = require('axios');

router.get('/', checkJwt, async (req, res) => {
  const userId = req.user.sub;
  try {
    const token = await getAccessToken();
    const { data } = await axios({
      url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}/roles`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    });
    res.status(200).json({
      error: false,
      message: 'Roles successfully retrieved.',
      result: data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

router.post('/assign', checkJwt, async (req, res) => {
  const type = req.query.type;
  const userId = req.user.sub;

  const roleIds = [
    { name: 'employee', id: 'rol_55ArvdaT3B7197J5' },
    { name: 'employer', id: 'rol_2oPl2vp4dIggB8sQ' },
  ];

  // Check if a user already have a role
  let isRoleExist;

  try {
    const token = await getAccessToken();
    const { data } = await axios({
      url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}/roles`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    });

    if (data.length > 0) {
      data.forEach((role) => {
        if (role.name === 'employer' || role.name === 'employee') {
          isRoleExist = true;
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }

  if (isRoleExist) {
    res.status(500).json({
      error: true,
      message: 'User already assigned employer/employee role',
    });
  }
  // Assign roles to a user
  let assignRole;

  if (type === 'employer') {
    assignRole = roleIds[1].id;
  } else {
    assignRole = roleIds[0].id;
  }

  try {
    const token = await getAccessToken();
    const response = await axios({
      url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}/roles`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      data: { roles: [assignRole] },
    });
    // console.log(response);
    res.status(200).json({
      error: false,
      message: 'Roles successfully associated with user.',
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
