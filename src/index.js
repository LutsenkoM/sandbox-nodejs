const express = require('express');
const userRouter = require('./routers/user');
require('./db/mongoose');

const app = express();
const port = process.env.PORT || 2000;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Content-Type', 'application/json')
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
    return res.status(200).json({});
  }

  next();
});
app.use(userRouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
