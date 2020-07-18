const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const initOptions = {
  error(error, e) {
      if (e.cn) {
          console.log('CN:', e.cn);
          console.log('EVENT:', error.message || error);
      }
  }
};
const pgp = require('pg-promise')(initOptions)

let retries = 5

while (retries !== 0){
  try{
    pgp('postgresql://postgres:postgres@db:5432/products-api')
    .connect()
    .then(() => console.log('connected to db'))
    .catch((error) => console.log('error message --> ', error))
    break
  } catch (err){
    console.log(err)
    retries--
    console.log(`there are ${retries} left`)
  }
}


app.use(cors());


app.get('/', (req, res) => {
  res.send('hello from the server !');
});

const port = 3001;

app.listen(port, () =>
  console.log(`App is listening at http://localhost:${port} ...`)
);
