const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose')
const initOptions = {
  error(error, e) {
    if (e.cn) {
      console.log('CN:', e.cn);
      console.log('EVENT:', error.message || error);
    }
  }
};
const pgp = require('pg-promise')(initOptions)

mongoose.connect("mongodb://mongo:27017/products-api", { useNewUrlParser: true })
.then(() => console.log('connected to mongo'))
.catch((err) => console.log(err))

pgp('postgresql://postgres:postgres@pg:5432/products-api')
.connect()
.then(() => console.log('connected to postgres'))
.catch((error) => {
  console.log('error message --> ', error)
})


app.use(cors());


app.get('/', (req, res) => {
  res.send('hello from the server !');
});

const port = 3001;

app.listen(port, () =>
  console.log(`App is listening at http://localhost:${port} ...`)
);
