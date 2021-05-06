const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

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


app.use(cors());
app.use(express.json());


app.use('/users', userRoutes);
app.use('/roles', roleRoutes);
app.use('/jobs', jobRoutes);

const connection_url = process.env.MONGO_URL;
console.log(connection_url);

mongoose
  .connect(connection_url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`))
  )
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);
