var express = require('express');
var router = express.Router();
var database = require( '../database' );
var ObjectID = require('mongodb').ObjectID;   

// query items
router.post('/query', function(req, res, next) {
    // pagination
    if(req.body.page == null || req.body.size == null){
        let response = {"error" : true, "message" : "page and size should be provided"};
        return res.json(response)
    }
    let page = parseInt(req.body.page);
    let size = parseInt(req.body.size);
    
    if(page == null || page == "" || page < 0 || page === 0) {
        let response = {"error" : true,"message" : "invalid page number, should start with 1"};
        return res.json(response)
    }

    let skip = 0
    if(page > 1){
        skip = ((page-1) * size);
    }

    // with sorting
    if(req.body.sort != null){
        database.getDb().collection('items').find(req.body.search, {limit: size, skip: skip}).sort(req.body.sort).toArray(function(err, result) {
            res.send(result);
        });
    }
    else{
        // without sorting
        database.getDb().collection('items').find(req.body.search, {limit: size, skip: skip}).toArray(function(err, result) {
            res.send(result);
        });
    }
});

// get all items
router.get('/', function(req, res, next) {
    database.getDb().collection('items').find().toArray(function(err, items) {
        res.send(items);
    });
});

// get item based on id
router.get('/:id', function(req, res, next) {
    database.getDb().collection('items').find({_id:ObjectID(req.params.id)}).toArray(function(err, items) {
        res.send(items);
    });
});

// replace item based on id
router.put('/:id', function(req, res, next) {
    database.getDb().collection('items').replaceOne({_id:ObjectID(req.params.id)}, req.body).then(result => {
        res.send(result.ops);
    })
    .catch(error => res.send("failure in replacement"));
});

// delete item based on id
router.delete('/:id', function(req, res, next) {
    database.getDb().collection('items').deleteOne({_id:ObjectID(req.params.id)}).then(result => {
        res.send("deleted item");
    })
    .catch(error => res.send(error))
});

// save item
router.post('/', function(req, res, next) {
    database.getDb().collection('items').insert(req.body)
    .then(result => {
        res.send(result.ops);
    })
    .catch(error => res.send(error))
});

module.exports = router;
