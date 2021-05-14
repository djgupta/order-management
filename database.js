const MongoClient = require( 'mongodb' ).MongoClient;
const csvtojson = require("csvtojson");
const url = "mongodb://localhost:27017";

var _db;
var _client;

module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect( url,  { useNewUrlParser: true, useUnifiedTopology: true }, function( err, client ) {
      _client = client;
      _db  = client.db('order-management');
      return callback( err );
    } );
  },

  getDb: function() {
    return _db;
  },

  reload: function(){
    let collections =['items', 'orders', 'inventory']
    for(let collection of collections){
      _db.dropCollection(collection, function(err, result) {
        _db.createCollection(collection, function(err1, result1) {
          console.log("create "+collection);
          if(collection=='items'){
            csvtojson()
              .fromFile("public/csv/items.csv")
              .then(csvData => {
                _db.collection('items').insertMany(csvData, (err, res) => {
                  if (err) throw err;
                  console.log(`Inserted: ${res.insertedCount} rows`);
                });
          })
        }});
      });
      
    }
  },

  session: function(){
    return _client.startSession();
  }
};