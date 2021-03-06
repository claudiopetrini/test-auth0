'use latest';
import bodyParser from 'body-parser';
import express from 'express';
import Webtask from 'webtask-tools';
import { MongoClient } from 'mongodb';
const collection = 'my-collection';
const server = express();
server.use(bodyParser.json());
server.get('/:id', (req, res, next) => {
  const { MONGO_URL } = req.webtaskContext.data;
  const { id } = req.params;
  MongoClient.connect(MONGO_URL, (err, db) => {
    if (err) return next(err);
    db.collection(collection).findOne({ id }, (err, result) => {
      db.close();
      if (err) return next(err);
      res.status(200).send(result);
    });
  });
});
console.log('aasdasd');
server.post('/', (req, res, next) => {
  const { MONGO_URL } = req.webtaskContext.data;
  // Do data sanitation here.
  const model = req.body;
  MongoClient.connect(MONGO_URL, (err, db) => {
    if (err) return next(err);
    db.collection(collection).insertOne(model, (err, result) => {
      db.close();
      if (err) return next(err);
      res.status(201).send(result);
    });
  });
});
module.exports = Webtask.fromExpress(server);
