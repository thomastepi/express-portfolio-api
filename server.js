require('dotenv').config();
const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const app = express();

app.use(cors(corsOptions));
const port = process.env.PORT || 5000;


require('./config/database');
const userRoute = require('./routes/resumeUser.route');

app.use(express.json());
app.use('/api/user', userRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});