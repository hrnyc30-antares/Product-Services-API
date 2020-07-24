const express = require('express');
const app = express();
const cors = require('cors');
const initOptions = {
  error(error, e) {
    if (e.cn) {
      console.log('CN:', e.cn);
      console.log('EVENT:', error.message || error);
    }
  },
};
const pgp = require('pg-promise')(initOptions);

let db = pgp('postgresql://postgres:postgres@pg:5432/products-api');

app.use(cors());

app.get('/products/list', (req, res) => {
  db.any('select * from products_info limit 5')
    .then((data) => res.status(200).send(JSON.parse(JSON.stringify(data))))
    .catch((err) => {
      console.log('error -->', err);
      res.sendStatus(500);
    });
});

app.get('/products/:id', (req, res) => {
  const id = req.params.id;
  db.any(`select * from products_info where id = ${id}`)
    .then((data) => {
      db.any(`select * from features where id = ${id}`)
        .then((featureData) => {
          featureData.forEach((el) => delete el.id);
          data[0]['features'] = featureData;
          res.status(200).send(JSON.parse(JSON.stringify(data[0])));
        })
        .catch((error) => console.log('error-->', error));
    })
    .catch((error) => {
      console.log('error message -->', error);
      res.sendStatus(500);
    });
});

app.get('/products/:id/styles', (req, res) => {
  const id = req.params.id;
  let result = {
    product_id: id,
    results: []
  }

//=============================================
//query call for styles  
  db.any(`select * from styles where product_id = ${id}`)
  .then(data => {
    data.forEach((el) => {
      if(el.sale_price === 'null') el.sale_price = "0"
      delete el.product_id
//====================================================
      //query call for photos
      db.any(`select * from photos where style_id = ${el.style_id}`)
      .then(photoData => {
        photoData.forEach(val => delete val.style_id)
        if(photoData.length === 0){
          photoData = [
            {
              "thumbnail_url": null,
              "url": null
            }
          ]
        }
        el['photos'] = photoData
//=====================================================
        //query call for skus
        db.any(`select * from skus where style_id = ${el.style_id}`)
        .then(skuData => {
          let skuObj = {}
          skuData.forEach(value => skuObj[value.size] = value.qty)
          if(skuData.length === 0){
            skuObj['null'] = null
          }
          el['skus'] = skuObj

//=======================================================          
          result.results.push(el)
          if(result.results.length === data.length){
            result.results.sort((a,b) => a.style_id - b.style_id)
            res.status(200).send(JSON.parse(JSON.stringify(result)))
          }
        })
        .catch(error => console.log('skus error -->', error))
      })
      .catch(error => console.log('photos error -->', error))
    })
  })
  .catch(error => {
    console.log('styles error message --> ', error)
    res.sendStatus(500)
  })
});

app.get('/products/:id/related', (req, res) => {
  const id = req.params.id;
  let results = [];
  db.any(`SELECT * FROM related WHERE current_id = ${id}`)
    .then((data) => {
      data.forEach((el) => {
        results.push(el.related_id);
      });
      res.status(200).send(JSON.parse(JSON.stringify(results)));
    })
    .catch((error) => {
      console.log('error -->', error);
      res.sendStatus(500);
    });
});

const port = 3001;

app.listen(port, () =>
  console.log(`App is listening at http://localhost:${port} ...`)
);
