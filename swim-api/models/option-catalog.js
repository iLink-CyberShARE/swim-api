// constructor
function OptionCatalog() {}

// get by type and model
OptionCatalog.prototype.GetByModelnType = function(db, modelID, type, callback){
  const proj = { projection: { _id: 0 } };
  db.collection("options").find({'modelID': modelID, 'type': type}, proj).toArray(function(err, result) {
    if (err) throw err;
    callback(result);
    });
};

/**
 * Insert option catalog
 * @param {*} db database connection instance
 * @param {*} document option catalog document
 * @param {*} callback callback function
 */
//update model by scenario id
OptionCatalog.prototype.CreateOptionCatalog = function(db, document, callback) {
  db.collection("options").insertOne(document, function(err, result){
    if (err) throw err;
    callback(result);
  });
};

/**
 * Insert hs-metadata by scenario id
 * @param {*} db database connection instance
 * @param {*} modelID search option catalog by a scenario model ID
 * @param {*} document option catalog document
 * @param {*} callback callback function
 */
//update model by scenario id
OptionCatalog.prototype.updateOptionCatalog = function (
  db,
  modelID,
  name,
  document,
  callback
) {db.collection("options").replaceOne(
    { 'modelID' : modelID, 'name' : name },
    document,
    function (err, result) {
      if (err) throw err;
      callback(result);
    }
  );
};


module.exports = OptionCatalog;
