var express = require('express');
var router = express.Router();
var database = require( '../database' );

// get all orders
router.get('/', function(req, res, next) {
    database.getDb().collection('orders').find().toArray(function(err, result) {
        res.send(result);
    });
});

// get order based on id
router.get('/:orderId', function(req, res, next) {
    database.getDb().collection('orders').find({_id:ObjectID(req.params.orderId)}).toArray(function(err, result) {
        res.send(result);
    });
});

// delete order based on id
router.delete('/:id', function(req, res, next) {
  database.getDb().collection('orders').deleteOne({_id:ObjectID(req.params.id)}).then(result => {
      res.send("deleted order");
  })
  .catch(error => console.error(error))
});

// save order
router.post('/', function(req, res, next) {
  let inventory_transaction_list = [];
  new Promise((resolve, reject) => {
    for(let item of req.body.items){
      let filter = {itemId: item.itemId, quantity: {$gte: item.quantity}}
      let updateDoc = { $inc: { quantity: -item.quantity} };
      database.getDb().collection('inventory').updateOne(filter, updateDoc)
      .then(result => {
        if(result.matchedCount > 0 && result.modifiedCount > 0){
          inventory_transaction_list.push(item);
          if(req.body.items.indexOf(item) == req.body.items.length - 1){
            resolve();
          }
        }
        else{
          for(let transactedItem of inventory_transaction_list){
            filter = {itemId: transactedItem.itemId}
            updateDoc = { $inc: { quantity: transactedItem.quantity} };
            database.getDb().collection('inventory').updateOne(filter, updateDoc)
            .then()
            .catch(error => console.error(error));
          }
          reject(`order cannot be fulfilled as ${item.itemName} is out of stock`);
        }
      })
      .catch(error => {
        res.send(error);
      });
    }
  })
  .then(() => {
    database.getDb().collection('orders').insertOne(req.body)
      .then(res.send("order is fulfilled"))
      .catch(error => res.send(error));
  })
  .catch(error => res.send(error));
});

module.exports = router;