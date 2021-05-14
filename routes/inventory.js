var express = require('express');
var ObjectID = require('mongodb').ObjectID;   
var router = express.Router();
var database = require( '../database' );

// get all inventory
router.get('/', function(req, res, next) {
    database.getDb().collection('inventory').find().toArray(function(err, inventory) {
        res.send(inventory);
    });
});

// get inventory based on id
router.get('/:id', function(req, res, next) {
    database.getDb().collection('inventory').find({_id:ObjectID(req.params.id)}).toArray(function(err, inventory) {
        res.send(inventory);
    });
});

// delete inventory based on id
router.delete('/:id', function(req, res, next) {
    database.getDb().collection('inventory').deleteOne({_id:ObjectID(req.params.id)}).then(result => {
        res.send("deleted inventory");
    })
    .catch(error => console.error(error))
});

// save inventory
router.post('/', function(req, res, next) {
    //TODO: parallelization
    var message = "inventory is updated";
    for(let item of req.body.items){
        let filter = {itemId: item.itemId}
        let update = { $set: {itemId: item.itemId, itemName: item.itemName},  $inc: { quantity: item.quantity}}
        database.getDb().collection('inventory').updateOne(filter, update, {upsert:true})
        .then()
        .catch(error => {
            message = "failed to update inventory";
            console.log(error);
        })
    }
    res.send(message);
    
});

module.exports = router;