const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 8000;
const corsOption = {
  origin: process.env.CLIENT_ORIGIN_URL // remember to add the client origin url
}
const app = express();

// Import routers
const userRoutes = require('./routes/users');
const roleRoutes = require('./routes/roles');
const jobRoutes = require('./routes/jobs');
const { checkJwt } = require('./helpers/check-jwt');

app.use(cors());
app.use(express.json());

app.use(checkJwt)
app.use('/users', userRoutes);
app.use('/roles', roleRoutes);
app.use('/jobs', jobRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
