const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes')
app.use(cors());
app.use('/', routes)



const port = 3001;

app.listen(port, () =>
  console.log(`App is listening at http://localhost:${port} ...`)
);

