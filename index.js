const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

// Import routers
const userRoutes = require('./routes/users');
const roleRoutes = require('./routes/roles');
const jobRoutes = require('./routes/jobs');

app.use(cors());
app.use(bodyParser.json());

app.use('/users', userRoutes);
app.use('/roles', roleRoutes);
app.use('/jobs', jobRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
