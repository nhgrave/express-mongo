const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const config = require("./config");
const consultas = require("./consultas");

app.set('view engine', 'pug');

app.listen(config.PORT, () => {
  console.log(`listening on ${config.PORT}`);
});

//===== DATABASE CLIENT
const URI = config.DB_URI;
const DB_NAME = config.DB;

const getDBConnection = () => {
  return MongoClient.connect(URI, { useUnifiedTopology: true })
    .then(client => {
      console.log('Connected to Database');
      return client.db(DB_NAME);
    }).catch(error => console.log(error));
}

const executeAggregate = (collectionName, query, callback) => {
  return getDBConnection()
    .then(db => {
      console.log(`=== Execute aggregate on ${collectionName}: ${JSON.stringify(query)}`);
      const collection = db.collection(collectionName);

      collection.aggregate(query, { allowDiskUse: true }).toArray()
        .then(callback);

    }).catch(error => console.log(error));
}
//===== DATABASE CLIENT

//===== ROUTES
app.get('/', (req, res) => {
  const consultaString = req.query.consulta;

  const consulta = consultas.filter(_consulta => _consulta.id === consultaString)[0];

  if (consulta !== undefined) {
    const startAt = new Date();
    executeAggregate(consulta.collection, consulta.query, (result) => {
      const endAt = new Date();
      const time = (endAt - startAt) / 1000;

      res.render("index", { consultaAtual: consulta, consultas, result, time });
    });
  } else {
    res.render("index", { consultas });
  }
});
//===== ROUTES
