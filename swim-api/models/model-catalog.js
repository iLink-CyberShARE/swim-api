//contructor
function ModelCatalog() {}

//get all models
ModelCatalog.prototype.GetAll = function(db, callback){
  db.collection("model-catalog").find({}).toArray(function(err, result) {
    if (err) throw err;
    // console.log(JSON.stringify(result));
    callback(result);
  });
};

//get model by id
ModelCatalog.prototype.GetByID = function(db, modelID, callback){
  db.collection("model-catalog").find({'_id': modelID}).toArray(function(err, result) {
    if (err) throw err;
    callback(result);
    });
};




ModelCatalog.prototype.CreateModelCatalog = function(db, document, callback) {
  db.collection("model-catalog").insertOne(document, function(err, result){
    if (err) throw err;
    callback(result);
  });
};

module.exports = ModelCatalog;
