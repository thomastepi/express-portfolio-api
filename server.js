require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors({
  origin: 'https://resume-craft.onrender.com',
  credentials: true

}));
const port = process.env.PORT || 5000;
require('./config/database');
const userRoute = require('./routes/resumeUser.route');

app.use(express.json());
app.use('/api/user', userRoute);

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});