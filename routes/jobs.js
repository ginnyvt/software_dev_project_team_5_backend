const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send(`Hello from Jobs's routes`);
});

module.exports = router;
