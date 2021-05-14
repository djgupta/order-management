var express = require('express');
var router = express.Router();
var database = require( '../database' );

// get all items
router.get('/reload', function(req, res, next) {
    database.reload();
    res.send("reloaded")
});

module.exports = router;