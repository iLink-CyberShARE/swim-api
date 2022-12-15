//constructor
function OutputCatalog() {}

//get all outputs
OutputCatalog.prototype.GetAll = function(db, callback){
  const proj = { projection: { } };
  db.collection("output-catalog").find({}, proj).toArray(function(err, result) {
  if (err) throw err;
  //console.log(JSON.stringify(result));
  callback(result);
  });
};

//get outputs by model
OutputCatalog.prototype.GetByModel = function(db, modelID, callback){
  const proj = { projection: { _id: 0} };
  db.collection("output-catalog").find({'modelID': modelID}, proj).toArray(function(err, result) {
    if (err) throw err;
    callback(result);
    });
};

//get output by name
OutputCatalog.prototype.GetByName = function(db, varName, callback){
  const proj = { projection: { _id: 0} };
  db.collection("output-catalog").find({'varName': varName}, proj).toArray(function(err, result) {
    if (err) throw err;
    callback(result);
    });
  };





OutputCatalog.prototype.CreateOutputCatalog = function(db, document, callback) {
  db.collection("output-catalog").insertOne(document, function(err, result){
    if (err) throw err;
      callback(result);
    });
  };




/**
 * Inserts an acronym catalog document into the acronym catalog collection
 * @param {*} db database connection instance
 * @param {*} document acronymn catalog document
 * @param {*} modelID modelID variable
 * @param {*} var_name varName variable
 * @param {*} callback callback function
 */
 OutputCatalog.prototype.UpdateOutputCatalog = function (db, modelID, var_name, document, callback) {
  const proj = { projection: { _id: 0 } };
  db.collection("output-catalog").update({ "modelID" : modelID},{$push: { "varinfo": document}}, function (err, result) {
    if (err) throw err;
    callback(result);
  });
};


module.exports = OutputCatalog;
