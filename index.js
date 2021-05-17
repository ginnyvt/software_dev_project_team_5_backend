const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// const mongoose = require('mongoose');

dotenv.config();

const PORT = process.env.PORT || 8000;
// remember to add the client origin url
// const corsOption = {
//   origin: process.env.CLIENT_ORIGIN_URL
// }
const app = express();

// mongoose connection
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.set("useFindAndModify", false);
const db_host = process.env.DB_HOST;

mongoose
  .connect(db_host, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB.");
  })
  .catch((err) => {
    console.log("Connection error", err);
    process.exit();
  });


// Import routers
const userRoutes = require('./routes/users');
const jobRoutes = require('./routes/jobs');

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/roles', roleRoutes);
app.use('/jobs', jobRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
